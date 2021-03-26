import { useState, useEffect } from "react";
import { useWallet } from "use-wallet";
import {
    Box,
    Text,
    SimpleGrid,
} from "@chakra-ui/core";
import TokenBalanceCard                 from "../../components/tokencard";
import NFTBalanceCard                   from "../../components/nftcard";
import { SUPPORT_ERC20_TOKEN, CHAIN }   from "../../constants/addresses";
import { useTokenBalance }              from "../../apollo/query";
import { getWalletAddress }             from "../../lib/wallet";
import { getAllAssets }                 from "../../opensea/api";
const MyWallet = () => {
    // define hooks
    const wallet = useWallet();
    const walletAddress = getWalletAddress(wallet);
    const { loading, error, data } = useTokenBalance(walletAddress, 1000);
    const erc20Balances = SUPPORT_ERC20_TOKEN[CHAIN];
    const [tokenHolders, setTokenHolders] = useState([]);
    // define functions
    useEffect(() => {
        console.log(data, loading, error);
      if (data && data.tokenHolders && data.tokenHolders.length) {
    //    setTokenHolders(data.tokenHolders);
      }
    }, [loading, error, data]);
    
    // get All NFTs using opeansea api
    useEffect(() => {
        getAllAssets(walletAddress).then(res => {
            console.log(res, "opensea");
            setTokenHolders(res.assets);
        })
    }, [])
    return (
        <Box w="100%">
            <Box 
                w="100%"
                bg="blue.900"
                color="white"
                p="2rem 1rem"
                borderTopRadius="30px"
            >
                <Text
                    textAlign="center"
                    fontSize="30px"
                    fontWeight="bold"
                    pb="1.5rem"
                >
                    Token Balances
                </Text>
                <SimpleGrid spacing="1rem" w="100%" minChildWidth="250px">
                    {erc20Balances.map((item, index) => {
                        return (
                            <TokenBalanceCard
                                key={index}
                                token={item}
                            />
                        )
                    })}
                </SimpleGrid>
            </Box>
            <Box
                boxShadow="0 2px 13px 0 rgba(0, 0, 0, 0.21)"
                p="2rem 1rem"
                borderBottomRadius="30px"
            >
                <Text
                    textAlign="center"
                    fontSize="30px"
                    fontWeight="bold"
                    pb="1.5rem"
                    color="blue.900"
                >
                    NFT Balances
                </Text>
                <SimpleGrid spacing="1rem" w="100%" minChildWidth="300px">
                    {tokenHolders.map((item, index) => {
                        return (
                            <NFTBalanceCard
                                key={index}
                                token={item}
                            />
                        )
                    })}
                    <Box/>
                    <Box/>
                </SimpleGrid>
            </Box>
        </Box>
    );
}

export default MyWallet;