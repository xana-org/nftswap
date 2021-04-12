import { useState, useEffect } from "react";
import { useWallet }           from "use-wallet";
import { ethers }              from "ethers";
import {
    Flex,
    Box,
    NumberInput,
    NumberInputField,
    Image,
    Radio,
    RadioGroup,
    Stack,
    Text,
    Spinner,
    Modal,
    ModalOverlay,
    ModalContent,
    IconButton,
    InputLeftElement,
    InputGroup,
    Input,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Button,
    AspectRatio,
    Spacer,
    useToast,
} from "@chakra-ui/core";
import {
  SearchIcon,
  ChevronDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CloseIcon
} from "@chakra-ui/icons";
import {
    shortenWalletAddress,
    getWalletAddress
} from "../lib/wallet";
import { useContext }                 from "react";
import Axios                          from "axios";
import InfiniteScroll                 from "react-infinite-scroller";
import { COINGECKO_URL, ZORA_TOKEN }  from "../constants/const";
import { formatNumber }               from "../lib/helper";
import { getBalance }                 from "../contracts/erc20";
import { PAGE_SIZE }                  from "../constants/const";
import { getAllAssets, getNFTDetail } from "../opensea/api";
import NFTBalanceCard                 from "../components/nftcard";
import { MyContext }                  from "../contexts/Context";
import { createSwap }                 from "../contracts/zoraswap";
import { ZORA_SWAP }                  from "../constants/const";
import {
  isApprovedNFT,
  setApprovalForAll,
  getBalance1155,
} from "../contracts/erc1155";
import {
  getBalance721
} from "../contracts/erc721";

