import { Box } from "@chakra-ui/core";
import { useWallet } from "use-wallet";
import { useEffect, useState } from "react";

const Main = ({ children }) => {
  const wallet = useWallet();
  useEffect(() => {
    wallet.connect("injected");
  }, []);

  return (
    <Box as="main" flex="1 0 auto"
      p="0 1rem">
      {children}
    </Box>
  );
}

export default Main;