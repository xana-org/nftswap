import _get from "lodash/get";
import _includes from "lodash/includes";

const connectWallet = (wallet, connector) => wallet.connect(connector);
const disconnectWallet = (wallet) => wallet.reset();

const getWalletConnectionStatus = wallet => wallet.status;

const isWalletDisconnected = wallet => !!_includes(["disconnected", "error"], getWalletConnectionStatus(wallet));

const isWalletConnecting = wallet => getWalletConnectionStatus(wallet) === "connecting";

const isWalletConnected = wallet => getWalletConnectionStatus(wallet) === "connected";

const getWalletAddress = wallet => {
  try {
    const addr = wallet.account || _get(window, "ethereum.selectedAddress");
    return addr;
  } catch (e) {
    return null;
  }
}

const shortenWalletAddress = address => `${address.substring(0, 6)}...${address.substring(address.length - 4, address.length)}`;

export {
  connectWallet,
  getWalletConnectionStatus,
  isWalletDisconnected,
  isWalletConnecting,
  isWalletConnected,
  getWalletAddress,
  shortenWalletAddress,
  disconnectWallet,
};