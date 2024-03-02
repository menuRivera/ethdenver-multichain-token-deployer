import { EthMethod } from "./ethMethods"

export interface IJsonRpcBody {
	jsonrpc: string,
	id: number,
	method: EthMethod
	params: any[],
}
export interface IJsonRpcResponse {
	jsonrpc: string,
	id: number,
	result?: any,
	error?: any
}
