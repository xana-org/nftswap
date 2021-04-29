import { Box, Text } from "@chakra-ui/core";
const NoConnection = () => {
    return (        
        <Box w="100%" p="0rem 1rem">
            <Box 
                w="100%"
                bg="yellow.900"
                color="white"
                p="1rem 1rem"
                borderRadius="20px"
                mb="1rem"
            >
                <Text
                    textAlign="center"
                    fontSize="20px"
                    fontWeight="bold"
                    color="black"
                >
                    Please connect Rinkey network.
                </Text>
            </Box>
        </Box>
    )
}

export default NoConnection;