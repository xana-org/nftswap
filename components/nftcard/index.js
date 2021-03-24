import { useEffect, useState }  from "react";
import { useWallet }            from "use-wallet";
import { ethers }               from "ethers";
import {
    Flex,
    Box,
    Image,
    Text,
    Spinner,
} from "@chakra-ui/core";
import {
    shortenWalletAddress,
    getWalletAddress
} from "../../lib/wallet";

const NFTBalanceCard = (props) => {
    // define hooks
    const amount = parseInt(props.amount);
    const tokenId = parseInt(props.tokenId);
    const contractAddress = props.contractAddress;
    
    // define functions
    const openTokenLink = (address) => {
        if (CHAIN === "mainnet")
            window.open("https://etherscan.io/address/" + address);
        else if (CHAIN === "rinkeby")
            window.open("https://rinkeby.etherscan.io/address/" + address);
    }

    return (
        <Box w="100%" bg="blue.800" p="1rem" borderRadius="10px">
            
        </Box>
    )
}

export default NFTBalanceCard;