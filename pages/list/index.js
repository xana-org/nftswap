import { useState, useEffect } from "react";
import { useWallet }           from "use-wallet";
import { ethers }              from "ethers";
import {
    Flex,
    Box,
    Text,
    SimpleGrid,
    Spinner,
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
    const [isLoaded, setIsLoaded] = useState(false);
    const [count, setCount] = useState(0);

    //define functions
    useEffect(() => {
        if (data && data.swapLists) {
            setAllSwap(data.swapLists);
            setCount(Math.min(4, data.swapLists.length));
            setIsLoaded(true);
        }
    }, [loading, error, data]);

    const loadMore = () => {
        setCount(Math.min(count + 4, allSwap.length));
    }

    const renderList = () => {
        if (!isLoaded) {
            return (
                <Box
                    boxShadow="0 2px 13px 0 rgba(0, 0, 0, 0.21)"
                    p="2rem 1rem"
                    borderBottomRadius="30px"
                >
                    <Flex w="100%" flexDirection="row">
                        <Spinner m="auto"/>
                    </Flex>
                </Box>
            );            
        }
        if (allSwap.length === 0) {
            return (
                <Box
                    boxShadow="0 2px 13px 0 rgba(0, 0, 0, 0.21)"
                    p="2rem 1rem"
                    borderBottomRadius="30px"
                >
                    <Flex w="100%" flexDirection="row">
                        <Text m="auto">No Data</Text>
                    </Flex>
                </Box>
            );            
        }
        return (
            <Box
                boxShadow="0 2px 13px 0 rgba(0, 0, 0, 0.21)"
                p="2rem 1rem"
                borderBottomRadius="30px"
            >
                <Flex flexDirection="row">
                    <SimpleGrid spacing="1rem" minChildWidth="28rem" w="100%">
                        {allSwap.slice(0, count).map((item, index) => {
                            return (
                                <SwapCard swap={item} key={index}/>
                            )
                        })}
                        <Box/>
                    </SimpleGrid>
                </Flex>
                {count < allSwap.length && <Box bg="white" color="blue.900" m="1rem" p="0.5rem" borderRadius="30px"
                    border="1px solid #6095FF"
                    cursor="pointer" userSelect="none" onClick={loadMore}
                    transition="0.3s" _hover={{bg: "blue.800", color: "white"}}
                >
                    <Text textAlign="center" fontSize="13px" fontWeight="bold">Load More</Text>
                </Box>}
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
                    Swap List
                </Text>
            </Box>
            {renderList()}
        </Box>
    )
}

export default SwapList;