import React, { useContext, useEffect, useState } from "react";
import { createDataTestId } from "../../lib/create-data-testid";
import { Flex, Stack, Text, Button, VStack, HStack, Image, useDisclosure, Heading } from "@chakra-ui/core";
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
} from "@chakra-ui/core";
import { AddIcon, InfoIcon, CloseIcon, CopyIcon } from "@chakra-ui/icons";
import { TransactionHistory } from "./TransactionHistory";
import { useParams } from "react-router-dom";
import { CurrentAddressContext, yGiftContext } from "../../hardhat/HardhatContext";
import { Tip } from "../Tip";
import { Collect } from "../Collect";

export const componentDataTestId = createDataTestId("ViewGift");

export const dataTestIds = {};

interface IProps {}

const ViewGift: React.FunctionComponent<IProps> = (props) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const { tokenId } = useParams<{ tokenId: string }>();
  const yGift = useContext(yGiftContext);
  const [currentAddress] = useContext(CurrentAddressContext);
  const [gift, setGift] = useState<GiftModel>();
  useEffect(() => {
    const fetch = async () => {
      const gift = await yGift?.instance?.getGift(tokenId);
      setGift(gift);
    };
    fetch();
  }, [yGift, tokenId]);

  const isRecipient = true;

  return (
    <VStack height={"70vh"} borderRadius="32px">
      <HStack height="100%">
        <Image height="400px" width="400px" src={gift?.["5"]} />
        <VStack height="100%" width="520px" alignItems="flex-start" p={4}>
          {/*  */}
          <HStack width="100%">
            <Heading mr="auto">{gift?.["0"]}</Heading>
            <HStack spacing={4}>
              <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} placement="bottom" closeOnBlur={false}>
                <PopoverTrigger>
                  <AddIcon></AddIcon>
                </PopoverTrigger>
                <PopoverContent p={5}>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  {isRecipient ? <Collect tokenId={tokenId} /> : <Tip tokenId={tokenId}></Tip>}
                </PopoverContent>
              </Popover>
              <InfoIcon></InfoIcon>
              <CloseIcon></CloseIcon>
            </HStack>
          </HStack>
          {/*  */}
          <HStack spacing={4}>
            <VStack alignItems="flex-start" spacing={2}>
              <Text>Gift Amount</Text>
              <Text>{gift?.["3"]} ETH</Text>
            </VStack>
            <VStack alignItems="flex-start" spacing={2}>
              <Text>Received</Text>
              {/* TODO: Date.fn */}
              <Text>28/11/2020</Text>
            </VStack>
          </HStack>
          {/*  */}
          <VStack spacing={2} alignItems="flex-start">
            <Text>Message</Text>
            <Text>{(gift as any)?.["message"]}</Text>
          </VStack>
          {/*  */}
          <VStack spacing={2} alignItems="flex-start">
            <Text>Owned by</Text>
            <HStack>
              <Text>{gift?.["2"]}</Text>
              <CopyIcon></CopyIcon>
            </HStack>
          </VStack>
          {/*  */}
          <VStack spacing={2} alignItems="flex-start">
            <Text>Gifted by</Text>
            <HStack>
              <Text>{gift?.["1"]}</Text>
              <CopyIcon></CopyIcon>
            </HStack>
          </VStack>
        </VStack>
      </HStack>

      <TransactionHistory tokenId={tokenId}></TransactionHistory>
      <VStack></VStack>
    </VStack>
  );
};

export { ViewGift };
