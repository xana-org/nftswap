import React from "react"
import { Stack, Box, Text } from "@chakra-ui/core"
import {MenuItem} from './MenuItem';
import {
  getWalletConnectionStatus,
  isWalletConnected,
  disconnectWallet,
  getWalletAddress,
  shortenWalletAddress,
} from "../../lib/wallet";
import { useWallet } from "use-wallet";

export const MenuLinks = ({isOpen, setIsOpen}) => {
    const wallet = useWallet();
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
            display={{ base: isOpen ? "block" : "none", md: "block" }}
            flexBasis={{ base: "100%", md: "auto" }}
            >
            <Stack
                spacing={8}
                align="center"
                justify={["center", "space-between", "flex-end", "flex-end"]}
                direction={["column", "row", "row", "row"]}
                pt={[4, 4, 0, 0]}
                >
                <MenuItem to="/">Create</MenuItem>
                <MenuItem to="/">Swap List</MenuItem>
                <MenuItem to="/mywallet">My Wallet</MenuItem>
                {renderWallet()}
            </Stack>
        </Box>
    )
}