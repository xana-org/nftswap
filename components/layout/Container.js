import { Flex } from "@chakra-ui/core";

const Container = ({ children }) => (
  <Flex flexDirection="column">
    {children}
  </Flex>
);

export default Container;
