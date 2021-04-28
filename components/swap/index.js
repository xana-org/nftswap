import { useEffect, useState }  from "react";
import { useWallet }            from "use-wallet";
import { ethers }               from "ethers";
import {
    Flex,
    Box,
    Image,
    Text,
    Spinner,
    AspectRatio,
} from "@chakra-ui/core";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@chakra-ui/icons";
import { CHAIN }                from "../../constants/addresses";
import {
    getTokenSymbol,
    getDecimals
} from "../../contracts/erc20";
import { getNFTDetail } from "../../opensea/api";

const Swap = (props) => {
    // define hooks
    const { swap, buyerBalance, sellerBalance } = props;
    const [buyerToken, setBuyerToken] = useState(null);
    const [sellerToken, setSellerToken] = useState(null);

    const wallet = useWallet();
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);
    const signer = provider.getSigner();

    // define functions
    useEffect(async () => {
        if (!sellerToken) {
            const nftToken = await getNFTDetail(swap.sellerTokenAddr, swap.sellerTokenId);
            console.log(nftToken);
            setSellerToken(nftToken);
        }
        if (!buyerToken) {
            if (swap.buyerTokenType === "0") {
                const symbol = await getTokenSymbol(swap.buyerTokenAddr, signer);
                const decimals = await getDecimals(swap.buyerTokenAddr, signer);
                setBuyerToken({
                    type: 0,
                    address: swap.buyerTokenAddr,
                    amount: swap.buyerTokenAmount,
                    symbol: symbol,
                    decimals: parseInt(decimals)
                });
            }
            else {
                const nftToken = await getNFTDetail(swap.buyerTokenAddr, swap.buyerTokenId);
                console.log(nftToken);
                setBuyerToken(nftToken);
            }
        }
    }, []);

    const openTokenLink = (addr, id) => {
        if (CHAIN === 1) window.open("https://opensea.io/assets/" + addr + "/" + id);
        else if (CHAIN === 4) window.open("https://testnets.opensea.io/assets/" + addr + "/" + id);
    }
    
    const openErc20TokenLink = (addr) => {
        if (CHAIN === 1) window.open("https://etherscan.io/token/" + addr);
        else if (CHAIN === 4) window.open("https://rinkeby.etherscan.io/token/" + addr);
    }

    const renderNftToken = (nftToken, addr, id, pos) => {
        if (!nftToken) return (
            <Flex w="12rem">
                <Spinner m="1rem auto"/>
            </Flex>
        )
        return (
          <Box>
            <Flex flexDirection="column">
                <Text
                    textAlign="center"
                    fontSize="26px"
                    fontWeight="bold"
                    mb="0.5rem"
                >
                    {pos?"You'll send":"You'll receive"}
                </Text>
                <Box w="12rem" p="0.5rem" border="1px solid #ccc" borderRadius="10px">
                    {nftToken.animation_url?
                        <AspectRatio ratio={1} height="7rem" w="10.8rem">
                            <iframe
                                title="a"
                                src={nftToken.animation_url + "?autoplay=1&loop=1&autopause=0"}
                                allowFullScreen
                                w="100%"
                                h="100%"
                                allow="autoplay"
                            />
                        </AspectRatio>:
                        <Image 
                            height="7rem"
                            src={nftToken.image_thumbnail_url}
                            m="0 auto"
                        />
                    }
                    <Box mt="1rem" mb="0.2rem">
                        <Flex>
                            <Box>
                                <Text fontWeight="bold" fontSize="12px">
                                    {nftToken.name}
                                </Text>
                            </Box>
                        </Flex>
                    </Box>
                </Box>
            </Flex>
            <Text fontSize="12px" mt="0.5rem">
                {pos?"Your Balance: ":"Seller Balance: "}
                {pos?buyerBalance:sellerBalance}
            </Text>
            <Box w="12rem">
              <Box bg="white" color="blue.900" m="1rem" p="0.5rem" borderRadius="30px"
                border="1px solid #6095FF"
                cursor="pointer" userSelect="none" onClick={() => openTokenLink(addr, id)}
                transition="0.3s" _hover={{bg: "blue.800", color: "white"}}
              >
                <Text textAlign="center" fontSize="13px" fontWeight="bold">See Details</Text>
              </Box>
            </Box>
          </Box>
        )
    }

    const renderErc20 = (token) => {
        return (
            <Flex flexDirection="column">
                <Text
                    textAlign="center"
                    fontSize="26px"
                    fontWeight="bold"
                    mb="0.5rem"
                >
                    You'll send
                </Text>
                <Flex w="12rem" h="100%" p="0.5rem" border="1px solid #ccc" borderRadius="10px" flexDirection="column" justifyContent="center">
                    <Image src="/images/erc20/infinite.svg" w="3rem" m="0.5rem auto"/>
                    <Text fontSize="18px" fontWeight="bold" textAlign="center">{token.symbol}</Text>
                    <Text textAlign="center">{parseInt(token.amount) / Math.pow(10, token.decimals)}</Text>
                </Flex>
                <Text fontSize="12px" mt="0.5rem">
                    Your Balance: {buyerBalance} 
                </Text>
                <Box w="12rem">
                    <Box bg="white" color="blue.900" m="1rem" p="0.5rem" borderRadius="30px"
                        border="1px solid #6095FF"
                        cursor="pointer" userSelect="none" onClick={() => openErc20TokenLink(token.address)}
                        transition="0.3s" _hover={{bg: "blue.800", color: "white"}}
                    >
                        <Text textAlign="center" fontSize="13px" fontWeight="bold">Token Link</Text>
                    </Box>
                </Box>
            </Flex>
        )
    }
    
    return (
        <Box>
            <Flex flexDirection="row" justifyContent="center">
                {buyerToken && buyerToken.type === 0?
                renderErc20(buyerToken):
                renderNftToken(buyerToken, swap.buyerTokenAddr, swap.buyerTokenId, 1)}
                <Box  m="auto 1rem">
                    <Flex flexDirection="column" color="blue.800">
                        <ArrowLeftIcon m="0.2rem"/>
                        <ArrowRightIcon m="0.2rem"/>
                    </Flex>
                </Box>
                {renderNftToken(sellerToken, swap.sellerTokenAddr, swap.sellerTokenId, 0)}
            </Flex>
        </Box>
    )
}

export default Swap;