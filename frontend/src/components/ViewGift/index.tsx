import React, { useContext, useEffect, useState } from "react";
import { createDataTestId } from "../../lib/create-data-testid";
import {
  Flex,
  Stack,
  Text,
  Button,
  VStack,
  HStack,
  Image,
  useDisclosure,
  Heading,
  Box,
  useMediaQuery,
} from "@chakra-ui/react";
import { GiftModel } from "../Gifts/Gift";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";
import { AddIcon, InfoIcon, CloseIcon, CopyIcon, MinusIcon } from "@chakra-ui/icons";
import { TransactionHistory } from "./TransactionHistory";
import { useParams } from "react-router-dom";
import { CurrentAddressContext, ProviderContext, yGiftContext } from "../../hardhat/HardhatContext";
import { Tip } from "../Tip";
import { Collect } from "../Collect";
import { formatUnits } from "ethers/lib/utils";
import { BigNumber, ethers } from "ethers";
import { DateTime } from "luxon";
import { SEO } from "./SEO";
import fileType from "file-type";
import { useVideo } from "react-use";
// @ts-ignore-next
import { SRLWrapper } from "simple-react-lightbox";
import {
  // @ts-ignore-next
  urlSource,
} from "ipfs-http-client";
import all from "it-all";
import { erc20TokensData } from "../CreateGift/Erc20Select";
import { useEns } from "../../lib/use-ens";
import { formatAddress } from "../../lib/format-address";

export const componentDataTestId = createDataTestId("ViewGift");

export const dataTestIds = {};

interface IProps {
  id: string;
  gift: GiftModel;
  ownedBy: string;
  from: string;
}

