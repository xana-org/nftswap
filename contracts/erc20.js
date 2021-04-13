import { ethers } from "ethers";
import abi from './erc20.abi.json';

export async function isTransactionMined(transactionHash) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const txReceipt = await provider.getTransactionReceipt(transactionHash);
    if (txReceipt && txReceipt.blockNumber) {
      return true;
    }
    return false;
}

export async function getBalance(coinAddress, address, signer) {
    const erc20 = new ethers.Contract(coinAddress, abi, signer);
    const balance = await erc20.balanceOf(address);
    return balance.toString();
}

export async function getTokenSymbol(coinAddress, signer) {
    const erc20 = new ethers.Contract(coinAddress, abi, signer);
    const symbol = erc20.symbol();
    return symbol;
}

export async function getDecimals(coinAddress, signer) {
    const erc20 = new ethers.Contract(coinAddress, abi, signer);
    const decimals = erc20.decimals();
    return decimals;
}

export async function isApproved20(coinAddress, wallet, contract, amount, signer) {
    const erc20 = new ethers.Contract(coinAddress, abi, signer);
    const allowance = (await erc20.allowance(wallet, contract)) || 0;
    const need = ethers.BigNumber.from(amount);
    if (ethers.BigNumber.from(allowance).gte(need)) {
      return true;
    }
    return false;
}

export async function approveToken(coinAddress, contract, amount, signer) {
    const erc20 = new ethers.Contract(coinAddress, abi, signer);
    const need = ethers.BigNumber.from(amount);
    const { hash } = await erc20.approve(contract, need.toString());
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