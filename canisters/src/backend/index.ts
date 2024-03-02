import { Server } from 'azle';
import express from 'express';
import { EvmRpc } from './lib/evmRpc';
import { ThresholdECDSA } from './lib/thresholdECDSA';

export default Server(() => {
	const app = express();
	app.use(express.json());

	app.get('/test', (req, res) => {
		res.json({ success: true, version: '1' })
	})

	app.post('/gasprice', async (req, res) => {
		try {
			const thresholdSigner = new ThresholdECDSA()
			await thresholdSigner.start()

			const evmRpc = new EvmRpc(thresholdSigner, 'hedera-previewnet')

			const gasPrice = await evmRpc.getGasPrice()
			const txCount = await evmRpc.getTransactionCount()

			console.log(JSON.parse(gasPrice.Ok))
			console.log(JSON.parse(txCount.Ok))

			// const gasPromises = chains.map(chain => new EvmRpc(thresholdSigner, chain.name).getGasPrice())
			// const gasPrices = await Promise.all(gasPromises)

			res.json({
				success: true,
				data: {
					gasPrice: JSON.parse(gasPrice.Ok),
					txCount: JSON.parse(txCount.Ok),
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