const ViewGift: React.FunctionComponent<IProps> = (props) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const { gift, from, ownedBy } = props;
  const { id } = props;
  const [isSmallMobileBreakpoint] = useMediaQuery(`(max-width: 430px)`);
  const [yGift] = useContext(yGiftContext);
  const [currentAddress] = useContext(CurrentAddressContext);
  const [provider] = useContext(ProviderContext);
  const [isVideo, setIsVideo] = useState<boolean>(false);
  const { ensName: fromName } = useEns(from, isSmallMobileBreakpoint);
  const { ensName: ownedByName } = useEns(ownedBy, isSmallMobileBreakpoint);
  const _url = gift?.url;

  // Check if ipfs file is video
  useEffect(() => {
    const fetch = async function () {
      const ipfsFileUrl = _url;
      console.log(ipfsFileUrl);
      if (isVideo) return;
      if (ipfsFileUrl?.includes("mp4") && !isVideo) {
        setIsVideo(true);
      } else if (ipfsFileUrl?.includes("ipfs") && !isVideo) {
        const [urlSourced] = await all<any>(urlSource(ipfsFileUrl));
        const [file] = await all<ArrayBuffer>(urlSourced.content);
        const fileTypeResult = await fileType.fromBuffer(file);
        const isVideo = Boolean(fileTypeResult?.mime?.includes("video"));
        console.log({ isVideo });
        if (isVideo) {
          setIsVideo(true);
        }
      }
    };
    fetch();
  }, [_url, isVideo]);

  const isRecipient = currentAddress === ownedBy;

  if (gift && ownedBy && from) {
    // console.log(gift);
    return (
      <VStack
        minHeight={"884px"}
        width={["auto", "auto", "auto", "920px"]}
        borderRadius="16px"
        boxShadow="0px 0px 24px rgba(27, 39, 70, 0.1)"
        mb={8}
      >
        <SEO gift={gift}></SEO>
        <HStack
          boxShadow="0px 0px 24px rgba(27, 39, 70, 0.1)"
          borderRadius="16px"
          pb={2}
          spacing={["0", "32px"]}
          flexDirection={["column", "row"]}
          alignItems="flex-start"
        >
          <Box cursor="pointer" alignSelf={isSmallMobileBreakpoint ? "center" : "inherit"}>
            {isVideo ? (
              <video
                src={_url}
                autoPlay
                loop
                muted
                playsInline
                height="auto"
                width="400px"
                style={{ borderRadius: "16px" }}
              />
            ) : (
              <SRLWrapper>
                <Image
                  borderRadius={"16px"}
                  height="auto"
                  width={["auto", "auto", "auto", "400px"]}
                  src={gift?.url}
                  alignSelf="flex-start"
                />
              </SRLWrapper>
            )}
          </Box>
          <VStack
            height="100%"
            width={["auto", "auto", "auto", "520px"]}
            alignItems="flex-start"
            p={4}
            spacing={"24px"}
          >
            {/*  */}
            <HStack width="100%">
              <Heading
                {...{
                  fontFamily: "Roboto",
                  fontStyle: "normal",
                  fontWeight: "bold",
                  fontSize: "24px",
                  lineHeight: "126.39%",
                }}
                color="#013A6D"
                mr="auto"
              >
                {gift?.name}
              </Heading>
              {currentAddress &&
                erc20TokensData?.find((token) => token?.address.toLowerCase() === gift?.token.toLowerCase())?.symbol !==
                  "None" && (
                  <HStack spacing={4}>
                    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} placement="bottom" closeOnBlur={false}>
                      <PopoverTrigger>
                        {isRecipient ? (
                          <HStack cursor="pointer" spacing={1}>
                            <Text
                              {...{
                                fontFamily: "Roboto",
                                fontStyle: "normal",
                                fontWeight: "normal",
                                fontSize: "16px",
                                lineHeight: "137.88%",
                                display: "flex",
                                alignItems: "center",
                                color: "#013A6D;",
                              }}
                            >
                              Collect
                            </Text>
                            <MinusIcon color="#0065D0"></MinusIcon>
                          </HStack>
                        ) : (
                          <HStack cursor="pointer" spacing={1}>
                            <Text
                              {...{
                                fontFamily: "Roboto",
                                fontStyle: "normal",
                                fontWeight: "normal",
                                fontSize: "16px",
                                lineHeight: "137.88%",
                                display: "flex",
                                alignItems: "center",
                                color: "#013A6D;",
                              }}
                            >
                              Tip
                            </Text>
                            <AddIcon color="#0065D0"></AddIcon>
                          </HStack>
                        )}
                      </PopoverTrigger>
                      <PopoverContent p={5}>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        {isRecipient ? (
                          <Collect tokenId={id} tokenContractAddress={gift?.token} />
                        ) : (
                          <Tip isOpen={isOpen} tokenId={id} tokenContractAddress={gift?.token}></Tip>
                        )}
                      </PopoverContent>
                    </Popover>
                  </HStack>
                )}
            </HStack>
            {/*  */}
            <HStack spacing={4} alignItems="flex-start">
              <VStack alignItems="flex-start" spacing={2} textAlign="left">
                <Text
                  {...{
                    fontFamily: "Roboto",
                    fontStyle: "normal",
                    fontWeight: "normal",
                    fontSize: "12px",
                    lineHeight: "137.88%",
                    display: "flex",
                    alignItems: "center",
                    color: "#809EBD",
                  }}
                >
                  Gift Amount
                </Text>
                <Text
                  {...{
                    fontFamily: "Roboto",
                    fontStyle: "normal",
                    fontWeight: "normal",
                    fontSize: "16px",
                    lineHeight: "137.88%",
                    display: "flex",
                    alignItems: "center",
                    color: "#013A6D;",
                  }}
                >
                  {erc20TokensData.find((token) => token.address.toLowerCase() === gift.token.toLowerCase())?.symbol !==
                  "None"
                    ? `${ethers.utils.formatUnits(
                        gift.amount,
                        erc20TokensData.find((token) => token.address.toLowerCase() === gift.token?.toLowerCase())
                          ?.decimals
                      )} $${
                        erc20TokensData.find((token) => token.address.toLowerCase() === gift.token.toLowerCase())
                          ?.symbol
                      }`
                    : "None"}
                </Text>
              </VStack>
              <VStack alignItems="flex-start" spacing={2} textAlign="left">
                <Text
                  {...{
                    fontFamily: "Roboto",
                    fontStyle: "normal",
                    fontWeight: "normal",
                    fontSize: "12px",
                    lineHeight: "137.88%",
                    display: "flex",
                    alignItems: "center",
                    color: "#809EBD",
                  }}
                >
                  Tipped Amount
                </Text>
                <Text
                  {...{
                    fontFamily: "Roboto",
                    fontStyle: "normal",
                    fontWeight: "normal",
                    fontSize: "16px",
                    lineHeight: "137.88%",
                    display: "flex",
                    alignItems: "center",
                    color: "#013A6D;",
                  }}
                >
                  {erc20TokensData.find((token) => token.address.toLowerCase() === gift.token.toLowerCase())?.symbol !==
                  "None"
                    ? `${ethers.utils.formatUnits(
                        gift.tipped,
                        erc20TokensData.find((token) => token.address.toLowerCase() === gift.token?.toLowerCase())
                          ?.decimals
                      )} $${
                        erc20TokensData.find((token) => token.address.toLowerCase() === gift.token.toLowerCase())
                          ?.symbol
                      }`
                    : "None"}
                </Text>
              </VStack>
              <VStack alignItems="flex-start" spacing={2} textAlign="left">
                <Text
                  {...{
                    fontFamily: "Roboto",
                    fontStyle: "normal",
                    fontWeight: "normal",
                    fontSize: "12px",
                    lineHeight: "137.88%",
                    display: "flex",
                    alignItems: "center",
                    color: "#809EBD",
                  }}
                >
                  Received
                </Text>
                {/* TODO: Date.fn */}
                <Text
                  {...{
                    fontFamily: "Roboto",
                    fontStyle: "normal",
                    fontWeight: "normal",
                    fontSize: "16px",
                    lineHeight: "137.88%",
                    display: "flex",
                    alignItems: "center",
                    color: "#013A6D;",
                  }}
                >
                  {DateTime.fromSeconds(BigNumber.from(gift.start).toNumber()).toHTTP()}
                </Text>
              </VStack>
            </HStack>
            {/*  */}
            {BigNumber.from(gift?.duration).toNumber() > 0 && (
              <VStack spacing={2} alignItems="flex-start">
                <Text
                  {...{
                    fontFamily: "Roboto",
                    fontStyle: "normal",
                    fontWeight: "normal",
                    fontSize: "12px",
                    lineHeight: "137.88%",
                    display: "flex",
                    alignItems: "center",
                    color: "#809EBD",
                  }}
                >
                  Vested Duration in Days
                </Text>
                <Text
                  {...{
                    fontFamily: "Roboto",
                    fontStyle: "normal",
                    fontWeight: "normal",
                    fontSize: "16px",
                    lineHeight: "137.88%",
                    display: "flex",
                    alignItems: "center",
                    color: "#013A6D;",
                  }}
                >
                  {BigNumber.from(gift.duration).toNumber() / 86400}
                </Text>
              </VStack>
            )}
            <VStack spacing={2} alignItems="flex-start">
              <Text
                {...{
                  fontFamily: "Roboto",
                  fontStyle: "normal",
                  fontWeight: "normal",
                  fontSize: "12px",
                  lineHeight: "137.88%",
                  display: "flex",
                  alignItems: "center",
                  color: "#809EBD",
                }}
              >
                Message
              </Text>
              <Text
                {...{
                  fontFamily: "Roboto",
                  fontStyle: "normal",
                  fontWeight: "normal",
                  fontSize: "16px",
                  lineHeight: "137.88%",
                  display: "flex",
                  alignItems: "center",
                  color: "#013A6D;",
                }}
              >
                {gift?.message}
              </Text>
            </VStack>
            {/*  */}
            <VStack spacing={2} alignItems="flex-start">
              <Text
                {...{
                  fontFamily: "Roboto",
                  fontStyle: "normal",
                  fontWeight: "normal",
                  fontSize: "12px",
                  lineHeight: "137.88%",
                  display: "flex",
                  alignItems: "center",
                  color: "#809EBD",
                }}
              >
                Owned by
              </Text>
              <HStack>
                <Text
                  {...{
                    fontFamily: "Roboto",
                    fontStyle: "normal",
                    fontWeight: "normal",
                    fontSize: "16px",
                    lineHeight: "137.88%",
                    display: "flex",
                    alignItems: "center",
                    color: "#013A6D;",
                  }}
                >
                  {ownedByName}
                </Text>
                {/* <CopyIcon></CopyIcon> */}
              </HStack>
            </VStack>
            {/*  */}
            <VStack spacing={2} alignItems="flex-start">
              <Text
                {...{
                  fontFamily: "Roboto",
                  fontStyle: "normal",
                  fontWeight: "normal",
                  fontSize: "12px",
                  lineHeight: "137.88%",
                  display: "flex",
                  alignItems: "center",
                  color: "#809EBD",
                }}
              >
                Minted by
              </Text>
              <HStack>
                <Text
                  {...{
                    fontFamily: "Roboto",
                    fontStyle: "normal",
                    fontWeight: "normal",
                    fontSize: "16px",
                    lineHeight: "137.88%",
                    display: "flex",
                    alignItems: "center",
                    color: "#013A6D;",
                  }}
                >
                  {fromName}
                </Text>
                {/* <CopyIcon></CopyIcon> */}
              </HStack>
            </VStack>
            <VStack spacing={2} alignItems="flex-start">
              <Text
                {...{
                  fontFamily: "Roboto",
                  fontStyle: "normal",
                  fontWeight: "normal",
                  fontSize: "12px",
                  lineHeight: "137.88%",
                  display: "flex",
                  alignItems: "center",
                  color: "#809EBD",
                }}
              >
                Gift token contract address
              </Text>
              <HStack>
                <Text
                  {...{
                    fontFamily: "Roboto",
                    fontStyle: "normal",
                    fontWeight: "normal",
                    fontSize: "16px",
                    lineHeight: "137.88%",
                    display: "flex",
                    alignItems: "center",
                    color: "#013A6D;",
                  }}
                >
                  {isSmallMobileBreakpoint ? formatAddress(gift?.token) : gift?.token}
                </Text>
                {/* <CopyIcon></CopyIcon> */}
              </HStack>
            </VStack>
          </VStack>
        </HStack>

        <TransactionHistory tokenContractAddress={gift?.token} id={id}></TransactionHistory>
      </VStack>
    );
  } else {
    return null;
  }
};

export { ViewGift };
