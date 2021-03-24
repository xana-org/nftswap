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