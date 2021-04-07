import { useState, useEffect, useRef } from "react";
import { useWallet } from "use-wallet";
import {
    Box,
    Text,
    SimpleGrid,
    Button,
    Spinner,
    Flex
} from "@chakra-ui/core";
import TokenBalanceCard                 from "../../components/tokencard";
import NFTBalanceCard                   from "../../components/nftcard";
import { SUPPORT_ERC20_TOKEN, CHAIN }   from "../../constants/addresses";
import { useTokenBalance }              from "../../apollo/query";
import { getWalletAddress }             from "../../lib/wallet";
import { getAllAssets }                 from "../../opensea/api";
import { PAGE_SIZE }                    from "../../constants/const";

const MyWallet = () => {
    // define hooks
    const wallet = useWallet();
    const walletAddress = getWalletAddress(wallet);
    const { loading, error, data } = useTokenBalance(walletAddress, 1000);
    const erc20Balances = SUPPORT_ERC20_TOKEN[CHAIN];
    const [tokenHolders, setTokenHolders] = useState([]);
    const [tokenOffset, setTokenOffset] = useState(0);
    const [tokenLoading, setTokenLoading] = useState(false);

    // define functions
    useEffect(() => {
      if (data && data.tokenHolders && data.tokenHolders.length) {
    //    setTokenHolders(data.tokenHolders);
      }
    }, [loading, error, data]);
    
    // get All NFTs using opeansea api
    useEffect(() => {
        loadTokens();
    }, []);

    const loadTokens = () => {
        setTokenLoading(true); //0x64dcbead3b25b94c1c07158c8a6ad6517b95513e
        getAllAssets(walletAddress, tokenOffset, PAGE_SIZE).then(res => {
            console.log(res, "opensea");
            setTokenLoading(false);
            const newTokens = [...tokenHolders, ...res.assets];
            setTokenHolders(newTokens);
            if (res.assets.length < PAGE_SIZE)
                setTokenOffset(-1);
            else
                setTokenOffset(tokenOffset + PAGE_SIZE);
        });
    }

    const onLoadMore = () => {
        if (tokenLoading)
            return;
        loadTokens();
    }

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
                    <Box/>
                    <Box/>
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
                                redirect={true}
                            />
                        )
                    })}
                </SimpleGrid>
                {tokenOffset != -1 && <Flex mt="1rem" justifyContent="center" alignItems="center">
                    <Button colorScheme="blue" color="white" variant="solid" size="lg" onClick={onLoadMore}>
                        {tokenLoading ? <Spinner/> : "Load More"}
                    </Button>
                </Flex>}
            </Box>
        </Box>
    );
}

export default MyWallet;