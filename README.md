# MULTICHAIN TOKEN DEPLOYER
Deploy an ERC-721 token to multiple chains using the threshold ECDSA keypairs from ICP.

## How it works

## Project structure
- canisters/ -> azle project that holds ICP canisters
    - src/ 
        - backend/ -> Express server canister responsible for the API
        - frontend/ -> Launchpad frontend
- nft-contract/ -> foundry project with the actual NFT contract to be deployed on multiple chains
    - src/ -> source code of the contract 

## Run the project
1. Start ICP relica with `dfx start --clean`
2. `cd canisters`
3. Install dependencies with `npm install`
4. Deploy evm_rpc canister with `dfx deploy evm_rpc --argument '(record { nodesInSubnet = 28 })'`
5. Deploy backend canister with `dfx deploy`
 
## Contributors
- [Manuel Rivera](https://github.com/menuRivera)
- [Rogelio Servin](https://github.com/rogservin)

