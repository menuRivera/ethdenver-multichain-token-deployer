import { ic, serialize } from "azle";
import { managementCanister } from 'azle/canisters/management'

export class ThresholdECDSA {
	publicKey: Uint8Array | undefined;

	async start() {
		console.log('ThresholdECDSA.start()')
		const publicKey = await getPublicKeyResult()

		this.publicKey = publicKey
	}

	async sign(messageHash: Uint8Array) {
		console.log('ThresholdECDSA.sign()')

		if (messageHash.length !== 32) {
			ic.trap('messageHash must be 32 bytes');
		}

		const signatureResult = await getSignatureResult(messageHash)
		return signatureResult
	}
}


// https://github.com/demergent-labs/azle/blob/main/examples/motoko_examples/threshold_ecdsa/src/index.ts
async function getPublicKeyResult() {
	console.log('getPublicKeyResult')
	const caller = ic.caller().toUint8Array()
	console.log(caller)


	console.log('right before raw_rand')
	const resultIcCall = await ic.call(managementCanister.raw_rand);

	console.log('resultIcCall', resultIcCall)
	const result = await fetch('icp://aaaaa-aa/raw_rand');

	console.log('result', result);

	const publicKeyResponse = await fetch(
		`icp://aaaaa-aa/ecdsa_public_key`,
		{
			body: serialize({
				args: [
					{
						canister_id: [],
						derivation_path: [caller],
						key_id: {
							curve: { secp256k1: null },
							name: 'dfx_test_key'
						}
					}
				]
			})
		}
	);
	console.log('response: ', publicKeyResponse)

	const res = await publicKeyResponse.json()
	console.log({ res })

	return res
}

async function getSignatureResult(messageHash: Uint8Array) {
	const publicKeyResponse = await fetch(
		`icp://aaaaa-aa/sign_with_ecdsa`,
		{
			body: serialize({
				args: [
					{
						message_hash: messageHash,
						derivation_path: [],
						key_id: {
							curve: { secp256k1: null },
							name: 'dfx_test_key'
						}
					}
				],
				cycles: 10_000_000_000n
			})
		}
	);

	return await publicKeyResponse.json();
}
