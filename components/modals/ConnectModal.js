import { useWallet } from "use-wallet";
import {
    Flex,
    Box,
    Image,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    IconButton
} from "@chakra-ui/core";
import {
    CloseIcon,
} from "@chakra-ui/icons";

const ConnectModal = (props) => {
    // define hooks
    const wallet = useWallet();

    // define colors

    // define functions
    const handleConectClick = connector => () => wallet.connect(connector);

    return (
        <Modal size="md" isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay/>
            <ModalContent borderRadius="5px">
                <IconButton
                    color="white"
                    icon={<CloseIcon/>}
                    position="absolute"
                    top="0.5rem"
                    right="0.5rem"
                    onClick={props.onClose}
                    bg="none"
                    _active={{}}
                    _focus={{}}
                    _hover={{}}
                />
                <Box p="1rem" bg="blue.700">
                    <Text color="#fff" fontSize="16px" fontWeight="bold" textAlign="center">Connect to your Wallet</Text>
                </Box>
                <Box
                    p="1rem"
                    bg="gray.300"
                >
                    <Flex
                        flexDirection="row"
                        cursor="pointer"
                        onClick={handleConectClick("injected")}
                        p="0.5rem"
                        transition="0.3s"
                        _hover={{
                            bg: "#eee",
                            transition: "0.3s"
                        }}
                    >
                        <Image src="/images/login/metamask.svg" w="3rem" m="auto 0"/>
                        <Flex flexDirection="column" m="auto 0 auto 2rem">
                            <Text fontSize="16px" fontWeight="bold">MetaMask</Text>
                            <Text fontSize="12px">Connect your Metamask Wallet.</Text>
                        </Flex>
                    </Flex>
                </Box>
            </ModalContent>
        </Modal>
    )
}

export default ConnectModal;