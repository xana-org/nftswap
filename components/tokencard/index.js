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
import { formatNumber }         from "../../lib/helper";
import { CHAIN }                from "../../constants/addresses";
import { getBalance }           from "../../contracts/erc20";

const TokenBalanceCard = (props) => {
    // define hooks
    const { name, address, decimals } = props.token;
    const wallet = useWallet();
    const [ balance, setBalance ] = useState(-1);
    
    useEffect(async () => {
        if (wallet && wallet.ethereum) {
            const provider = new ethers.providers.Web3Provider(wallet.ethereum);
            const walletAddress = getWalletAddress(wallet);
            let balance = await getBalance(address, walletAddress, provider);
            if (decimals === 18)
                balance = parseFloat(ethers.utils.formatUnits(balance, "ether"));
            else 
                balance = parseFloat(ethers.utils.formatUnits(balance, "ether")) * Math.pow(10, 18 - decimals);
            setBalance(formatNumber(balance, 3));
        }
    }, []);

    // define functions
    const openTokenLink = (address) => {
        if (CHAIN === "mainnet")
            window.open("https://etherscan.io/address/" + address);
        else if (CHAIN === "rinkeby")
            window.open("https://rinkeby.etherscan.io/address/" + address);
    }

    return (
        <Box w="100%" bg="blue.800" p="1rem" borderRadius="10px">
            <Flex flexDirection="row">
                <Box w="46px" h="46px" borderRadius="100%" bg="blue.800" m="auto 0">
                    <Image src={"/images/erc20/" + name + ".png"} w="40px" m="auto" pt="3px"/>
                </Box>
                <Box ml="1rem">
                    <Text fontWeight="bold" fontSize="18px" mb="5px">{name}</Text>
                    <Text 
                        as="u"
                        cursor="pointer"
                        userSelect="none"
                        onClick={() => openTokenLink(address)}
                    >{shortenWalletAddress(address)}</Text>
                    <Flex flexDirection="row" mt="10px">
                        <Text >Balance: </Text>
                        {balance === -1 ?
                            <Spinner m="auto 1rem" size="sm"/>:
                            <Text pl="1rem">{balance}</Text>
                        }
                    </Flex>
                </Box>
            </Flex>
        </Box>
    )
}

export default TokenBalanceCard;