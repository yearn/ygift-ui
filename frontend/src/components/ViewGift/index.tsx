import React, { useContext, useEffect, useState } from "react";
import { createDataTestId } from "../../lib/create-data-testid";
import { Flex, Stack, Text, Button, VStack, HStack, Image, useDisclosure, Heading, Box } from "@chakra-ui/react";
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

export const componentDataTestId = createDataTestId("ViewGift");

export const dataTestIds = {};

interface IProps {}

const ViewGift: React.FunctionComponent<IProps> = (props) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const { id } = useParams<{ id: string }>();
  const [yGift] = useContext(yGiftContext);
  const [currentAddress] = useContext(CurrentAddressContext);
  const [provider] = useContext(ProviderContext);
  const [gift, setGift] = useState<GiftModel>();
  const [ownedBy, setOwnedBy] = useState<string>("");
  const [from, setFrom] = useState<string>("");
  const [isVideo, setIsVideo] = useState<boolean>(false);

  // Check if ipfs file is video
  useEffect(() => {
    const fetch = async function () {
      const ipfsFileUrl = gift?.url?.toString();
      console.log(ipfsFileUrl);

      if (ipfsFileUrl?.includes("mp4")) {
        setIsVideo(true);
      } else if (ipfsFileUrl?.includes("ipfs")) {
        for await (const file of urlSource(ipfsFileUrl)) {
          const fileContent = await file.content.next();
          const fileTypeResult = await fileType.fromBuffer(fileContent.value.buffer);
          const isVideo = Boolean(fileTypeResult?.mime?.includes("video"));
          console.log({ isVideo });
          setIsVideo(isVideo);
        }
      }
    };
    fetch();
  }, [gift?.url]);

  useEffect(() => {
    const fetch = async () => {
      if (yGift?.instance) {
        const gift = await yGift?.instance?.gifts(id);
        const giftMintedEventFilter = yGift?.instance?.filters?.GiftMinted(
          null,
          null,
          BigNumber.from(id).toHexString(),
          null
        );
        const transferEventFilter = yGift?.instance?.filters?.Transfer(null, null, BigNumber.from(id).toHexString());
        const [log] = await provider?.getLogs({ ...giftMintedEventFilter, fromBlock: 0 });
        const [from] = yGift?.instance?.interface?.parseLog(log)?.args;

        const transferLogs = await provider?.getLogs({ ...transferEventFilter, fromBlock: 0 });
        const [, ownedBy] = yGift?.instance?.interface?.parseLog(transferLogs[transferLogs.length - 1])?.args;

        // gift resolveName parsed
        setGift({ ...gift, token: (await provider?.resolveName(gift.token)) || gift.token });

        setOwnedBy((await provider?.resolveName(ownedBy)) || ownedBy);
        setFrom((await provider?.resolveName(from)) || from);
      }
    };
    fetch();
  }, [yGift, id, provider]);

  const isRecipient = currentAddress === ownedBy;

  const [video, state, controls, ref] = useVideo(
    isVideo ? <video src={gift?.url} autoPlay loop height="auto" width="400px" /> : <div></div>
  );

  if (gift && ownedBy) {
    console.log(gift);
    return (
      <VStack
        minHeight={"884px"}
        width={["auto", "auto", "auto", "920px"]}
        borderRadius="16px"
        boxShadow="0px 0px 24px rgba(27, 39, 70, 0.1)"
        mb={8}
      >
        <HStack
          boxShadow="0px 0px 24px rgba(27, 39, 70, 0.1)"
          borderRadius="16px"
          pb={2}
          spacing={["0", "32px"]}
          flexDirection={["column", "row"]}
          alignItems="flex-start"
        >
          <Box cursor="pointer">
            <SRLWrapper>
              {isVideo ? (
                video
              ) : (
                <Image
                  borderRadius={"16px"}
                  height="auto"
                  width={["auto", "auto", "auto", "400px"]}
                  src={gift?.url}
                  alignSelf="flex-start"
                />
              )}
            </SRLWrapper>
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
              {window.ethereum && (
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
                        <Collect tokenId={id} />
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
                  {" "}
                  {`${ethers.utils.formatEther(gift?.amount)}`}
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
                  {ethers.utils.formatEther(gift?.tipped)}
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
                  {DateTime.fromSeconds(gift?.start?.toNumber()).toHTTP()}
                </Text>
              </VStack>
            </HStack>
            {/*  */}
            {gift?.duration?.toNumber() > 0 && (
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
                  {gift?.duration?.toNumber() / 86400}
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
                  {ownedBy}
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
                  {from}
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
                  {gift?.token}
                </Text>
                {/* <CopyIcon></CopyIcon> */}
              </HStack>
            </VStack>
          </VStack>
        </HStack>

        <TransactionHistory id={id}></TransactionHistory>
      </VStack>
    );
  } else {
    return null;
  }
};

export { ViewGift };
