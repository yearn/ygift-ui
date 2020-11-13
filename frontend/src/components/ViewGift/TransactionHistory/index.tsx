import React from "react";
import { createDataTestId } from "../../../lib/create-data-testid";
import { Flex, Stack, Text, Button, VStack, Heading, HStack } from "@chakra-ui/core";
import { BigNumberish } from "ethers";
import { useGiftTransactionHistory } from "./useGiftTransactionHistory";

export const componentDataTestId = createDataTestId("TransactionHistory");

export const dataTestIds = {};

export type TransactionModel = {
  date: number;
  minter: string;
  recipient: string;
  message?: string;
  amount?: BigNumberish;
};

const Transaction: React.FC<TransactionModel> = (props) => (
  <HStack spacing={4}>
    <Text>{new Date(props.date)}</Text>
    <VStack spacing={2}>
      <VStack>
        <Text>Minted by</Text>
        <Text>{props.minter}</Text>
      </VStack>
      <VStack>
        <Text>Message</Text>
        <Text>{props.message}</Text>
      </VStack>
    </VStack>
    <VStack spacing={2}>
      <VStack>
        <Text>Gifted to</Text>
        <Text>{props.recipient}</Text>
      </VStack>
      <VStack>
        <Text>Amount</Text>
        <Text>{props.amount} ETH</Text>
      </VStack>
    </VStack>
  </HStack>
);

interface IProps {
  tokenId: string;
}

const TransactionHistory: React.FunctionComponent<IProps> = (props) => {
  const { transactionHistory } = useGiftTransactionHistory(props.tokenId);

  return (
    <VStack alignItems="flex-start" spacing={1} p={4} overflowY="scroll">
      <Heading as="h3" fontFamily="Roboto" fontSize="24px">
        Gift History
      </Heading>
      {transactionHistory.map(Transaction)}
    </VStack>
  );
};

export { TransactionHistory };
