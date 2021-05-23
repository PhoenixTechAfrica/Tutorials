import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";

import CharloDAO from "./contracts/CharloDAO.json";

// const provider = "https://alfajores-forno.celo-testnet.org";
export const provider = "http://localhost:7545";

const web3 = new Web3(provider);
const kit = newKitFromWeb3(web3);
const contractInstance = getInstance()

async function getInstance() {
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = CharloDAO.networks[networkId];

    return new web3.eth.Contract(CharloDAO.abi, deployedNetwork && deployedNetwork.address);
}

export {
    provider, web3, kit, contractInstance,
}
