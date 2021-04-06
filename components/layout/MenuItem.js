import React from "react"
import { Text, Box } from "@chakra-ui/core"
import { useRouter } from "next/router"

export const MenuItem = ({ children, isLast, to = "/", ...rest }) => {
    const router = useRouter();
    return (
        <Box
            cursor="pointer"
            userSelect="none"
            onClick={() => router.push(to)}
        >
            <Text display="block" {...rest}>
            {children}
            </Text>
        </Box>
    )
  }