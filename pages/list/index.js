import { useState, useEffect } from "react";
import { useWallet }           from "use-wallet";
import { ethers }              from "ethers";
import {
    Flex,
    Box,
    Text,
    SimpleGrid,
} from "@chakra-ui/core";
import {
  SearchIcon,
} from "@chakra-ui/icons";
import { getSwapList } from "../../apollo/query";
import SwapCard from "../../components/swapcard";

const SwapList = () => {
    // define hooks
    const { loading, error, data } = getSwapList(1000);
    const [allSwap, setAllSwap] = useState([]);

    //define functions
    useEffect(() => {
        console.log("Apollo: ", data);
        if (data && data.swapLists) setAllSwap(data.swapLists);
    }, [loading, error, data]);
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
                    Swap List
                </Text>
            </Box>
            <Box
                boxShadow="0 2px 13px 0 rgba(0, 0, 0, 0.21)"
                p="2rem 1rem"
                borderBottomRadius="30px"
            >
                <Flex flexDirection="row">
                    <SimpleGrid spacing="1rem" minChildWidth="28rem" w="100%">
                        {allSwap.map((item, index) => {
                            return (
                                <SwapCard swap={item} key={index}/>
                            )
                        })}
                        <Box/>
                    </SimpleGrid>
                </Flex>
            </Box>
        </Box>
    )
}

export default SwapList;