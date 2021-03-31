import { useEffect }          from "react";
import { useWallet }          from "use-wallet";
import { useRouter }          from "next/router";
import { Flex }               from "@chakra-ui/core";
import Container              from "./Container";
import Main                   from "./Main";
import Header                 from "./Header";
import NoConnection           from "./NoConnection";
import useDidMount            from "../../hooks/useDidMount";
import { scrollToPosition }   from "../../lib/scroll";
import { isWalletConnected }  from "../../lib/wallet";

const Layout = ({ children }) => {
    const didMount = useDidMount();
    const router = useRouter();
    const wallet = useWallet();
    const { asPath } = router;
    /**
     * Scroll to top on each route change using `asPath` (resolved path),
     * not `pathname` (may be a dynamic route).
     */
    useEffect(() => {
      if (didMount) {
        scrollToPosition();
      }
    }, [asPath]);
  
    return (
      <Container>
        <Flex 
          w="100%"
          h="100vh"
          overflow="auto"
          flexDirection="column" 
          margin="0 auto"
          maxW="70rem"
          p="0"
        >
          <Header/>
          {isWalletConnected(wallet) ? <Main>{children}</Main> : <NoConnection/>}
        </Flex>
      </Container>
    );
  };
  
  export default Layout;