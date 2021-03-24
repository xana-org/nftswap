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
} from "@chakra-ui/core";
import {
  SearchIcon,
  ChevronDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CloseIcon
} from "@chakra-ui/icons";
import InfiniteScroll                from "react-infinite-scroller";
import { COINGECKO_URL, LEFT_TOKEN } from "../constants/const";
import { formatNumber }         from "../lib/helper";
import { getBalance }           from "../contracts/erc20";
import {
    shortenWalletAddress,
    getWalletAddress
} from "../lib/wallet";
import Axios from "axios";

const Home = () => {
  const [type_left, setTypeLeft] = useState("l_erc20");
  const [tokenList, setTokenList] = useState([]);
  const [filteredTokenList, setFilteredTokenList] = useState([]);
  const [lefToken, setLeftToken] = useState(LEFT_TOKEN);
  const [balance, setBalance] = useState(-1);
  const [isOpenERC20, setIsOpenERC20] = useState(false);
  const [tokenShowCount, setTokenShowCount] = useState(30);
  const [filterText, setFilterText] = useState("");
  const wallet = useWallet();

  useEffect(() => {
    Axios.get(COINGECKO_URL).then(res => {
      setTokenList(res.data.tokens);
      setFilteredTokenList(res.data.tokens);
    });
  }, [])
  
  const getTokenBalance = async (token) => {
    if (type_left !== "l_erc20") return;
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
      getTokenBalance(lefToken);
    }
  }, [wallet])

  const renderLeftToken = () => {
    return (
      <Box mt="1rem" ml="auto" w="100%">
        <Flex flexDirection="row" justifyContent="flex-end">
          <Flex flexDirection="row" cursor="pointer" userSelect="none">
            <Box w="3.4rem" h="3.4rem" m="auto .5rem" borderRadius="100%" bg="blue.800" onClick={() => {setIsOpenERC20(true)}}>
              <Image src={lefToken.logoURI} w="2rem" h="2rem" m="0.7rem"/>
            </Box>
            <Flex flexDirection="row" onClick={() => {setIsOpenERC20(true)}}>
              <Text fontSize="24px" fontWeight="bold" m="auto 0">{lefToken.symbol}</Text>
              <ChevronDownIcon m="auto 0.4rem"/>
            </Flex>
            <NumberInput w="100px" m="auto 0">
              <NumberInputField/>
            </NumberInput>
          </Flex>
        </Flex>
        <Flex flexDirection="row" justifyContent="flex-end">
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
    setLeftToken({
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
          <Flex w="40%" flexDirection="column">
            <Text
              textAlign="right"
              fontSize="26px"
              fontWeight="bold"
            >
              You'll send
            </Text>
            <RadioGroup onChange={setTypeLeft} value={type_left} mt="1rem" >
              <Stack direction="row" justifyContent="flex-end">
                <Radio value="l_erc20" mr="1rem" _before={{color: "white"}}>ERC20</Radio>
                <Radio value="l_nft" _before={{color: "white"}}>NFT</Radio>
              </Stack>
            </RadioGroup>
            {renderLeftToken()}
          </Flex>
          <Flex m="auto 5rem" flexDirection="column">
            <ArrowLeftIcon m="0.2rem"/>
            <ArrowRightIcon m="0.2rem"/>
          </Flex>
          <Box w="40%">
            <Text
              fontSize="26px"
              fontWeight="bold"
            >
              You'll receive
            </Text>

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
    </Box>
  )
}

export default Home;