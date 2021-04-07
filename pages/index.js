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
import { COINGECKO_URL, RIGHT_TOKEN } from "../constants/const";
import { formatNumber }               from "../lib/helper";
import { getBalance }                 from "../contracts/erc20";
import { PAGE_SIZE }                  from "../constants/const";
import { getAllAssets }               from "../opensea/api";
import NFTBalanceCard                 from "../components/nftcard";
import { MyContext }                  from "../contexts/Context";

const Home = () => {
  // define hooks
  const [mycontext, setContext] = useContext(MyContext);
  const [isOpen, setIsOpen] = useState(false);
  const [type_right, setTypeRight] = useState("l_erc20");
  const [tokenList, setTokenList] = useState([]);
  const [filteredTokenList, setFilteredTokenList] = useState([]);
  const [rightToken, setRightToken] = useState(RIGHT_TOKEN[4]);
  const [balance, setBalance] = useState(-1);
  const [isOpenERC20, setIsOpenERC20] = useState(false);
  const [tokenShowCount, setTokenShowCount] = useState(30);
  const [filterText, setFilterText] = useState("");
  const [tokenLoading, setTokenLoading] = useState(false);
  const [tokenHolders, setTokenHolders] = useState([]);
  const [tokenOffset, setTokenOffset] = useState(0);
  const wallet = useWallet();

  // define functions
  useEffect(() => {
    Axios.get(COINGECKO_URL).then(res => {
      setTokenList(res.data.tokens);
      setFilteredTokenList(res.data.tokens);
    });
  }, [])
  
  const getTokenBalance = async (token) => {
    if (type_right !== "l_erc20") return;
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
    const { nftToken } = mycontext;
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
    console.log(nftToken)
    return (
      <Box mt="1rem" ml="auto" w="100%">
        <Flex flexDirection="column">
          <Box w="18rem" ml="auto" p="1rem" border="1px solid #ccc" borderRadius="10px">
            <Flex cursor="pointer" onClick={() => setContext({nftToken: null})} mb="0.5rem">
              <CloseIcon ml="auto"/>
            </Flex>
            {nftToken.animation_url?
                <AspectRatio ratio={1} height="9rem" w="16rem">
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
                  height="9rem"
                  src={nftToken.image_thumbnail_url}
                  m="0 auto"
                />
            }
            <Box mt="1rem" mb="0.2rem">
                <Flex>
                    <Box>
                        <Text fontSize="12px" color="#ddd">
                            {collection.name}
                        </Text>
                        <Text fontWeight="bold">
                            {nftToken.name}
                        </Text>
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
                        <Text textAlign="right" m="auto 0" fontSize="12px" mt="0.2rem">
                            Last Price: 
                        </Text>
                        <Flex>
                            <Text m="auto 0 auto 0.2rem" fontWeight="bold">
                                {lastPrice.price}
                            </Text>
                            {lastPrice.img ?(<Tooltip label={lastPrice.symbol} aria-label="A tooltip">
                                <Image src={lastPrice.img} height="1.5em"/>
                            </Tooltip>):<Text m="0 0.1rem">{lastPrice.symbol}</Text>}
                        </Flex>
                    </Flex>
                </Flex>}
            </Box>
          </Box>
        </Flex>
        <Box w="18rem" ml="auto">
          <Box bg="white" color="blue.900" m="1rem 2rem" p="0.5rem" borderRadius="30px"
            cursor="pointer" userSelect="none" onClick={() => openTokenLink(nftToken.permalink)}
            transition="0.3s" _hover={{bg: "blue.800", color: "white"}}
          >
            <Text textAlign="center">See Details</Text>
          </Box>
        </Box>
      </Box>
    )
  }

  const renderRightToken = () => {
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
              <NumberInputField/>
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
                <Radio value="l_erc20" mr="1rem" _before={{color: "white"}}>ERC20</Radio>
                <Radio value="l_nft" _before={{color: "white"}}>NFT</Radio>
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
        <Flex flexDirection="row" w="100%">
          <Box w="50%">

          </Box>
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