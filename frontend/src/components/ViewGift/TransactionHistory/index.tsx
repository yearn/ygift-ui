import React from "react";
import { createDataTestId } from "../../../lib/create-data-testid";
import { Flex, Stack, Text, Button, VStack, Heading, HStack, Divider } from "@chakra-ui/core";
import { BigNumberish, ethers } from "ethers";
import { useGiftTransactionHistory } from "./useGiftTransactionHistory";
import { DateTime } from "luxon";

export const componentDataTestId = createDataTestId("TransactionHistory");

export const dataTestIds = {};

export type TransactionModel = {
  date: number;
  minter: string;
  recipient: string;
  message?: string;
  amount?: BigNumberish;
  event: "Minted" | "Collected" | "Tipped" | "Transferred";
};

const Transaction: React.FC<TransactionModel> = (props) => (
  <HStack key={props.date} spacing={4}>
    <Text>{DateTime.fromSeconds(props.date).toHTTP()}</Text>
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
        <Text>{`${props.event === "Transferred" ? "Transferred" : "Gifted"} to`}</Text>
        <Text>{props.recipient}</Text>
      </VStack>
      {props.amount && (
        <VStack>
          <Text>Amount</Text>
          <Text>{ethers.utils.formatEther(props.amount)}</Text>
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
        index !== transactionHistory.length - 1 ? (
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
