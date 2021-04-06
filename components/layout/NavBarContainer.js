import {
    Flex,
} from "@chakra-ui/core";
export const NavBarContainer = ({ children, ...props }) => {
    return (
      <Flex
        as="header"
        position="sticky"
        top="0"
        zIndex="2"
        align="center"
        justify="space-between"
        wrap="wrap"
        w="100%"
        mb={8}
        p={8}
        bg={["blue.800", "blue.800", "#F5F6FA", "#F5F6FA"]}
        color={["white", "white", "blue.800", "blue.800"]}
        {...props}
      >
        {children}
      </Flex>
    )
}
  