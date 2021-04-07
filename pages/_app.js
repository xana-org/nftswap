import { useState }           from "react";
import { UseWalletProvider }  from "use-wallet";
import { ApolloProvider }     from '@apollo/client';
import { ChakraProvider }     from "@chakra-ui/core";
import { useApollo }          from "../apollo/client";
import Layout                 from "../components/layout";
import theme                  from "../theme";
import { MyContext }          from "../contexts/Context";

const fakeStorageManager = {
  get: () => "dark",
  set: (value) => {},
  type: "cookie",
};

const App = ({ Component, pageProps }) => {
  const apolloClient = useApollo({});
  const [mycontext, setContext] = useState({
    nftToken: null,
  })
  return (
    <UseWalletProvider
      chainId={4}
      connectors={{
        walletconnect: { rpcUrl: "https://mainnet.eth.aragon.network/" },
      }}
    >
      <MyContext.Provider value={[mycontext, setContext]}>
        <ApolloProvider client={apolloClient}>
          <ChakraProvider theme={theme} colorModeManager={fakeStorageManager}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ChakraProvider>
        </ApolloProvider>
      </MyContext.Provider>
    </UseWalletProvider>
  )
};

export default App;
