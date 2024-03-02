import { IChain } from "../types/chain";

export const chains: IChain[] = [
	// {
	// 	name: 'ethereum-sepolia',
	// 	chainId: 11155111,
	// 	endpoint: 'https://ethereum-sepolia-rpc.publicnode.com'
	// },
	{
		name: 'optimism-sepolia',
		chainId: 11155420,
		endpoint: 'https://optimism-sepolia-rpc.publicnode.com',
		explorer: 'https://sepolia-optimism.etherscan.io/tx'
	},
	{
		name: 'hedera-testnet',
		chainId: 296,
		endpoint: 'https://testnet.hashio.io/api',
		explorer: ''
	},
	// {
	// 	name: 'linea-goerli',
	// 	chainId: 59140,
	// 	endpoint: 'https://linea-goerli.blockpi.network/v1/rpc/public',
	// 	explorer: 'https://goerli.lineascan.build/tx'
	// }
]
