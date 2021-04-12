import { ethers } from "ethers";
import abi from './erc1155.abi.json';

export async function isTransactionMined(transactionHash) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const txReceipt = await provider.getTransactionReceipt(transactionHash);
  if (txReceipt && txReceipt.blockNumber) {
    return true;
  }
  return false;
}

export async function isApprovedNFT(contractAddr, ownerAddr, opAddr, signer) {  
    const erc1155 = new ethers.Contract(contractAddr, abi, signer);
    const approved = await erc1155.isApprovedForAll(ownerAddr, opAddr);
    return approved;
}

export async function setApprovalForAll(contractAddr, opAddr, approved, signer) {
    const erc1155 = new ethers.Contract(contractAddr, abi, signer);
    const { hash } = await erc1155.setApprovalForAll(opAddr, approved);
    try {
      while (true) {
        let mined = await isTransactionMined(hash);
        if (mined) break;
      }
    } catch (e) {
      console.error(e);
      return "";
    }
    return hash;
}


export async function getURI1155(contractAddr, id, signer) {
  const erc1155 = new ethers.Contract(contractAddr, abi, signer);
  try {
    const uri = await erc1155.uri(id);
    if (uri.indexOf("ipfs:/") >= 0) {
      const sps = uri.split('/');
      return "https://ipfs.io/ipfs/" + sps[sps.length - 1];
    }
    return uri;
  } catch(e) {}
  return "";
}

export async function getBalance1155(contractAddr, userAddr, id, signer) {
  const erc1155 = new ethers.Contract(contractAddr, abi, signer);
  const balance = await erc1155.balanceOf(userAddr, id);
  return parseInt(balance.toString());
}