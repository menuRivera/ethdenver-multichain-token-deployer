// https://internetcomputer.org/docs/current/developer-docs/multi-chain/ethereum/evm-rpc
import { serialize } from "azle";
import { ThresholdECDSA } from "./thresholdECDSA";
import { IChain, chains } from "../utils/chains";

// canister native evm rpc methods 
enum EthMethod {
	getTransactionCount = 'eth_getTransactionCount',
	sendRawTransaction = 'eth_sendRawTransaction',
	getTransactionReceipt = 'eth_getTransactionReceipt',
	estimateGas = 'eth_estimateGas',
}

export class EvmRpc {
	private address: string;
	private thresholdSigner: ThresholdECDSA;
	chain: IChain;

	constructor(thresholdSigner: ThresholdECDSA, chainName: string) {
		this.address = 'icp://be2us-64aaa-aaaaa-qaabq-cai';
		this.thresholdSigner = thresholdSigner;
		this.chain = chains.find(chain => chain.name === chainName)!
	}

	private async callNative(ethMethod: EthMethod, params: any) {
		console.log('EvmRpc.callNative() called')
		const response = await fetch(`${this.address}/${ethMethod}`,
			{
				body: serialize({
					candidPath: '/src/evm_rpc.did',
					args: [
						{ Custom: chains[0] }, // change this
						[],
						params
					],
					cycles: 1_000_000_000
				})
			}
		);
		return response.json();
	}

	private async callCustom(method: string, params: any[]) {
		console.log('EvmRpc.callCustom() called')
		const response = await fetch(`${this.address}/request`, {
			body: serialize({
				candidPath: '/src/evm_rpc.did',
				args: [
					// JsonRpcSource
					{ Chain: this.chain.chainId },
					// text?
					JSON.stringify({
						jsonrpc: '2.0',
						method,
						params,
						id: 1
					}),
					// nat64?
					1000
				],
				cycles: 1_000_000_000

			})
		})
		return response.json()
	}

	getTransactionCount() {
		return this.callNative(EthMethod.getTransactionCount, {
			address: this.thresholdSigner.publicKey,
			block: { Latest: null }
		})
	}
	getTransactionReceipt(txHash: string) {
		return this.callNative(EthMethod.getTransactionReceipt, txHash)
	}
	sendRawTransaction(tx: string) {
		// todo: validate tx
		return this.callNative(EthMethod.sendRawTransaction, tx)
	}
	getGasPrice() {
		return this.callCustom('eth_gasPrice', [])
	}
}
