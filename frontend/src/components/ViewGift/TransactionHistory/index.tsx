import React from "react";
import { createDataTestId } from "../../../lib/create-data-testid";
import { Flex, Stack, Text, Button, VStack, Heading, HStack, Divider } from "@chakra-ui/core";
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
  event: "Minted" | "Collected" | "Tipped";
};

const Transaction: React.FC<TransactionModel> = (props) => (
  <HStack key={props.date} spacing={4}>
    <Text>{new Date(props.date).valueOf()}</Text>
    <VStack spacing={2}>
      <VStack>
        <Text>{`${props.event} by`}</Text>
        <Text>{props.minter}</Text>
      </VStack>
      {props.event === "Tipped" && (
        <VStack>
          <Text>Message</Text>
          <Text>{props.message}</Text>
        </VStack>
      )}
    </VStack>
    <VStack spacing={2}>
      <VStack>
        <Text>Gifted to</Text>
        <Text>{props.recipient}</Text>
      </VStack>
      {props.amount && (
        <VStack>
          <Text>Amount</Text>
          <Text>{props.amount?.toString()}</Text>
        </VStack>
      )}
    </VStack>
  </HStack>
);

interface IProps {
  id: string;
}

const TransactionHistory: React.FunctionComponent<IProps> = (props) => {
  const { transactionHistory } = useGiftTransactionHistory(props.id);
  console.log(transactionHistory);
  return (
    <VStack minHeight="400px" alignItems="flex-start" spacing={1} p={4} overflowY="scroll">
      <Heading as="h3" fontFamily="Roboto" fontSize="24px">
        Gift History
      </Heading>
      {transactionHistory.map((transaction, index) =>
        index % 2 ? (
          <>
            <Transaction key={`${transaction?.date}-${index}`} {...transaction}></Transaction>
            <Divider></Divider>
          </>
        ) : (
          <Transaction key={`${transaction?.date}-${index}`} {...transaction}></Transaction>
        )
      )}
    </VStack>
  );
};

export { TransactionHistory };
