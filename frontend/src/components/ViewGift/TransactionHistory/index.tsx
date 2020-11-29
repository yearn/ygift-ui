import React from "react";
import { createDataTestId } from "../../../lib/create-data-testid";
import { Flex, Stack, Text, Button, VStack, Heading, HStack, Divider } from "@chakra-ui/react";
import { BigNumberish, ethers } from "ethers";
import { useGiftTransactionHistory } from "./useGiftTransactionHistory";
import { DateTime } from "luxon";
import { formatAddress } from "../../../lib/format-address";

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
    <Flex alignSelf="flex-start">
      <Text
        color="#013A6D"
        {...{
          fontFamily: "Roboto",
          fontStyle: "normal",
          fontWeight: "bold",
          fontSize: "16px",
          lineHeight: "137.88%",
        }}
        width={["auto", "150px"]}
        textAlign="left"
      >
        {DateTime.fromSeconds(props.date).toHTTP()}
      </Text>
    </Flex>
    <VStack spacing={2} width={["auto", "340px"]} alignSelf="flex-start" alignItems="flex-start">
      <VStack alignItems="flex-start">
        <Text
          color="#0065D0"
          {...{
            fontFamily: "Roboto",
            fontStyle: "normal",
            fontWeight: "normal",
            fontSize: "12px",
            lineHeight: "137.88%",
          }}
          textAlign="left"
        >{`${props.event} by`}</Text>
        <Text
          color="#013A6D"
          {...{
            fontFamily: "Roboto",
            fontStyle: "normal",
            fontWeight: "normal",
            fontSize: "16px",
            lineHeight: "137.88%",
          }}
        >
          {formatAddress(props.minter)}
        </Text>
      </VStack>
      {props.event === "Tipped" && (
        <VStack alignItems="flex-start">
          <Text
            color="#0065D0"
            {...{
              fontFamily: "Roboto",
              fontStyle: "normal",
              fontWeight: "normal",
              fontSize: "12px",
              lineHeight: "137.88%",
            }}
            textAlign="left"
          >
            Message
          </Text>
          <Text
            color="#809EBD"
            {...{
              fontFamily: "Roboto",
              fontStyle: "normal",
              fontWeight: "normal",
              fontSize: "16px",
              lineHeight: "137.88%",
            }}
            textAlign="left"
          >
            {props.message}
          </Text>
        </VStack>
      )}
    </VStack>
    <VStack spacing={2} width={["auto", "340px"]} alignSelf="flex-start" alignItems="flex-start">
      <VStack alignItems="flex-start">
        <Text
          color="#0065D0"
          {...{
            fontFamily: "Roboto",
            fontStyle: "normal",
            fontWeight: "normal",
            fontSize: "12px",
            lineHeight: "137.88%",
          }}
        >{`${props.event === "Transferred" ? "Transferred" : "Gifted"} to`}</Text>
        <Text
          color="#013A6D"
          {...{
            fontFamily: "Roboto",
            fontStyle: "normal",
            fontWeight: "normal",
            fontSize: "16px",
            lineHeight: "137.88%",
          }}
        >
          {formatAddress(props.recipient)}
        </Text>
      </VStack>
      {props.amount && (
        <VStack alignItems="flex-start">
          <Text
            color="#0065D0"
            {...{
              fontFamily: "Roboto",
              fontStyle: "normal",
              fontWeight: "normal",
              fontSize: "12px",
              lineHeight: "137.88%",
            }}
          >
            Amount
          </Text>
          <Text
            color="#013A6D"
            {...{
              fontFamily: "Roboto",
              fontStyle: "normal",
              fontWeight: "normal",
              fontSize: "16px",
              lineHeight: "137.88%",
            }}
          >
            {ethers.utils.formatEther(props.amount)}
          </Text>
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
  if (transactionHistory?.length) {
    return (
      <VStack minHeight="400px" alignItems="flex-start" spacing={"24px"} py={"32px"} px={"24px"} overflowY="scroll">
        <Heading
          as="h3"
          {...{
            fontFamily: "Roboto",
            fontStyle: "normal",
            fontWeight: "bold",
            fontSize: "24px",
            lineHeight: "126.39%",
            color: "#013A6D",
          }}
        >
          Gift History
        </Heading>
        {transactionHistory.map((transaction, index) =>
          index !== transactionHistory.length - 1 ? (
            <React.Fragment key={`${transaction?.date}-${index}`}>
              <Transaction key={`${transaction?.date}-${index}`} {...transaction}></Transaction>
              <Divider></Divider>
            </React.Fragment>
          ) : (
            <Transaction key={`${transaction?.date}-${index}`} {...transaction}></Transaction>
          )
        )}
      </VStack>
    );
  }
  return null;
};

export { TransactionHistory };
