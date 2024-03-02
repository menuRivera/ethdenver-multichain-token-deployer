import { useEffect, useState } from 'react';
import { Box, Button, Card, Image, Input, Label, Spinner, Text } from 'theme-ui';

const baseUrl = import.meta.env.VITE_CANISTER_ORIGIN

function App() {

	const [name, setName] = useState('')
	const [symbol, setSymbol] = useState('')
	const [description, setDescription] = useState('')
	const [image, setImage] = useState('')
	const [connected, setConnected] = useState(false)

	useEffect(() => {
		getServerStatus()
	})

	const getServerStatus = async () => {
		const response = await fetch(`${baseUrl}/test`)
		const actualRes = await response.json()

		if (actualRes.success) setConnected(true)
	}

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

					{connected
						? <Text color='green'>Connected</Text>
						: <Spinner title='Connecting...'></Spinner>
					}
					<Image sx={{ width: '40%', margin: 'auto' }} src='/Token_Magician.png'></Image>

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
