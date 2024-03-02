import { useEffect, useState } from 'react';
import { Button, Card, Flex, Image, Spinner, Text } from 'theme-ui';

const baseUrl = import.meta.env.VITE_CANISTER_ORIGIN

function App() {
	const [canisterAddress, setCansiterAddress] = useState<string>('')
	const [txHashes, setTxHashes] = useState<string[]>([])
	const [loading, setLoading] = useState<boolean>(false)

	useEffect(() => {
		if (baseUrl) {
			getServerStatus()
		}
	})

	const getServerStatus = async () => {
		const response = await fetch(`${baseUrl}/get-address`, {
			method: 'POST'
		})
		const actualRes = await response.json()

		if (actualRes.success) setCansiterAddress(actualRes.data)
	}

	const deploy = async () => {
		setLoading(true)
		const response = await fetch(`${baseUrl}/tokens`, {
			method: 'POST'
		})
		const actualRes = await response.json()

		if (!actualRes.success) alert('something went wrong')

		// @ts-ignore no time for typing
		setTxHashes(actualRes.data.map(tx => tx.explorer))
		setLoading(false)
	}

	return (
		<div className="container">
			<Card>
				<Flex sx={{ flexDirection: 'column' }}>
					{canisterAddress
						? <Text color='green'>Connected, canister evm address: {canisterAddress}</Text>
						: <Spinner title='Connecting...'></Spinner>
					}
					<Image sx={{ width: '40%', margin: '15px auto' }} src='/Token_Magician.png'></Image>

					<Button sx={{ backgroundColor: 'darkblue' }} onClick={deploy} variant='dark'>Deploy on multiple blockchains</Button>

					{txHashes.map(txHash => <a key={txHash}>{txHash}</a>)}
				</Flex>
			</Card>
		</div>
	);
}

export default App;
