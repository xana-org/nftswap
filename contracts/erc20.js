import { ethers } from "ethers";
import abi from './erc20.abi.json';

export async function getBalance(coinAddress, address, provider) {
    const erc20 = new ethers.Contract(coinAddress, abi, provider);
    if (!erc20) {
        return '';
    }
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