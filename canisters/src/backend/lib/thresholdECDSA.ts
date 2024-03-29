import { ic, serialize } from "azle";
import { ethers } from "ethers";

export class ThresholdECDSA {
	publicKey: Uint8Array | undefined;
	address: string | undefined;

	async start() {
		console.log('ThresholdECDSA.start()')
		const publicKey = await getPublicKey()

		this.publicKey = publicKey.public_key
		this.address = ethers.computeAddress(ethers.hexlify(this.publicKey))
	}

	async sign(messageHash: Uint8Array) {
		console.log('ThresholdECDSA.sign()')

		if (messageHash.length !== 32) {
			ic.trap('messageHash must be 32 bytes');
		}

		const signatureResult = await signMessage(messageHash)
		return signatureResult.signature
	}
}


// https://github.com/demergent-labs/azle/blob/main/examples/motoko_examples/threshold_ecdsa/src/index.ts
async function getPublicKey() {
	console.log('getPublicKey')
	// const caller = ic.id().toUint8Array()

	const publicKeyResponse = await fetch(
		`icp://aaaaa-aa/ecdsa_public_key`,
		{
			body: serialize({
				args: [
					{
						canister_id: [],
						derivation_path: [],
						key_id: {
							curve: { secp256k1: null },
							name: 'dfx_test_key'
						}
					}
				]
			})
		}
	);
	const res = await publicKeyResponse.json()
	return res as { public_key: Uint8Array, chain_code: Uint8Array }
}

async function signMessage(messageHash: Uint8Array) {
	// const caller = ic.caller().toUint8Array()
	// const caller = ic.id().toUint8Array()

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

	const res = await publicKeyResponse.json();
	return res as { signature: Uint8Array }
}