const Home = () => {
  // define hooks
  const toast = useToast()
  const [mycontext, setContext] = useContext(MyContext);
  const [isOpen, setIsOpen] = useState(false);
  const [nftBalance, setNftBalance] = useState(0);
  const [type_right, setTypeRight] = useState("r_erc20");
  const [tokenList, setTokenList] = useState([]);
  const [filteredTokenList, setFilteredTokenList] = useState([]);
  const [rightToken, setRightToken] = useState(ZORA_TOKEN[4]);
  const [rightTokenAmount, setRightTokenAmount] = useState(0);

  const [batchCount, setBatchCount] = useState(0);

  const [filterText, setFilterText] = useState("");
  const [balance, setBalance] = useState(-1);
  const [tokenShowCount, setTokenShowCount] = useState(30);
  const [tokenLoading, setTokenLoading] = useState(false);
  const [tokenHolders, setTokenHolders] = useState([]);
  const [isOpenERC20, setIsOpenERC20] = useState(false);
  const [tokenOffset, setTokenOffset] = useState(0);

  const [rightNftToken, setRightNftToken] = useState(null);
  const [rightNftTokenAddress, setRightNftTokenAddress] = useState("");
  const [rightNftTokenId, setRightNftTokenId] = useState(0);
  const [rightNftTokenLoading, setRightNftTokenLoading] = useState(false);
  const [leftTokenApproved, setLeftTokenApproved] = useState(false);
  const wallet = useWallet();

  // define functions
  useEffect(async () => {
    try {
      const ethersProvider = new ethers.providers.Web3Provider(wallet.ethereum);
      const network = await ethersProvider._networkPromise;
      if (network.chainId === 1) {
        Axios.get(COINGECKO_URL).then(res => {
          setTokenList(res.data.tokens);
          setFilteredTokenList(res.data.tokens);
        });
      } else {
  
      }
    } catch (e) {
      
    }
  }, []);

  useEffect(async () => {
    if (!mycontext.nftToken) {
      setLeftTokenApproved(false);
      setNftBalance(0);
    }
    else if(leftTokenApproved === false){
      const leftToken = mycontext.nftToken;
      const provider = new ethers.providers.Web3Provider(wallet.ethereum);
      const signer = provider.getSigner();
      const walletAddress = getWalletAddress(wallet);
      const is_L_approved = await isApprovedNFT(
        leftToken.asset_contract.address,
        walletAddress,
        ZORA_SWAP,
        signer
      );
      setLeftTokenApproved(is_L_approved);
      console.log("LeftToken", leftToken);
      let balance = 1;
      if (leftToken.asset_contract.schema_name === "ERC1155")
        balance = await getBalance1155(leftToken.asset_contract.address, walletAddress, leftToken.token_id, signer);
      setNftBalance(balance);
    }
  }, [mycontext]);
  
  const getTokenBalance = async (token) => {
    if (type_right !== "r_erc20") return;
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);
    const { address, decimals } = token;
    const walletAddress = getWalletAddress(wallet);
    if (!address) return;
    let balance = await getBalance(address, walletAddress, provider);
    if (decimals === 18)
      balance = parseFloat(ethers.utils.formatUnits(balance, "ether"));
    else 
      balance = parseFloat(ethers.utils.formatUnits(balance, "ether")) * Math.pow(10, 18 - decimals);
    setBalance(formatNumber(balance, 3));
  }

  const getZoraBalance = async () => {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);
    const address = ZORA_TOKEN[4].address;
    const decimals = 9;
    const walletAddress = getWalletAddress(wallet);
    let balance = await getBalance(address, walletAddress, provider);
    balance = parseFloat(ethers.utils.formatUnits(balance, "ether")) * Math.pow(10, 18 - decimals);
    return balance;
  }

  useEffect(() => {
    if (wallet && wallet.ethereum) {
      getTokenBalance(rightToken);
    }
  }, [wallet]);

  useEffect(() => {
    loadTokens();
  }, []);

  const loadTokens = () => {
    setTokenLoading(true);
    const walletAddress = getWalletAddress(wallet);
    getAllAssets(walletAddress, tokenOffset, PAGE_SIZE).then(res => {
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

  const openDrawer = () => {
    setIsOpen(true);
  }

  const onClose = () => {
    setIsOpen(false);
  }

  const openTokenLink = (link) => {
      window.open(link);
  }

  const onApproveSwap = async () => {
    if (!leftTokenApproved) {
      const leftToken = mycontext.nftToken;
      const provider = new ethers.providers.Web3Provider(wallet.ethereum);
      const signer = provider.getSigner();
      console.log("approving")
      await setApprovalForAll(
        leftToken.asset_contract.address,
        ZORA_SWAP,
        true,
        signer
      );
      console.log("approved")
      setLeftTokenApproved(true);
      toast({
        title: "Approve Swap",
        description: "Swap is approved",
        status: "success",
        duration: 4000,
        isClosable: true,
        variant: "top-accent"
      });
    }
  }

  const onCreateSwap = async () => {
    if (!batchCount || parseInt(batchCount) === 0) {
      toast({
        title: "Create Swap",
        description: "Quantity is Invalid.",
        status: "error",
        duration: 4000,
        isClosable: true,
        variant: "top-accent"
      });
      return;
    }
    if (type_right === "r_erc20" && !rightTokenAmount) {
      toast({
        title: "Create Swap",
        description: "ERC20 token amount should be bigger than 0.",
        status: "error",
        duration: 4000,
        isClosable: true,
        variant: "top-accent"
      });
      return;
    }
    if (type_right !== "r_erc20" && !rightNftToken) {
      toast({
        title: "Create Swap",
        description: "Please select NFT you want to receive",
        status: "error",
        duration: 4000,
        isClosable: true,
        variant: "top-accent"
      });
      return;
    }
    if (nftBalance < batchCount) {
      toast({
        title: "Create Swap",
        description: "You don't have enough assets",
        status: "error",
        duration: 4000,
        isClosable: true,
        variant: "top-accent"
      });
      return;
    }
    const leftToken = mycontext.nftToken;
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);
		const signer = provider.getSigner();
    const walletAddress = getWalletAddress(wallet);
    const is_L_approved = await isApprovedNFT(
      leftToken.asset_contract.address,
      walletAddress,
      ZORA_SWAP,
      signer
    );
    if (!is_L_approved) {
      toast({
        title: "Create Swap",
        description: "Swap is not approved",
        status: "error",
        duration: 4000,
        isClosable: true,
        variant: "top-accent"
      });
      return;
    }
    const zoraBalance = await getZoraBalance();
    try {
      await createSwap(
        leftToken.asset_contract.address, // sellerTokenAddr 
        leftToken.token_id, // sellerTokenId 
        batchCount, // sellerTokenAmount 
        leftToken.asset_contract.schema_name === "ERC1155" ? 1 : 2,// sellerTokenType 
        type_right === "r_erc20" ? rightToken.address : rightNftToken.asset_contract.address, // buyerTokenAddr 
        type_right === "r_erc20" ? 0 : 
        rightNftToken.token_id, // buyerTokenId 
        type_right === "r_erc20" ? rightTokenAmount * Math.pow(10, 9) : 0,// buyerTokenAmount 
        type_right === "r_erc20" ? 0 : 
        (rightNftToken.asset_contract.schema_name === "ERC1155" ? 1 : 2), // buyerTokenType 
        zoraBalance,
        signer
      );
      toast({
        title: "Create Swap",
        description: "Swap is created.",
        status: "success",
        duration: 4000,
        isClosable: true,
        variant: "top-accent"
      });
    } catch(e) {
      toast({
        title: "Create Swap",
        description: "Create failed, please try again",
        status: "error",
        duration: 4000,
        isClosable: true,
        variant: "top-accent"
      });

    }
  }

  const onOpenTokenLink = async (e, addr) => {
    e.preventDefault();
    e.stopPropagation();
		const ethersProvider = new ethers.providers.Web3Provider(wallet.ethereum);
    const network = await ethersProvider._networkPromise;
    if (network.chainId === 1) {
      window.open("https://etherscan.io/address/" + addr);
    }else if (network.chainId === 4) {
      window.open("https://rinkeby.etherscan.io/address/" + addr);
    }
  }

  const loadMoreToken = () => {
    setTokenShowCount(tokenShowCount + 30 > filteredTokenList.length ? filteredTokenList.length : tokenShowCount + 30);
  }
  
  const onFilterTextChange = (e) => {
    setFilterText(e.target.value);
    if (e.target.value) {
      const fText = e.target.value.toLowerCase();
      const fList = tokenList.filter((item) => {
        return item.address.toLowerCase().indexOf(fText) >= 0 ||
          item.name.toLowerCase().indexOf(fText) >= 0 || 
          item.symbol.toLowerCase().indexOf(fText) >= 0
      });
      setFilteredTokenList(fList);
    } else setFilteredTokenList(tokenList);
  }

  const onErc20TokenSelection = (token) => {
    setRightToken({
      type: 0,
      name: token.name,
      symbol: token.symbol,
      address: token.address,
      logoURI: token.logoURI,
      decimals: token.decimals
    });
    setBalance(-1);
    setIsOpenERC20(false);
    getTokenBalance(token);
  }

  const onBatchCountChange = (e) => {
    setBatchCount(e.target.value);
  }

  const onRightTokenAmountChange = (e) => {
    setRightTokenAmount(e.target.value);
  }

  const renderNftToken = (nftToken, pos) => {
    const {collection, last_sale, sell_orders} = nftToken;
    let currentPrice = null;
    let lastPrice = null;
    if (last_sale) {
        const {total_price, payment_token} = last_sale;
        lastPrice = {
            img: payment_token.image_url,
            symbol: payment_token.symbol,
            price: total_price / Math.pow(10, payment_token.decimals)
        }
    }
    if (sell_orders && sell_orders.length) {    
        const order = sell_orders[0];
        const {base_price, quantity, payment_token_contract: { decimals, image_url, symbol }} = order;
        currentPrice = {
            img: image_url,
            symbol: symbol,
            price: quantity ? base_price / Math.pow(10, decimals) / quantity : 0
        }
    }
    return (
      <Box mt="1rem" ml="auto" w="100%">
        <Flex flexDirection="column">
          <Box w="14rem" ml={pos?"0":"auto"} p="0.5rem" border="1px solid #ccc" borderRadius="10px">
            <Flex cursor="pointer" onClick={() => {
              if (pos)
                setRightNftToken(null);
              else
                setContext({nftToken: null});
              }} mb="0.5rem">
              <CloseIcon ml="auto"/>
            </Flex>
            {nftToken.animation_url?
                <AspectRatio ratio={1} height="7rem" w="12rem">
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
                        <Text fontSize="10px" color="#ddd">
                            {collection.name}
                        </Text>
                        <Text fontWeight="bold" fontSize="14px">
                            {nftToken.name}
                        </Text>
                        {!pos &&
                          <Text fontSize="12px">
                            Balance: {nftBalance}
                          </Text>
                        }
                    </Box>
                    <Spacer />
                    {currentPrice && <Box fontSize="14px">
                        <Text textAlign="right">
                            Price
                        </Text>
                        <Flex>
                            <Text ml="0.5rem" fontWeight="bold">
                                {currentPrice.price}
                            </Text>
                            {currentPrice.img ?(<Tooltip label={currentPrice.symbol} aria-label="A tooltip">
                                <Image src={currentPrice.img} height="1.5em"/>
                            </Tooltip>):<Text m="0 0.1rem">{currentPrice.symbol}</Text>}
                        </Flex>
                    </Box>}
                </Flex>
                {lastPrice && <Flex mt="0.3rem" justifyContent="flex-end" alignItems="center" fontSize="14px" >
                    <Flex>
                        <Text textAlign="right" m="auto 0" fontSize="12px">
                            Last Price: 
                        </Text>
                        <Flex m="auto 0">
                            <Text m="auto 0.2rem auto 0.2rem" fontWeight="bold" fontSize="12px">
                                {lastPrice.price}
                            </Text>
                            {lastPrice.img ?(
                              <Tooltip label={lastPrice.symbol} aria-label="A tooltip" fontSize="12px">
                                <Image src={lastPrice.img} height="1.5em"/>
                              </Tooltip>):<Text fontSize="12px">{lastPrice.symbol}</Text>}
                        </Flex>
                    </Flex>
                </Flex>}
            </Box>
          </Box>
        </Flex>
        <Box w="14rem" ml={pos?"0":"auto"}>
          <Box bg="white" color="blue.900" m="1rem 2rem" p="0.5rem" borderRadius="30px"
            cursor="pointer" userSelect="none" onClick={() => openTokenLink(nftToken.permalink)}
            transition="0.3s" _hover={{bg: "blue.800", color: "white"}}
          >
            <Text textAlign="center" fontSize="13px" fontWeight="bold">See Details</Text>
          </Box>
        </Box>
      </Box>
    )
  }

  const loadRightNFT = async () => {
    setRightNftTokenLoading(true);
    const rightNft = await getNFTDetail(rightNftTokenAddress, rightNftTokenId);
    setRightNftTokenLoading(false);
    if (rightNft.permalink) {
      console.log("rightNft", rightNft);
      setRightNftToken(rightNft);
    } else {
      toast({
        title: "Load NFT",
        description: "NFT address or token Id is invalid.",
        status: "error",
        duration: 4000,
        isClosable: true,
        variant: "top-accent"
      });
      return;
    }
  }

  const renderLeftToken = () => {
    if (!mycontext.nftToken)
      return (
        <Box mt="1rem" ml="auto" w="100%">
          <Flex w="10rem" h="10rem" border="1px solid white" borderRadius="10px" ml="auto"
            cursor="pointer" flexDirection="column" onClick={openDrawer}
          >
            <Text fontWeight="bold" m="auto">Select NFT</Text>
          </Flex>
        </Box>
      )
    return (
      <Box>
        {renderNftToken(mycontext.nftToken, 0)}
      </Box>
    )
  }

  const renderRightToken = () => {
    if (type_right === "r_erc20")
      return (
        <Box mt="1rem" ml="auto" w="100%">
          <Flex flexDirection="row">
            <Flex flexDirection="row" cursor="pointer" userSelect="none">
              <Box w="3.4rem" h="3.4rem" m="auto .5rem" borderRadius="100%" bg="blue.800" onClick={() => {setIsOpenERC20(true)}}>
                <Image src={rightToken.logoURI} w="2rem" h="2rem" m="0.7rem"/>
              </Box>
              <Flex flexDirection="row" onClick={() => {setIsOpenERC20(true)}}>
                <Text fontSize="24px" fontWeight="bold" m="auto 0">{rightToken.symbol}</Text>
                <ChevronDownIcon m="auto 0.4rem"/>
              </Flex>
              <NumberInput w="100px" m="auto 0">
                <NumberInputField value={rightTokenAmount} onChange={onRightTokenAmountChange}/>
              </NumberInput>
            </Flex>
          </Flex>
          <Flex flexDirection="row">
            <Text >Balance: </Text>
            {balance === -1 ?
                <Spinner m="auto 1rem" size="sm"/>:
                <Text pl="1rem">{balance}</Text>
            } 
          </Flex>
        </Box>
      )
    if (rightNftToken) {
      return (
        <Box>
          {renderNftToken(rightNftToken, 1)}
        </Box>
      )
    }
    return (
      <Box mt="1rem">
        <Input
          placeholder="Address"
          width="400px"
          value={rightNftTokenAddress}
          onChange={(e) => setRightNftTokenAddress(e.target.value)}
        />
        <NumberInput w="200px" m="auto 0">
          <NumberInputField
            placeholder="Token Id"
            value={rightNftTokenId}
            onChange={(e) => setRightNftTokenId(e.target.value)}
          />
        </NumberInput>
        {rightNftTokenLoading?
          <Flex m="1rem 0" p="0.5rem" w="200px"><Spinner m="auto"/></Flex>:
          <Box bg="white" color="blue.900" m="1rem 0" p="0.5rem" borderRadius="30px" w="200px"
            cursor="pointer" userSelect="none" transition="0.3s" _hover={{bg: "blue.800", color: "white"}}
          >
            <Text textAlign="center" fontSize="13px" fontWeight="bold" onClick={loadRightNFT}>Load NFT</Text>
          </Box>
        }
      </Box>
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
          Create a Swap
        </Text>
        <Text
          textAlign="center"
          fontSize="18px"
          color="gray.300"
          pb="2rem"
        >
          Select the NFTs and amounts for your trade
        </Text>
        <Flex flexDirection="row" justifyContent="center">
          <Flex flexDirection="column" w="100%">
            <Text
              textAlign="right"
              fontSize="26px"
              fontWeight="bold"
              mb="2.5rem"
            >
              You'll send
            </Text>
            {renderLeftToken()}
          </Flex>
          <Box  m="auto 3rem">
            <Flex flexDirection="column">
              <ArrowLeftIcon m="0.2rem"/>
              <ArrowRightIcon m="0.2rem"/>
            </Flex>
          </Box>
          <Box w="100%">
            <Text
              fontSize="26px"
              fontWeight="bold"
            >
              You'll receive
            </Text>
            <RadioGroup onChange={setTypeRight} value={type_right} mt="1rem" >
              <Stack direction="row">
                <Radio value="r_erc20" mr="1rem" _before={{color: "white"}}>ERC20</Radio>
                <Radio value="r_nft" _before={{color: "white"}}>NFT</Radio>
              </Stack>
            </RadioGroup>
            {renderRightToken()}
          </Box>
        </Flex>
      </Box>
      <Box
          boxShadow="0 2px 13px 0 rgba(0, 0, 0, 0.21)"
          p="2rem 1rem"
          borderBottomRadius="30px"
      >
        <Flex flexDirection="row" w="100%" justifyContent="center">
          <Flex flexDirection="column" mr="1rem">
            <Text fontWeight="bold" color="#444">Quantity</Text>
            <Text fontSize="12px" color="#444">Number of items to sell</Text>
          </Flex>
          <NumberInput w="100px" m="auto 0">
            <NumberInputField
              borderBottom="1px solid #ccc"
              onChange={onBatchCountChange}
              value={batchCount}
            />
          </NumberInput>
          {mycontext.nftToken && !leftTokenApproved?
            <Flex bg="blue.900" borderRadius="30px" color="white" p="0 1rem" ml="2rem"
              cursor="pointer" userSelect="none" _hover={{bg: "blue.800"}} transition="0.3s"
              onClick={onApproveSwap}
            >
              <Text m="auto 0" fontSize="12px" fontWeight="bold">Approve</Text>
            </Flex>:
            <Flex bg="#ccc" borderRadius="30px" color="white" p="0 1rem" ml="2rem"
              cursor="pointer" userSelect="none"
            >
              <Text m="auto 0" fontSize="12px" fontWeight="bold">Approve</Text>
            </Flex>
          }
          {mycontext.nftToken && leftTokenApproved?
            <Flex bg="blue.900" borderRadius="30px" color="white" p="0 1rem" ml="1rem"
              cursor="pointer" userSelect="none" _hover={{bg: "blue.800"}} transition="0.3s"
              onClick={onCreateSwap}
            >
              <Text m="auto 0" fontSize="12px" fontWeight="bold">Create Swap</Text>
            </Flex>:
            <Flex bg="#ccc" borderRadius="30px" color="white" p="0 1rem" ml="1rem"
              cursor="pointer" userSelect="none"
            >
              <Text m="auto 0" fontSize="12px" fontWeight="bold">Create Swap</Text>
            </Flex>
          }
        </Flex>
      </Box>
      <Modal size="md" isOpen={isOpenERC20} onClose={() => setIsOpenERC20(false)}>
        <ModalOverlay/>
        <ModalContent borderRadius="5px" bg="white" p="2rem 1rem">
          <IconButton
            size="sm"
            icon={<CloseIcon/>}
            position="absolute"
            top="0.5rem"
            right="0.5rem"
            bg="none"
            _active={{}}
            _focus={{}}
            _hover={{}}
            onClick={() => setIsOpenERC20(false)}
          />
          <Text fontSize="24px" fontWeight="bold" textAlign="center" mt="1rem">
            Select Token
          </Text>
          <Text fontSize="14px" textAlign="center" color="gray.500" mb="1rem">
            Search token by name, symbol or address
          </Text>
          <InputGroup border="1px solid #6095FF80" borderRadius="10px">
            <InputLeftElement
              pointerEvents="none"
              children={<SearchIcon color="gray.300" />}
            />
            <Input
              placeholder="Search token by name, symbol or address"
              value={filterText}
              onChange={onFilterTextChange}
            />
          </InputGroup>
          <Text fontSize="24px" fontWeight="bold" mt="2rem" mb="1rem">
            Trusted By
          </Text>
          <Box h="300px" overflow="auto">
            <InfiniteScroll
              hasMore={true}
              loadMore={loadMoreToken}
              pageStart={0}
              initialLoad={false}
              useWindow={false}
            >
              {filteredTokenList.slice(0, tokenShowCount).map((item, index) => {
                return (
                  <Flex 
                    bg="gray.100"
                    p="0.6rem 1rem"
                    mb="10px"
                    key={index}
                    flexDirection="row"
                    borderRadius="8px"
                    cursor="pointer"
                    onClick={() => onErc20TokenSelection(item)}
                  >
                    <Image src={item.logoURI} w="1.6rem" h="1.6rem" m="auto 1rem auto 0"/>
                    <Flex flexDirection="column">
                      <Text fontSize="18px" fontWeight="500">{item.name}</Text>
                      <Text fontSize="12px" color="gray.600">{item.symbol}</Text>
                    </Flex>
                    <Flex flexDirection="column" ml="auto" justifyContent="flex-end" cursor="pointer" onClick={(e) => onOpenTokenLink(e, item.address)}>
                      <Text fontSize="12px" color="gray.600" m="auto 0" as="u">{shortenWalletAddress(item.address)}</Text>
                    </Flex>
                  </Flex>
                )
              })}
            </InfiniteScroll>
          </Box>
        </ModalContent>
      </Modal>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
      >
        <DrawerOverlay>
          <DrawerContent bg="white">
            <DrawerCloseButton />
            <DrawerHeader>Your NFTs</DrawerHeader>
            <DrawerBody>
              {tokenHolders.map((item, index) => {
                  return (
                    <Flex key={index} mb="0.5rem">
                      <NFTBalanceCard
                          token={item}
                          onClose={onClose}
                      />
                    </Flex>
                  )
              })}
              {tokenOffset != -1 && <Flex mt="1rem" justifyContent="center" alignItems="center">
                  <Button colorScheme="blue" color="white" variant="solid" size="lg" onClick={onLoadMore}>
                      {tokenLoading ? <Spinner/> : "Load More"}
                  </Button>
              </Flex>}
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Box>
  )
}

export default Home;