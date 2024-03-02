import { Server } from 'azle';
import express from 'express';
import { EvmRpc } from './lib/evmRpc';
import { ThresholdECDSA } from './lib/thresholdECDSA';
// import { chains } from './utils/chains';


export default Server(() => {
	const app = express();
	app.use(express.json());

	app.get('/test', (req, res) => {
		res.json({ success: true })
	})

	app.post('/token', (req, res) => {
		// todo: deploy the token
		// must return a list of the chains / addresses deployed
		res.json({ success: true });
	});

	app.post('/gasprice', async (req, res) => {
		try {
			const thresholdSigner = new ThresholdECDSA()

			await thresholdSigner.start()
			const evmRpc = new EvmRpc(thresholdSigner, 'ethereum-sepolia')

			const gasPrice = await evmRpc.getGasPrice()

			console.log(JSON.parse(gasPrice.Ok))

			// const gasPromises = chains.map(chain => new EvmRpc(thresholdSigner, chain.name).getGasPrice())
			// const gasPrices = await Promise.all(gasPromises)

			res.json({
				success: true,
				data: JSON.parse(gasPrice.Ok)
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

