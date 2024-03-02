// https://internetcomputer.org/docs/current/developer-docs/multi-chain/ethereum/evm-rpc
import { serialize } from "azle";
import { ThresholdECDSA } from "./thresholdECDSA";
import { IChain, chains } from "../utils/chains";
import { ethers } from "ethers";

// canister native evm rpc methods 
enum EthMethod {
	getTransactionCount = 'eth_getTransactionCount',
	sendRawTransaction = 'eth_sendRawTransaction',
	getTransactionReceipt = 'eth_getTransactionReceipt',
	estimateGas = 'eth_estimateGas',
	gasPrice = 'eth_gasPrice',
}

export class EvmRpc {
	private address: string;
	private thresholdSigner: ThresholdECDSA;
	chain: IChain;

	constructor(thresholdSigner: ThresholdECDSA, chainName: string) {
		this.address = 'icp://bkyz2-fmaaa-aaaaa-qaaaq-cai';
		this.thresholdSigner = thresholdSigner;
		this.chain = chains.find(chain => chain.name === chainName)!
	}

	private async call(method: EthMethod, params: any[]) {
		console.log('EvmRpc.callCustom() called')
		const response = await fetch(`${this.address}/request`, {
			body: serialize({
				candidPath: '/src/evm_rpc.did',
				args: [
					// JsonRpcSource
					// { Chain: this.chain.chainId },
					{
						Custom: {
							url: this.chain.endpoint,
							headers: []
							// headers: [{ name: 'Content-Type', value: 'application/json' }]
						}
					},
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
		return this.call(EthMethod.getTransactionCount, [
			this.thresholdSigner.address,
			'latest'
		])
	}
	getTransactionReceipt(txHash: string) {
		return this.call(EthMethod.getTransactionReceipt, [txHash])
	}
	sendRawTransaction(signedTx: string) {
		this.call(EthMethod.sendRawTransaction, [signedTx])
	}

	getGasPrice() {
		return this.call(EthMethod.gasPrice, [])
	}
}
