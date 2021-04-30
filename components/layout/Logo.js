import React from "react"
import { Box, Image } from "@chakra-ui/core"
 
export default function Logo(props) {
  return (
    <Box {...props}>
        <Image src="/images/logo.svg" maxW="200px"/>
    </Box>
  )
}