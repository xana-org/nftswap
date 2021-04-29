import { useEffect, useState }  from "react";
import { useWallet }            from "use-wallet";
import { useRouter }            from "next/router";
import { ethers, BigNumber }    from "ethers";
import Axios                    from "axios";
import {
    Box,
    Text,
    Spinner,
    Flex,
    NumberInput,
    NumberInputField,
    useToast,
    SimpleGrid,
} from "@chakra-ui/core";
import { getSwap }              from "../../apollo/query";
import Swap                     from "../../components/swap";
import { getWalletAddress }     from "../../lib/wallet"; 
import {
    getDecimals
} from "../../contracts/erc20";
import {
    getBalance1155,
    isApprovedNFT,
    setApprovalForAll,
} from "../../contracts/erc1155";
import {
    getBalance721
} from "../../contracts/erc721";
import {
    getBalance,
    approveToken,
    isApproved20,
} from "../../contracts/erc20";
import {
    swapNFT
} from "../../contracts/zoraswap";
import { ZORA_SWAP, ZORA_TOKEN } from "../../constants/const";

const SwapPage = () => {
    // define hooks
    const toast = useToast()
    const router = useRouter();
    const swapId = router.query ? router.query.id : '';
    const { loading, error, data } = getSwap(swapId);
    const [swap, setSwap] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [buyerBalance, setBuyerBalance] = useState('');
    const [sellerBalance, setSellerBalance] = useState('');
    const [isApproved, setIsApproved] = useState(false);
    const [batchCount, setBatchCount] = useState(0);
    const [leftAmount, setLeftAmount] = useState('');
    const [creator, setCreator] = useState("");
    const [creditScore, setCreditScore] = useState(null);
    const [scoreLoading, setScoreLoading] = useState(0);

    const wallet = useWallet();
    const walletAddress = getWalletAddress(wallet);
    const provider = walletAddress ? new ethers.providers.Web3Provider(wallet.ethereum) : null;
    const signer = provider?.getSigner();

    // define functions
    useEffect(() => {
        if (!swapId) router.push("/");

    }, []);

    useEffect(async () => {
        if (data && data.swapLists && data.swapLists.length) {
            setSwap(data.swapLists[0]);
            const swap = data.swapLists[0];
            let approved = false;
            if (swap.buyerTokenType === "0") {
                const balance = await getBalance(swap.buyerTokenAddr, walletAddress, signer);
                const amount = BigNumber.from(balance).mul(BigNumber.from(swap.leftAmount));
                approved = await isApproved20(swap.buyerTokenAddr, walletAddress, ZORA_SWAP, amount, signer);
            }
            else {
                approved = await isApprovedNFT(
                    swap.buyerTokenAddr,
                    walletAddress,
                    ZORA_SWAP,
                    signer
                );
            }
            setLoaded(true);
            setIsApproved(approved);
            updateBalance(swap);
            setLeftAmount(parseInt(swap.leftAmount));
            setCreator(swap.sellerAddr);
            fetchZoraCreditScore(swap.sellerAddr);
        }
    }, [loading, error, data]);

    const fetchZoraCreditScore = async (address) => {
        if (scoreLoading === 1) return;
        try {
            const res = await Axios.get("https://zora.cc/rating/" + address);
            console.log(res);
            if (res && res.data && res.data.status) {
                setScoreLoading(1);
                setCreditScore(res.data.result);
            }
            else {
                setScoreLoading(-1);
            }
        } catch(e) {
            setScoreLoading(-1);
        }
    }

    const updateBalance = async (swap) => {
        let balance = 0;
        if (swap.sellerTokenType === "1")
            balance = await getBalance1155(swap.sellerTokenAddr, swap.sellerAddr, swap.sellerTokenId, signer);
        else
            balance = await getBalance721(swap.sellerTokenAddr, swap.sellerAddr, swap.sellerTokenId, signer);
        setSellerBalance(balance);
        if (swap.buyerTokenType === "0") {
            const decimals = await getDecimals(swap.buyerTokenAddr, signer);
            const balance = await getBalance(swap.buyerTokenAddr, walletAddress, signer);
            const amount = parseInt(balance) / Math.pow(10, decimals);
            setBuyerBalance(amount);
        }
        else {
            if (swap.buyerTokenType === "1")
                balance = await getBalance1155(swap.buyerTokenAddr, walletAddress, swap.buyerTokenId, signer);
            else if (swap.buyerTokenType === "2")
                balance = await getBalance721(swap.buyerTokenAddr, walletAddress, swap.buyerTokenId, signer);
            setBuyerBalance(balance);
        }
    }

    const onApprove = async () => {
        if (!swap) return;
        if (swap.buyerTokenType === "0") {
            await approveToken(
                swap.buyerTokenAddr,
                ZORA_SWAP,
                "115792089237316195423570985008687907853269984665640564039457584007913129639935",
                signer
            );
        }
        else {
            await setApprovalForAll(
              swap.buyerTokenAddr,
              ZORA_SWAP,
              true,
              signer
            );
        }
        setIsApproved(true);
        toast({
            title: "Approve Swap",
            description: "Swap is approved",
            status: "success",
            duration: 4000,
            isClosable: true,
            variant: "top-accent"
        });
    }

    const getZoraBalance = async () => {
        const provider = new ethers.providers.Web3Provider(wallet.ethereum);
        const network = await provider._networkPromise;
        const address = ZORA_TOKEN[network.chainId].address;
        const decimals = 9;
        const walletAddress = getWalletAddress(wallet);
        let balance = await getBalance(address, walletAddress, provider);
        balance = parseFloat(ethers.utils.formatUnits(balance, "ether")) * Math.pow(10, 18 - decimals);
        return balance;
    }

    const onAcceptSwap = async () => {
        if (!batchCount || parseInt(batchCount === 0)) {
            toast({
              title: "Accept Swap",
              description: "Quantity is Invalid.",
              status: "error",
              duration: 4000,
              isClosable: true,
              variant: "top-accent"
            });
            return;
        }
        if (batchCount > leftAmount) {
            toast({
              title: "Accept Swap",
              description: "Quantity is too big",
              status: "error",
              duration: 4000,
              isClosable: true,
              variant: "top-accent"
            });
            return;
        }
        if (sellerBalance < batchCount) {
            toast({
              title: "Accept Swap",
              description: "Seller doesn't have enough assets",
              status: "error",
              duration: 4000,
              isClosable: true,
              variant: "top-accent"
            });
            return;
        }
        if (swap.buyerTokenType === "0") {
            const decimals = await getDecimals(swap.buyerTokenAddr, signer);
            const amount = batchCount * parseInt(swap.buyerTokenAmount) / Math.pow(10, decimals);
            if (buyerBalance < amount) {
                toast({
                  title: "Accept Swap",
                  description: "You don't have enough assets",
                  status: "error",
                  duration: 4000,
                  isClosable: true,
                  variant: "top-accent"
                });
                return;
            }
        } else {
            if (buyerBalance < batchCount) {
                toast({
                  title: "Accept Swap",
                  description: "You don't have enough assets",
                  status: "error",
                  duration: 4000,
                  isClosable: true,
                  variant: "top-accent"
                });
                return;
            }
        }

        const zoraBalance = await getZoraBalance();
        try {
            await swapNFT(
                parseInt(swap.id),
                batchCount,
                zoraBalance,
                signer
            );
            setLeftAmount(leftAmount - batchCount);
            updateBalance(swap);
        } catch (e) {
            toast({
              title: "Accpet Swap",
              description: "Swap failed, please try again",
              status: "error",
              duration: 4000,
              isClosable: true,
              variant: "top-accent"
            });

        }
    }

    const retryAgain = () => {
        setScoreLoading(0);
        fetchZoraCreditScore(creator);
    }

    const renderZoraScore = () => {
        if (scoreLoading === -1) {
            return (
                <Flex flexDirection="row" justifyContent="center">
                    <Text fontSize="13px" color="red.600" textAlign="center" m="0.5rem 0">Failed to load data</Text>
                    <Flex bg="red.500" borderRadius="30px" color="white" p="0 1rem" ml="2rem"
                        cursor="pointer" userSelect="none" _hover={{bg: "red.700"}} transition="0.3s" onClick={retryAgain}
                    >
                        <Text m="auto 0" fontSize="12px" fontWeight="bold">Retry</Text>
                    </Flex>
                </Flex>
            )
        }
        if (scoreLoading === 0 || creditScore === null) {
            return (
                <Flex flexDirection="row" justifyContent="center">
                    <Spinner/>
                </Flex>
            )
        }
        console.log(creditScore);
        const tList = [];
        for ( const item in creditScore.extra) {
            console.log(item);
            if (item !== "max" && item !== "portfolio" &&  item !== "eth")
                tList.push({
                    name: item,
                    data: creditScore.extra[item]
                });
        }
        return (
            <Flex flexDirection="column" w="100%" mt="1rem">
                <SimpleGrid spacing="1rem" minChildWidth="15rem" w="100%">
                    <Box border="1px solid #4F5494" borderRadius="5px" p="1rem">
                        <Flex flexDirection="row">
                            <Text fontWeight="bold" fontSize="14px" mr="0.5rem">Age: </Text>
                            <Text fontSize="14px">{creditScore.age}</Text>
                        </Flex>
                        <Flex flexDirection="row">
                            <Text fontWeight="bold" fontSize="14px" mr="0.5rem">Eth balance: </Text>
                            <Text fontSize="14px">{parseFloat(creditScore.ethBalance).toFixed(4)} ETH</Text>
                        </Flex>
                        <Flex flexDirection="row">
                            <Text fontWeight="bold" fontSize="14px" mr="0.5rem">Max GWEI: </Text>
                            <Text fontSize="14px">{parseFloat(creditScore.maxGwei).toFixed(4)}</Text>
                        </Flex>
                        <Flex flexDirection="row">
                            <Text fontWeight="bold" fontSize="14px" mr="0.5rem">Mac Nounce: </Text>
                            <Text fontSize="14px">{creditScore.maxNonce}</Text>
                        </Flex>
                        <Flex flexDirection="row">
                            <Text fontWeight="bold" fontSize="14px" mr="0.5rem">Total Gas Spent: </Text>
                            <Text fontSize="14px">{parseFloat(creditScore.totalGasSpent).toFixed(4)}</Text>
                        </Flex>
                        <Flex flexDirection="row">
                            <Text fontWeight="bold" fontSize="14px" mr="0.5rem">Tx Count: </Text>
                            <Text fontSize="14px">{creditScore.txCount}</Text>
                        </Flex>
                    </Box>
                    {tList.map((item, index) => {
                        return (
                            <Box key={index} border="1px solid #ccc" borderRadius="5px" p="1rem">
                                <Text fontWeight="bold">{item.name}</Text>
                                <Text fontSize="13px" color="#333">Sent: {parseFloat(item.data.sent).toFixed(4)}</Text>
                                <Text fontSize="13px" color="#333">Received: {parseFloat(item.data.received).toFixed(4)}</Text>
                                <Text fontSize="13px" color="#333">Trading: {parseFloat(item.data.trading).toFixed(4)}</Text>
                                <Text fontSize="13px" color="#333">
                                    Fee: 
                                    ETH {parseFloat(item.data.exchangefee.ETH).toFixed(2)} / USD {parseFloat(item.data.exchangefee.USD).toFixed(2)}
                                </Text>
                            </Box>
                        )
                    })}
                </SimpleGrid>
            </Flex>
        )
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
                    Accept Swap
                </Text>
                <Text
                    textAlign="center"
                    fontSize="18px"
                    color="gray.300"
                    pb="2rem"
                    >
                    Input amount you want to get
                </Text>
                {loaded?
                    <Swap
                        swap={swap}
                        buyerBalance={buyerBalance}
                        sellerBalance={sellerBalance}
                    />:
                    <Flex flexDirection="row">
                        <Spinner m="auto"/>
                    </Flex>
                }
            </Box>
            <Box
                boxShadow="0 2px 13px 0 rgba(0, 0, 0, 0.21)"
                p="2rem 1rem"
                borderBottomRadius="30px"
            >
                <Flex flexDirection="row" w="100%" justifyContent="center">
                    <Flex flexDirection="column" mr="1rem">
                        <Text fontWeight="bold" color="#444">Quantity ({leftAmount} left)</Text>
                        <Text fontSize="12px" color="#444">Number of items to get</Text>
                    </Flex>
                    <NumberInput w="100px" m="auto 0">
                        <NumberInputField
                            borderBottom="1px solid #ccc"
                            value={batchCount}
                            onChange={(e) => {
                                setBatchCount(e.target.value);
                            }}
                        />
                    </NumberInput>
                    {!isApproved ? 
                        <Flex bg="blue.900" borderRadius="30px" color="white" p="0 1rem" ml="2rem"
                            cursor="pointer" userSelect="none" _hover={{bg: "blue.800"}} transition="0.3s" onClick={onApprove}
                        >
                            <Text m="auto 0" fontSize="12px" fontWeight="bold">Approve</Text>
                        </Flex>:
                        <Flex bg="#ccc" borderRadius="30px" color="white" p="0 1rem" ml="2rem"
                        cursor="pointer" userSelect="none"
                        >
                            <Text m="auto 0" fontSize="12px" fontWeight="bold">Approve</Text>
                        </Flex>
                    }
                    {isApproved?
                        <Flex bg="blue.900" borderRadius="30px" color="white" p="0 1rem" ml="1rem"
                            cursor="pointer" userSelect="none" _hover={{bg: "blue.800"}} transition="0.3s"
                            onClick={onAcceptSwap}
                        >
                            <Text m="auto 0" fontSize="12px" fontWeight="bold">Accept Swap</Text>
                        </Flex>:
                        <Flex bg="#ccc" borderRadius="30px" color="white" p="0 1rem" ml="1rem"
                            cursor="pointer" userSelect="none"
                        >
                            <Text m="auto 0" fontSize="12px" fontWeight="bold">Accept Swap</Text>
                        </Flex>
                    }
                </Flex>
                <Box width="100%" height="1px" bg="#ccc" m="2rem 0 1rem 0"/>
                <Text fontWeight="bold" color="#444" textAlign="center">Zoracles Credit Score</Text>
                <Text fontSize="13px" color="#444" textAlign="center" m="0.5rem 0">Created by: {creator}</Text>
                {renderZoraScore()}
            </Box>
        </Box>
    )
}

export default SwapPage;