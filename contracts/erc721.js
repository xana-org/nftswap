import { ethers } from "ethers";
import abi from "./erc721.abi.json";

export async function getURI721(contractAddr, id, signer) {
    const erc721 = new ethers.Contract(contractAddr, abi, signer);
    let uri = "";
    try {
      uri = await erc721.tokenURI(id);
      if (uri.indexOf("ipfs:/") >= 0) {
        const sps = uri.split('/');
        return "https://ipfs.io/ipfs/" + sps[sps.length - 1];
      }
      if (uri.indexOf("Deploy new contract") >=0 && uri.indexOf("beepletwoedition") >= 0) {
        const sps = uri.split('/');
        return "https://api.niftygateway.com/beepletwoedition/" + sps[sps.length - 1];
      }
      return uri;
    } catch(e) {
        console.log("Error in getToken URI" + e);
        return "";
    }
}

export async function getBalance721(contractAddr, userAddr, id, signer) {
    const erc721 = new ethers.Contract(contractAddr, abi, signer);
    const ownerAddr = await erc721.ownerOf(id);
    return ownerAddr.toLowerCase() === userAddr.toLowerCase() ? 1 : 0;
}
