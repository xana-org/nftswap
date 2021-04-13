import { ethers } from "ethers";
import { ZORA_SWAP } from "../constants/const";
import abi from './zoraswap.abi.json';

export async function isTransactionMined(transactionHash) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const txReceipt = await provider.getTransactionReceipt(transactionHash);
    if (txReceipt && txReceipt.blockNumber) {
      return true;
    }
    return false;
}
  
function calcFee(zoraBalance) {
    if (zoraBalance >= 5) return "0";
    if (zoraBalance >= 1.5) return "0.03";
    return "0.05";
}
export async function createSwap(
    sellerTokenAddr,
    sellerTokenId,
    sellerTokenAmount,
    sellerTokenType,
    buyerTokenAddr,
    buyerTokenId,
    buyerTokenAmount,
    buyerTokenType,
    zoraBalance,
    signer,
  ) {
  const zoraswap = new ethers.Contract(ZORA_SWAP, abi, signer);
  if (!zoraswap) {
      return '';
  }
  const fee = calcFee(zoraBalance);
  const { hash } = await zoraswap.createSwap(
    sellerTokenAddr,
    sellerTokenId,
    sellerTokenAmount,
    sellerTokenType,
    buyerTokenAddr,
    buyerTokenId,
    buyerTokenAmount,
    buyerTokenType,
    { value: ethers.utils.parseEther(fee)}
  );
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

export async function swapNFT(listId, batchCount, zoraBalance, signer) {
  const zoraswap = new ethers.Contract(ZORA_SWAP, abi, signer);
  if (!zoraswap) {
      return '';
  }

  const fee = calcFee(zoraBalance);
  const { hash } = await zoraswap.swapNFT(
    listId,
    batchCount,
    { value: ethers.utils.parseEther(fee)}
  );
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