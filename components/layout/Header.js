import { useEffect, useState, useContext } from "react";
import { useRouter } from 'next/router';
import { useWallet } from "use-wallet";
import axios from "axios";
import { ethers } from "ethers";
import {
  getWalletConnectionStatus,
  isWalletConnected,
  disconnectWallet,
  getWalletAddress,
  shortenWalletAddress,
} from "../../lib/wallet";
import ConnectModal from "../modals/ConnectModal";
import {NavBarContainer} from "./NavBarContainer";
import {MenuToggle} from "./MenuToggle";
import {MenuLinks} from './MenuLinks';
import Logo from "./Logo";

const Header = () => {
    // define hooks
    const wallet = useWallet();
    const [prevConnectionStatus, setPrevConnectionStatus] = useState(getWalletConnectionStatus(wallet));
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        wallet.connect("injected");
    }, [])

    useEffect(() => {
        const currentConnectionStatus = getWalletConnectionStatus(wallet);
        const isNowConnected =
          prevConnectionStatus === "disconnected" &&
          currentConnectionStatus === "connected";
        const isNowDisconnected =
          prevConnectionStatus === "connected" &&
          currentConnectionStatus === "disconnected";
    
        if (isNowConnected || isNowDisconnected) {
            setPrevConnectionStatus(currentConnectionStatus);
        }
    });

    const onCloseConnectModal = () => {
        setIsOpen(false);
    }

    const [isOpenMenu, setIsOpenMenu] = useState(false)
   
    const toggle = () => setIsOpenMenu(!isOpenMenu)

    return (
        <NavBarContainer>
          <Logo
            w="100px"
            color={["white", "white", "primary.500", "primary.500"]}
          />
            <MenuToggle toggle={toggle} isOpen={isOpenMenu} />
            <MenuLinks isOpen={isOpenMenu} setIsOpen={setIsOpen} />
            <ConnectModal
                isOpen={isWalletConnected(wallet) ? false : isOpen}
                onClose={onCloseConnectModal}
            />
        </NavBarContainer>
      )
}

export default Header;