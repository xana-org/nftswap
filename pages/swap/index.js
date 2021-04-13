import { useEffect, useState }  from "react";
import { useWallet }            from "use-wallet";
import { useRouter }            from "next/router";
import {
    Box,
    Text,
    Spinner,
    Flex
} from "@chakra-ui/core";
import { getSwap }              from "../../apollo/query";
import Swap                     from "../../components/swap";

const SwapPage = () => {
    // define hooks
    const router = useRouter();
    const swapId = router.query ? router.query.id : '';
    const { loading, error, data } = getSwap(swapId);
    const [swap, setSwap] = useState(null);
    const [loaded, setLoaded] = useState(false);

    // define functions
    useEffect(() => {
        if (!swapId) router.push("/");
    }, []);

    useEffect(() => {
        if (data && data.swapLists && data.swapLists.length) {
            setSwap(data.swapLists[0]);
            setLoaded(true);
        }
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
                    Accept Swap
                </Text>
                <Text
                    textAlign="center"
                    fontSize="18px"
                    color="gray.300"
                    pb="2rem"
                    >
                    Input quantity you want to get
                </Text>
                {loaded?
                    <Swap
                        swap={swap}
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
            </Box>
        </Box>
    )
}

export default SwapPage;