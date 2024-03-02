// https://internetcomputer.org/docs/current/developer-docs/multi-chain/ethereum/evm-rpc
import { serialize } from "azle";
import { ThresholdECDSA } from "./thresholdECDSA";
import { IChain } from "../types/chain";
import { IJsonRpcBody, IJsonRpcResponse } from "../types/jsonrpc";
import { EthMethod } from "../types/ethMethods";

export class EvmRpc {
	private address: string;
	thresholdSigner: ThresholdECDSA;
	chain: IChain;

	constructor(thresholdSigner: ThresholdECDSA, chain: IChain) {
		this.address = 'icp://bkyz2-fmaaa-aaaaa-qaaaq-cai';
		this.thresholdSigner = thresholdSigner;
		this.chain = chain
	}

	/**
		* Makes a jsonrpc request 
	* @param method - A valid jsonrpc eth_method 
	* @param params - An array containing the list of params
	*/
	private async call(method: EthMethod, params: any[]) {
		console.log(`EvmRpc.call for ${method}`)

		const body: IJsonRpcBody = {
			jsonrpc: '2.0',
			method,
			params,
			id: 1
		}
		const response = await fetch(`${this.address}/request`, {
			body: serialize({
				candidPath: '/src/evm_rpc.did',
				args: [
					// JsonRpcSource
					{ Custom: { url: this.chain.endpoint, headers: [] } },
					// body (text)
					JSON.stringify(body),
					// number?
					1000
				],
				cycles: 1_000_000_000

			})
		})
		const res = await response.json()
		if (!('Ok' in res)) {
			throw { message: JSON.stringify(res) }
		}
		return JSON.parse(res.Ok) as IJsonRpcResponse
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
	getGasPrice() {
		return this.call(EthMethod.gasPrice, [])
	}
	sendRawTransaction(signedTx: string) {
		return this.call(EthMethod.sendRawTransaction, [signedTx])
	}
}
