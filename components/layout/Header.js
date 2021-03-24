import { useEffect, useState, useContext } from "react";
import { useRouter } from 'next/router';
import { useWallet } from "use-wallet";
import axios from "axios";
import { ethers } from "ethers";
import {
    Flex,
    Box,
    IconButton,
    Image,
    useColorMode,
    useColorModeValue,
    Text,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useStyleConfig,
    Spinner,
} from "@chakra-ui/core";
import {
    SunIcon,
    MoonIcon
} from "@chakra-ui/icons";
import {
  getWalletConnectionStatus,
  isWalletConnected,
  disconnectWallet,
  getWalletAddress,
  shortenWalletAddress,
} from "../../lib/wallet";
import ConnectModal from "../modals/ConnectModal";
const Header = () => {
    // define hooks
    const router = useRouter();
    const wallet = useWallet();
    const [prevConnectionStatus, setPrevConnectionStatus] = useState(getWalletConnectionStatus(wallet));
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        wallet.connect("injected");
    }, [])

    useEffect(() => {
        const currentConnectionStatus = getWalletConnectionStatus(wallet);
        const isNowConnected =
          prevConnectionStatus === "disconnected" &&
          currentConnectionStatus === "connected";
        const isNowDisconnected =
          prevConnectionStatus === "connected" &&
          currentConnectionStatus === "disconnected";
    
        if (isNowConnected || isNowDisconnected) {
            setPrevConnectionStatus(currentConnectionStatus);
        }
    });

    const onCloseConnectModal = () => {
        setIsOpen(false);
    }

    const renderWallet = () => {
        if (!isWalletConnected(wallet)) {
            return (
                <Box
                    as="button"
                    m="auto 0 auto 2rem"
                    bg="blue.900"
                    transition="0.3s"
                    _hover={{bg: "blue.800"}}
                    _active={{}}
                    _focus={{}}
                    onClick={() => setIsOpen(true)}
                    borderRadius="30px"
                >
                    <Text
                        fontSize="14px"
                        color="white"
                        fontWeight="bold"
                        p="0.5rem 1.5rem"
                    >
                        Connect
                    </Text>
                </Box>
            )
        }
        const walletAddress = getWalletAddress(wallet);
        return (
            <Box
                m="auto 0 auto 2rem"
                bg="blue.900"
                transition="0.3s"
                borderRadius="30px"
                cursor="pointer"
                userSelect="none"
            >
                <Text
                    fontSize="14px"
                    color="white"
                    fontWeight="bold"
                    p="0.5rem 1.5rem"
                >
                    {shortenWalletAddress(walletAddress)}
                </Text>
            </Box>
        )
    }

    return (
        <Box
            as="header"
            h="6rem"
            position="sticky"
            top="0"
            zIndex="2"
            p="2rem 0"
            mb="1rem"
        >
            <Flex w="100%" flexDirection="row">
                <Text
                    m="auto 0"
                    fontWeight="bold"
                    fontSize="18px"
                >
                    Zoracles - NFTSwap
                </Text>
                <Box
                    cursor="pointer"
                    userSelect="none"
                    m="auto 0 auto auto"
                    onClick={() => router.push("/")}
                >
                    <Text
                        fontSize="14px"
                    >
                        Create
                    </Text>
                </Box>
                <Box
                    cursor="pointer"
                    userSelect="none"
                    m="auto 0 auto 2rem"
                >
                    <Text
                        fontSize="14px"
                    >
                        Swap List
                    </Text>
                </Box>
                <Box
                    cursor="pointer"
                    userSelect="none"
                    m="auto 0 auto 2rem"
                    onClick={() => router.push("/mywallet")}
                >
                    <Text
                        fontSize="14px"
                    >
                        My Wallet
                    </Text>
                </Box>
                {renderWallet()}
            </Flex>
            <ConnectModal
                isOpen={isWalletConnected(wallet) ? false : isOpen}
                onClose={onCloseConnectModal}
            />
        </Box>
    )
}

export default Header;