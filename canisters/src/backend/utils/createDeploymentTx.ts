import { ethers } from "ethers";
import { EvmRpc } from "../lib/evmRpc";
import { bytecode } from "./bytecode";

/**
	* Creates a contract deployment transaction and sends it to the given evmRpc chain
*/
export const createDeploymentTx = async (evmRpc: EvmRpc) => {
	// create the tx
	let tx = new ethers.Transaction()
	console.log('empty tx created')

	// fill tx values
	tx.nonce = BigInt((await evmRpc.getTransactionCount()).result)
	tx.gasPrice = BigInt((await evmRpc.getGasPrice()).result)
	tx.gasLimit = 50_000;
	tx.to = null
	tx.value = 0
	tx.data = bytecode
	tx.chainId = evmRpc.chain.chainId

	console.log('tx filled')

	// Get unsigned serialized hash
	const usignedSerializedTxHash = ethers.keccak256(tx.unsignedSerialized)
	const toSign = ethers.getBytes(usignedSerializedTxHash)

	console.log('to sign created')

	console.log(`tx.from: ${tx.from}`)

	// sign the tx using thresholdECDSA
	const signed = await evmRpc.thresholdSigner.sign(toSign)

	console.log('tx signed')

	// form the actual ECDSA signature and add it to the tx instance
	const r = ethers.hexlify(signed.slice(0, 32));
	const s = ethers.hexlify(signed.slice(32, 64));
	const v = 27;
	tx.signature = { r, s, v }

	console.log('tx formed')

	const toSend = tx.serialized

	console.log(`tx.from: ${tx.from}`)

	// send the tx
	const response = await evmRpc.sendRawTransaction(toSend)

	if (response.error) {
		throw response.error
	}

	console.log('tx sent, response: ', response)

	return {
		chain: evmRpc.chain.chainId,
		txHash: response.result as string
	}
}
