import {
    Flex,
    Spacer,
    Box,
    Image,
    Text,
    AspectRatio,
    Center,
    Tooltip,
} from "@chakra-ui/core";
import { useContext }   from "react";
import { useRouter }    from "next/router";
import { MyContext }    from "../../contexts/Context";

const NFTBalanceCard = (props) => {
    // define hooks
    const router = useRouter();
    const [mycontext, setContext] = useContext(MyContext);
    const token = props.token;
    const {collection, last_sale, sell_orders} = token;
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
    
    // define functions
    const openTokenLink = () => {
        window.open(token.permalink);
    }

    const onTrade = () => {
        setContext({
            nftToken: token
        });
        if (props.redirect)
            router.push("/");
        else
            props.onClose();
    }

    return (
        <Flex w="100%"
            color="blue.700"
            p="1rem"
            borderRadius="10px"
            maxW="350px"
            _hover={{ boxShadow: "2xl"}}
            border="1px solid #ccc"
            transition="0.3s"
            flexDirection="column"
            >
            <Box w="100%" borderBottom="1px solid #ccc" pb="1rem" >
                <Center w="100%">
                    {token.animation_url?
                        <AspectRatio ratio={1} height="9rem" w="16rem">
                            <iframe
                                title="a"
                                src={token.animation_url + "?autoplay=1&loop=1&autopause=0"}
                                allowFullScreen
                                w="100%"
                                h="100%"
                                allow="autoplay"
                            />
                        </AspectRatio>:
                        <Image height="9rem"
                            src={token.image_thumbnail_url}
                        />
                    }
                </Center>
            </Box>
            <Box mt="1rem" mb="0.2rem">
                <Flex>
                    <Box>
                        <Text fontSize="12px" color="#4F5494">
                            {collection.name}
                        </Text>
                        <Text fontWeight="bold">
                            {token.name}
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
            <Box bg="blue.900" p="0.5rem" m="auto 0 0 0" _hover={{bg:"blue.700"}} cursor="pointer"
                userSelect="none" transition="0.3s" onClick={openTokenLink} borderRadius="30px"
            >
                <Text color="white" fontWeight="bold" textAlign="center">See Details</Text>
            </Box>
            <Box p="0.5rem" mt="0.5rem" cursor="pointer" _hover={{border:"1px solid #fff", color: "white", bg:"blue.700"}} 
                userSelect="none" transition="0.3s" onClick={onTrade} borderRadius="30px"
                color="blue.900" border="1px solid #2B71FF"
            >
                <Text fontWeight="bold" textAlign="center">Trade</Text>
            </Box>
        </Flex>
    )
}

export default NFTBalanceCard;