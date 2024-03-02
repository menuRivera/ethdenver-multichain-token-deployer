import express from 'express';
import { Server } from 'azle';
import { EvmRpc } from './lib/evmRpc';
import { ThresholdECDSA } from './lib/thresholdECDSA';
import { chains } from './utils/chains';
import { ethers } from 'ethers';

export default Server(() => {
	const app = express();
	app.use(express.json());

	app.get('/test', (req, res) => {
		res.json({ success: true, version: '3' })
	})

	app.post('/tokens', async (req, res) => {
		try {
			// get signer
			const thresholdSigner = new ThresholdECDSA()
			await thresholdSigner.start()

			// 1. receive values from req 

			// 2. create the tx
			let tx = new ethers.Transaction()

			// 3. fill tx values

			// 4. Get unsigned serialized hash
			const usignedSerializedTxHash = ethers.keccak256(tx.unsignedSerialized)
			const toSign = ethers.getBytes(usignedSerializedTxHash)

			// 5. sign the tx using thresholdECDSA
			const signed = await thresholdSigner.sign(toSign)

			const r = ethers.hexlify(signed.slice(0, 32));
			const s = ethers.hexlify(signed.slice(32, 64));
			const v = 27;

			// 6. add signature to tx
			tx.signature = { r, s, v }
			const toSend = tx.serialized

			// 7. send tx to multiple chains
			const txPromises = chains.map(chain => new EvmRpc(thresholdSigner, chain.name).sendRawTransaction(toSend))
			const txResults = await Promise.all(txPromises)

		} catch (error) {
			console.error(JSON.stringify(error))
			res.json({
				success: false,
				error: JSON.stringify(error)
			})
		}
	})

	app.post('/gasprice', async (req, res) => {
		try {
			const thresholdSigner = new ThresholdECDSA()
			await thresholdSigner.start()

			const gasPromises = chains.map(chain => new EvmRpc(thresholdSigner, chain.name).getGasPrice())
			const gasPrices = await Promise.all(gasPromises)

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

