// https://internetcomputer.org/docs/current/developer-docs/multi-chain/ethereum/evm-rpc
import { serialize } from "azle";
import { ThresholdECDSA } from "./thresholdECDSA";
import { chains } from "../utils/chains";
import { IChain } from "../types/chain";
import { IJsonRpcBody, IJsonRpcResponse } from "../types/jsonrpc";
import { EthMethod } from "../types/ethMethods";

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
		return res.Ok as IJsonRpcResponse
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
