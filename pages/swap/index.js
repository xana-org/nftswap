import { useEffect, useState }  from "react";
import { useWallet }            from "use-wallet";
import { ethers }               from "ethers";
import { useRouter }            from "next/router";
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
import { formatNumber }         from "../../lib/helper";
import { CHAIN }                from "../../constants/addresses";
import { getNFTDetail }         from "../../opensea/api";
import { getURI1155 }           from "../../contracts/erc1155";
import { getURI721 }            from "../../contracts/erc721";
import axios                    from "axios";
import {
    getTokenSymbol,
    getDecimals
} from "../../contracts/erc20";

const SwapPage = () => {
    // define hooks
    const router = useRouter();
    const swapId = router.query ? router.query.id : '';

    // define functions
    useEffect(() => {
        if (!swapId) router.push("/");
    }, []);

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
                    Swap
                </Text>
            </Box>
            <Box
                boxShadow="0 2px 13px 0 rgba(0, 0, 0, 0.21)"
                p="2rem 1rem"
                borderBottomRadius="30px"
            >
            </Box>
        </Box>
    )
}

export default SwapPage;