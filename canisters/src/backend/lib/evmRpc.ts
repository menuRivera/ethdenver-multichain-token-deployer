// https://internetcomputer.org/docs/current/developer-docs/multi-chain/ethereum/evm-rpc

import { serialize } from "azle";
import { ThresholdECDSA } from "./thresholdECDSA";

enum EthMethod {
	getTransactionCount = 'eth_getTransactionCount',
	sendRawTransaction = 'eth_sendRawTransaction',
	getTransactionReceipt = 'eth_getTransactionReceipt',
	estimateGas = 'eth_estimateGas',
}

class EvmRpc {
	thresholdSigner: ThresholdECDSA;
	private address: string;

	constructor(thresholdSigner: ThresholdECDSA) {
		this.thresholdSigner = thresholdSigner
		this.address = 'icp://be2us-64aaa-aaaaa-qaabq-cai'
	}

	private async call(ethMethod: EthMethod, params: any) {
		const response = await fetch(`${this.address}/${ethMethod}`,
			{
				body: serialize({
					candidPath: '/src/evm_rpc.did',
					args: [
						{ EthSepolia: [[{ Alchemy: null }, { Ankr: null }]] },
						[],
						params
					],
					cycles: 1_000_000_000
				})
			}
		);
		return response.json();
	}

	// canister native
	getTransactionCount() {
		return this.call(EthMethod.getTransactionCount, {
			address: this.thresholdSigner.publicKey,
			block: {
				Latest: null
			}
		})
	}
	async sendRawTransaction() { } // canister native
	async getTransactionReceipt() { } //canister native
	// async estimateGas() { } // manual implementation
}
