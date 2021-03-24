import { UseWalletProvider }  from "use-wallet";
import { ApolloProvider }     from '@apollo/client';
import { ChakraProvider }     from "@chakra-ui/core";
import { useApollo }          from "../apollo/client";
import Layout                 from "../components/layout";
import theme                  from "../theme";

const fakeStorageManager = {
  get: () => "dark",
  set: (value) => {},
  type: "cookie",
};

const App = ({ Component, pageProps }) => {
  const apolloClient = useApollo({});
  return (
    <UseWalletProvider
      chainId={1}
      connectors={{
        walletconnect: { rpcUrl: "https://mainnet.eth.aragon.network/" },
      }}
    >
      <ApolloProvider client={apolloClient}>
        <ChakraProvider theme={theme} colorModeManager={fakeStorageManager}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ChakraProvider>
      </ApolloProvider>
    </UseWalletProvider>
  )
};

export default App;
