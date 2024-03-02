export interface IChain {
	name: string,
	chainId: number,
	endpoint: string
}

export const chains: IChain[] = [
	{
		name: 'ethereum-sepolia',
		chainId: 11155111,
		endpoint: 'https://ethereum-sepolia-rpc.publicnode.com'
	},
	{
		name: 'optimism-sepolia',
		chainId: 11155420,
		endpoint: 'https://optimism-sepolia-rpc.publicnode.com'
	},
	{
		name: 'hedera-previewnet',
		chainId: 297,
		endpoint: 'https://previewnet.hashio.io/api'
	},
]
