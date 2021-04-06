import { useEffect, useState }  from "react";
import { useWallet }            from "use-wallet";
import { ethers }               from "ethers";
import {
    Flex,
    Spacer,
    Box,
    Image,
    Text,
    Spinner,
    Center,
    Tooltip
} from "@chakra-ui/core";
import {
    shortenWalletAddress,
    getWalletAddress
} from "../../lib/wallet";

const NFTBalanceCard = (props) => {
    // define hooks
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

    return (
        <Box w="100%"
            bg="blue.900"
            p="1rem"
            borderRadius="10px"
            cursor="pointer"
            userSelect="none"
            maxW="350px"
            onClick={openTokenLink}
            _hover={{ bg: "blue.800", boxShadow: "2xl"}}
            >
            <Box w="100%" borderBottom="1px solid white" pb="1rem" >
                <Center w="100%">
                    <Image height="120px"
                        src={token.image_thumbnail_url}
                    />
                </Center>
            </Box>
            <Box marginTop="1rem">
                <Flex>
                    <Box>
                        <Text color="white">
                            {collection.name}
                        </Text>
                        <Text color="white">
                            {token.name}
                        </Text>
                    </Box>
                    <Spacer />
                    {currentPrice && <Box fontSize="14px">
                        <Text color="white" textAlign="right">
                            Price
                        </Text>
                        <Flex>
                            <Tooltip label={currentPrice.symbol} aria-label="A tooltip">
                                <Image src={currentPrice.img} height="1.5em"/>
                            </Tooltip>
                            <Text color="white" ml="0.5rem">
                                {currentPrice.price}
                            </Text>
                        </Flex>
                    </Box>}
                </Flex>
                {lastPrice && <Flex mt="1rem" justifyContent="flex-end" alignItems="center" fontSize="14px" >
                    <Flex>
                        <Text color="white" textAlign="right"mr="0.5rem">
                            Last Price
                        </Text>
                        <Flex>
                            <Tooltip label={lastPrice.symbol} aria-label="A tooltip">
                                <Image src={lastPrice.img} height="1.5em"/>
                            </Tooltip>
                            <Text color="white" ml="0.5rem">
                                {lastPrice.price}
                            </Text>
                        </Flex>
                    </Flex>
                </Flex>}
            </Box>
        </Box>
    )
}

export default NFTBalanceCard;