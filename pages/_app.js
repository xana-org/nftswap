import { ChakraProvider }     from "@chakra-ui/core";
import { UseWalletProvider }  from "use-wallet";
import Layout                 from "../components/layout";
import theme                  from "../theme";

const fakeStorageManager = {
  get: () => "dark",
  set: (value) => {},
  type: "cookie",
};

const App = ({ Component, pageProps }) => {
  return (
    <UseWalletProvider
      chainId={42}
      connectors={{
        walletconnect: { rpcUrl: "https://mainnet.eth.aragon.network/" },
      }}
    >
      <ChakraProvider theme={theme} colorModeManager={fakeStorageManager}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </UseWalletProvider>
  )
};

export default App;
