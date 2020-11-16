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
import { AddIcon, InfoIcon, CloseIcon, CopyIcon, MinusIcon } from "@chakra-ui/icons";
import { TransactionHistory } from "./TransactionHistory";
import { useParams } from "react-router-dom";
import { CurrentAddressContext, ProviderContext, yGiftContext } from "../../hardhat/HardhatContext";
import { Tip } from "../Tip";
import { Collect } from "../Collect";
import { formatUnits } from "ethers/lib/utils";
import { BigNumber, ethers } from "ethers";
import { DateTime } from "luxon";

export const componentDataTestId = createDataTestId("ViewGift");

export const dataTestIds = {};

interface IProps {}

const ViewGift: React.FunctionComponent<IProps> = (props) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const { id } = useParams<{ id: string }>();
  const yGift = useContext(yGiftContext);
  const [currentAddress] = useContext(CurrentAddressContext);
  const [provider] = useContext(ProviderContext);
  const [gift, setGift] = useState<GiftModel>();
  const [ownedBy, setOwnedBy] = useState<string>("");
  const [from, setFrom] = useState<string>("");
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

        setGift(gift);
        setOwnedBy(ownedBy);
        setFrom(from);
      }
    };
    fetch();
  }, [yGift, id, provider]);

  const isRecipient = currentAddress === ownedBy;

  if (gift && ownedBy) {
    console.log(gift);
    return (
      <VStack height={"70vh"} borderRadius="32px">
        <HStack height="100%">
          <Image height="400px" width="400px" src={gift?.url} />
          <VStack height="100%" width="520px" alignItems="flex-start" p={4}>
            {/*  */}
            <HStack width="100%">
              <Heading mr="auto">{gift?.name}</Heading>
              <HStack spacing={4}>
                <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} placement="bottom" closeOnBlur={false}>
                  <PopoverTrigger>
                    {isRecipient ? (
                      <HStack cursor="pointer" spacing={1}>
                        <Text>Collect</Text>
                        <MinusIcon></MinusIcon>
                      </HStack>
                    ) : (
                      <HStack cursor="pointer" spacing={1}>
                        <Text>Tip</Text>
                        <AddIcon></AddIcon>
                      </HStack>
                    )}
                  </PopoverTrigger>
                  <PopoverContent p={5}>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    {isRecipient ? <Collect tokenId={id} /> : <Tip tokenId={id}></Tip>}
                  </PopoverContent>
                </Popover>
              </HStack>
            </HStack>
            {/*  */}
            <HStack spacing={4}>
              <VStack alignItems="flex-start" spacing={2} textAlign="left">
                <Text>Gift Amount</Text>
                <Text> {`${ethers.utils.formatEther(gift?.amount)}`}</Text>
              </VStack>
              <VStack alignItems="flex-start" spacing={2} textAlign="left">
                <Text>Tipped Amount</Text>
                <Text>{ethers.utils.formatEther(gift?.tipped)}</Text>
              </VStack>
              <VStack alignItems="flex-start" spacing={2} textAlign="left">
                <Text>Received</Text>
                {/* TODO: Date.fn */}
                <Text fontSize="sm">{DateTime.fromSeconds(gift?.start?.toNumber()).toHTTP()}</Text>
              </VStack>
            </HStack>
            {/*  */}
            {gift?.duration?.toNumber() > 0 && (
              <VStack spacing={2} alignItems="flex-start">
                <Text>Vested Duration in Days</Text>
                <Text>{gift?.duration?.toNumber() / 86400}</Text>
              </VStack>
            )}
            <VStack spacing={2} alignItems="flex-start">
              <Text>Message</Text>
              <Text>{gift?.message}</Text>
            </VStack>
            {/*  */}
            <VStack spacing={2} alignItems="flex-start">
              <Text>Owned by</Text>
              <HStack>
                <Text>{ownedBy}</Text>
                {/* <CopyIcon></CopyIcon> */}
              </HStack>
            </VStack>
            {/*  */}
            <VStack spacing={2} alignItems="flex-start">
              <Text>Minted by</Text>
              <HStack>
                <Text>{from}</Text>
                {/* <CopyIcon></CopyIcon> */}
              </HStack>
            </VStack>
            <VStack spacing={2} alignItems="flex-start">
              <Text>Gift token contract address</Text>
              <HStack>
                <Text>{gift?.token}</Text>
                {/* <CopyIcon></CopyIcon> */}
              </HStack>
            </VStack>
          </VStack>
        </HStack>

        <TransactionHistory id={id}></TransactionHistory>
        <VStack></VStack>
      </VStack>
    );
  } else {
    return null;
  }
};

export { ViewGift };
