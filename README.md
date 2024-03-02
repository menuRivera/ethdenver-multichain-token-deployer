# MULTICHAIN TOKEN DEPLOYER
Deploy an ERC-721 token to multiple chains using the threshold ECDSA signatures from ICP.

## How it works
The project takes advantage of the threshold ECDSA signatures to deploy a given smart contract (nft-contract) to multiple chains, it does so by leveraging json rpc interactions the evm_rpc ICP canister.

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
5. Deploy canisters running `npm run deploy`
 
## Contributors
- [Manuel Rivera](https://github.com/menuRivera)
- [Rogelio Servin](https://github.com/rogservin)

