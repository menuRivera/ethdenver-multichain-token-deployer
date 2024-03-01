import { None, ic } from "azle";
import { managementCanister } from 'azle/canisters/management';

export class ThresholdECDSA {
	publicKey: Uint8Array | undefined;

	async start() {
		// get public key
		const publicKeyResult = await ic.call(
			managementCanister.ecdsa_public_key,
			{
				args: [
					{
						canister_id: None,
						derivation_path: [],
						key_id: {
							curve: { secp256k1: null },
							name: 'threshold-key'
						}
					}
				]
			}
		);

		this.publicKey = publicKeyResult.public_key
	}

	async sign(messageHash: Uint8Array) {
		if (messageHash.length !== 32) {
			ic.trap('messageHash must be 32 bytes');
		}

		const signatureResult = await ic.call(
			managementCanister.sign_with_ecdsa,
			{
				args: [
					{
						message_hash: messageHash,
						derivation_path: [],
						key_id: {
							curve: { secp256k1: null },
							name: 'threshold-key'
						}
					}
				],
				cycles: 10_000_000_000n
			}
		);

		return signatureResult
	}
}
