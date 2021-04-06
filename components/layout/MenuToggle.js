import React from "react"
import { Box } from "@chakra-ui/core"
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";

export const MenuToggle = ({ toggle, isOpen }) => {
  return (
    <Box display={{ base: "block", md: "none" }} onClick={toggle}>
      {isOpen ? <CloseIcon /> : <HamburgerIcon/>}
    </Box>
  )
}