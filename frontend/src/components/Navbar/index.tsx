import React, { useContext, useState } from "react";
import { createDataTestId } from "../../lib/create-data-testid";
import { Flex, Text, Button, HStack, Heading, Link as CLink, Center } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import Web3Modal, { IProviderOptions } from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import {
  CurrentAddressContext,
  INFURA_API_KEY,
  ProviderContext,
  network,
  SignerContext,
  getyGift,
  getERC721,
  emptyContract,
  SymfoniYGift,
  SymfoniErc721,
  yGiftContext,
  ERC721Context,
} from "../../hardhat/HardhatContext";
import { formatAddress } from "../../lib/format-address";

export const componentDataTestId = createDataTestId("Navbar");

export const dataTestIds = {};

interface IProps {}

const Logo = () => (
  <NavLink to="/">
    <Heading color={"#013A6D"} {...{ fontFamily: "Roboto", fontStyle: "normal", fontWeight: "900", fontSize: "40px" }}>
      yGift
    </Heading>
  </NavLink>
);

const handleWeb3ProviderConnect = (
  setProvider: Function,
  setSigner: Function,
  setCurrentAddress: Function,
  setyGift: Function,
  setERC721: Function
) => async () => {
  const getWeb3ModalProvider = async (): Promise<any> => {
    const providerOptions: IProviderOptions = {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: INFURA_API_KEY, // required
        },
      },
    };
    const web3Modal = new Web3Modal({
      network,
      cacheProvider: true,
      providerOptions, // required
    });
    const provider = await web3Modal.connect();
    console.log(provider);
    return provider;
  };
  const provider = await getWeb3ModalProvider();
  console.log(provider);
  const web3provider = new ethers.providers.Web3Provider(provider);
  const signer = await web3provider.getSigner();
  const address = await signer.getAddress();
  setProvider(web3provider);
  setSigner(signer);
  console.log("address", address);
  setCurrentAddress(address);
  const yGift = getyGift(web3provider, signer);
  const erc721 = getERC721(web3provider, signer);
  console.log(yGift);
  console.log(erc721);
  setyGift(yGift);
  setERC721(erc721);
};

const OurLink = (props: any) => {
  const [currentAddress] = useContext(CurrentAddressContext);
  const [_provider, setProvider] = useContext(ProviderContext);
  const [_signer, setSigner] = useContext(SignerContext);
  const [_currentAddress, setCurrentAddress] = useContext(CurrentAddressContext);
  const [yGift, setyGift] = useContext(yGiftContext);
  const [ERC721, setERC721] = useContext(ERC721Context);

  if (!currentAddress) {
    return (
      <CLink
        onClick={handleWeb3ProviderConnect(setProvider, setSigner, setCurrentAddress, setyGift, setERC721)}
        href={"#"}
        activeStyle={{
          color: "#013A6D",
          textDecoration: "underline",
        }}
        {...props}
        {...{
          fontFamily: "Roboto",
          fontStyle: "normal",
          fontWeight: "normal",
          fontSize: "16px",
          color: "#809EBD",
        }}
      />
    );
  }
  return (
    <CLink
      as={NavLink}
      activeStyle={{
        color: "#013A6D",
        textDecoration: "underline",
      }}
      {...props}
      {...{
        fontFamily: "Roboto",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "16px",
        color: "#809EBD",
      }}
    />
  );
};

const Links = () => (
  <Center mx="auto">
    <HStack spacing={10}>
      <OurLink to="/create-gift">Create gift</OurLink>
      <OurLink to="/gifts">Gifts</OurLink>
      {/* <OurLink to="/about">About</OurLink> */}
    </HStack>
  </Center>
);

const Navbar: React.FunctionComponent<IProps> = (props) => {
  const [currentAddress] = useContext(CurrentAddressContext);
  const [_provider, setProvider] = useContext(ProviderContext);
  const [_signer, setSigner] = useContext(SignerContext);
  const [_currentAddress, setCurrentAddress] = useContext(CurrentAddressContext);
  const [yGift, setyGift] = useState<SymfoniYGift>(emptyContract);
  const [ERC721, setERC721] = useState<SymfoniErc721>(emptyContract);

  return (
    <Flex width="100%" px={[2, 10]} py={4}>
      <Logo></Logo>
      <Links></Links>
      <Center>
        {currentAddress ? (
          <Text
            ml="auto"
            {...{
              fontFamily: "Roboto",
              fontStyle: "normal",
              fontWeight: "normal",
              fontSize: "16px",
              color: "#809EBD",
            }}
          >
            {formatAddress(currentAddress)}
          </Text>
        ) : (
          <Button
            ml="auto"
            background="#0065D0"
            borderRadius="32px"
            color="white"
            onClick={handleWeb3ProviderConnect(setProvider, setSigner, setCurrentAddress, setyGift, setERC721)}
          >
            Connect
          </Button>
        )}
      </Center>
    </Flex>
  );
};

export { Navbar };
