import React, { useEffect, useState } from "react";
import { createDataTestId } from "../../../lib/create-data-testid";
import { Flex, Stack, Text, Button, Image, VStack, Heading } from "@chakra-ui/react";
import fileType from "file-type";
import { BigNumber, ethers } from "ethers";
import Link from "next/link";
import all from "it-all";
import {
  // @ts-ignore-next
  urlSource,
} from "ipfs-http-client";
import { erc20TokensData } from "../../CreateGift/Erc20Select";

/*
  string name;
  address minter;
  address recipient;
  address token;
  uint256 amount;
  string imageURL;
  bool redeemed;
  uint256 createdAt;
  uint256 lockedDuration;
*/
export type GiftModel = {
  id?: string;
  token: string;
  amount: BigNumber;
  tipped: BigNumber;
  start: BigNumber;
  duration: BigNumber;
  name: string;
  message: string;
  url: string;
  0: string;
  1: BigNumber;
  2: BigNumber;
  3: BigNumber;
  4: BigNumber;
  5: string;
  6: string;
  7: string;
};

const giftNameColour = "#013A6D";
const giftMessageColour = "#809EBD";
const giftAmountColour = giftMessageColour;

export const componentDataTestId = createDataTestId("Gift");

export const dataTestIds = {};

const Gift: React.FunctionComponent<GiftModel> = (props) => {
  const [isVideo, setIsVideo] = useState<boolean>(false);
  // Check if ipfs file is video
  useEffect(() => {
    const fetch = async function () {
      const ipfsFileUrl = props.url;
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
  }, [props.url, isVideo]);

  return (
    <Link href={`/gift/${props.id}`}>
      <VStack spacing={0} width="220px" boxShadow="0px 0px 24px rgba(27, 39, 70, 0.1)" cursor="pointer">
        {isVideo ? (
          <video
            src={props.url}
            autoPlay
            loop
            muted
            playsInline
            height="auto"
            width="220px"
            style={{ borderRadius: "16px" }}
          />
        ) : (
          <Image width="220px" height="auto" src={props?.url} borderRadius="16px"></Image>
        )}
        <VStack p={2} width="100%" spacing={1} alignItems="flex-start">
          <Heading as="h4" fontFamily="Roboto" fontSize="18px" fontWeight="700" color={giftNameColour}>
            {props?.name}
          </Heading>
          {props?.amount && (
            <>
              <Text fontFamily="Roboto" fontSize="16px" fontWeight="bold" color={"#1a4b77"}>
                Amount left
              </Text>
              <Text fontFamily="Roboto" fontSize="16px" fontWeight="bold" color={giftAmountColour}>
                {ethers.utils.formatUnits(
                  props?.amount,
                  erc20TokensData.find((token) => token.address.toLowerCase() === props.token?.toLowerCase())?.decimals
                )}{" "}
              </Text>
            </>
          )}
          {props.message && (
            <Text fontFamily="Roboto" fontSize="14px" fontWeight="400" color={giftMessageColour}>
              {props.message}
            </Text>
          )}
        </VStack>
      </VStack>
    </Link>
  );
};

export { Gift };
