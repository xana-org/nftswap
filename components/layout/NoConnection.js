import { Box, Text } from "@chakra-ui/core";
const NoConnection = () => {
    return (        
        <Box w="100%"
        p="2rem 1rem">
            <Box 
                w="100%"
                bg="yellow.900"
                color="white"
                p="2rem 1rem"
                borderRadius="20px"
            >
                <Text
                    textAlign="center"
                    fontSize="30px"
                    fontWeight="bold"
                    color="black"
                >
                    Your wallet is not connected.
                </Text>
            </Box>
        </Box>
    )
}

export default NoConnection;