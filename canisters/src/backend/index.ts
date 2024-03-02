import express from 'express';
import { Server } from 'azle';
import { EvmRpc } from './lib/evmRpc';
import { ThresholdECDSA } from './lib/thresholdECDSA';
import { chains } from './utils/chains';
import { ethers } from 'ethers';
import { createDeploymentTx } from './utils/createDeploymentTx';

export default Server(() => {
	const app = express();
	app.use(express.json());

	app.get('/test', (req, res) => {
		res.json({ success: true, version: '5' })
	})

	app.post('/tokens', async (req, res) => {
		try {
			// get signer
			const thresholdSigner = new ThresholdECDSA()
			await thresholdSigner.start()

			// create a deployment tx for each chain
			const txHashesPromises = chains.map(chain => createDeploymentTx(new EvmRpc(thresholdSigner, chain)))
			const txHashes = await Promise.all(txHashesPromises)
			// todo: get tx receipts?

			// send txHashes
			res.json({
				success: true,
				data: txHashes
			})
		} catch (error) {
			console.error(JSON.stringify(error))
			res.json({
				success: false,
				error: JSON.stringify(error)
			})
		}
	})

	app.post('/get-address', async (req, res) => {
		const thresholdSigner = new ThresholdECDSA()
		await thresholdSigner.start()

		res.json({
			success: true,
			data: thresholdSigner.address
		})
	})

	app.post('/gasprice', async (req, res) => {
		try {
			const thresholdSigner = new ThresholdECDSA()
			await thresholdSigner.start()

			const gasPromises = chains.map(chain => new EvmRpc(thresholdSigner, chain).getGasPrice())
			const gasPricesResults = await Promise.all(gasPromises)
			const gasPrices = gasPricesResults.map(g => g.result)

			res.json({
				success: true,
				data: {
					gasPrices
				}
			})
		} catch (error) {
			console.error(JSON.stringify(error))
			res.json({
				success: false,
				error: JSON.stringify(error)
			})
		}
	})

	app.use(express.static('/dist'));

	return app.listen();
});

