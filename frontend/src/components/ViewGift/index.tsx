import React from "react";
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

export type GiftTransaction = {};

export const componentDataTestId = createDataTestId("ViewGift");

export const dataTestIds = {};

interface IProps {
  gift: GiftModel;
  history: [GiftTransaction];
}

const ViewGift: React.FunctionComponent<IProps> = (props) => {
  const { onOpen, onClose, isOpen } = useDisclosure();

  return (
    <VStack height={"70vh"} borderRadius="32px">
      <HStack height="100%">
        <Image height="400px" width="400px" src={props.gift["5"]} />
        <VStack height="100%" width="520px" alignItems="flex-start" p={4}>
          {/*  */}
          <HStack width="100%">
            <Heading mr="auto">{props.gift["0"]}</Heading>
            <HStack spacing={4}>
              <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} placement="bottom" closeOnBlur={false}>
                <PopoverTrigger>
                  <AddIcon></AddIcon>
                </PopoverTrigger>
                <PopoverContent p={5}>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <Text>Tip form goes here</Text>
                  {/* <Tip /> */}
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
              <Text>{props.gift["3"]} ETH</Text>
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
            <Text>{(props.gift as any)["message"]}</Text>
          </VStack>
          {/*  */}
          <VStack spacing={2} alignItems="flex-start">
            <Text>Owned by</Text>
            <HStack>
              <Text>{props.gift["2"]}</Text>
              <CopyIcon></CopyIcon>
            </HStack>
          </VStack>
          {/*  */}
          <VStack spacing={2} alignItems="flex-start">
            <Text>Gifted by</Text>
            <HStack>
              <Text>{props.gift["1"]}</Text>
              <CopyIcon></CopyIcon>
            </HStack>
          </VStack>
        </VStack>
      </HStack>

      {/* TransactionHistory */}
      <VStack></VStack>
    </VStack>
  );
};

export { ViewGift };
