import React from "react"
import { Box, Text } from "@chakra-ui/core"
 
export default function Logo(props) {
  return (
    <Box {...props}>
        <Text
            m="auto 0"
            fontWeight="bold"
            fontSize="18px"
            color="black"
        >
            Zoracles - NFTSwap
        </Text>
    </Box>
  )
}