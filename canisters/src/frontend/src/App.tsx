import { useState } from 'react';
import { Box, Button, Card, Image, Input, Label } from 'theme-ui';

function App() {

	const [name, setName] = useState('')
	const [symbol, setSymbol] = useState('')
	const [description, setDescription] = useState('')
	const [image, setImage] = useState('')

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		const body = { name, symbol, description, image }

		alert(JSON.stringify(body))


		// todo: add fetch here
		// const res = await (await fetch('our url', {
		// 	method: 'POST',
		// 	body: JSON.stringify(fetch),
		// 	headers: { 'Content-Type': 'application/json' }
		// })).json()
	};

	return (
		<div className="container">
			<Card>
				<Box as="form" onSubmit={handleSubmit}>
					<Image sx={{ width: '50%', margin: 'auto' }} src='/Token_Magician.png'></Image>

					<Label>
						Name
						<Input onChange={(e) => setName(e.target.value)} />
					</Label>
					<Label>
						Symbol
						<Input onChange={(e) => setSymbol(e.target.value)} />
					</Label>
					<Label>
						Description
						<Input onChange={(e) => setDescription(e.target.value)} />
					</Label>
					<Label>
						Image url
						<Input onChange={(e) => setImage(e.target.value)} />
					</Label>


					<Button sx={{ backgroundColor: 'darkblue' }} type='submit' variant='dark'>Submit</Button>
				</Box>
			</Card>
		</div>
	);
}

export default App;
