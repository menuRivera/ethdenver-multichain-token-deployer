export interface ITxBody {
	to: string | undefined,
	value: bigint | undefined,
	gasPrice: bigint,
	gasLimit: bigint,
	nonce: bigint,
}
