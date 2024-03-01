import { Server } from 'azle';
import express from 'express';

export default Server(() => {
	const app = express();

	app.use(express.json());

	app.get('/test', (req, res) => {
		res.json({ success: true })
	})

	app.post('/token', (req, res) => {
		// todo: deploy the token
		res.json({ success: true });
	});

	app.use(express.static('/dist'));

	return app.listen();
});

