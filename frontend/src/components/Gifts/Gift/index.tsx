import React from "react";
import { createDataTestId } from "../../../lib/create-data-testid";
import { Flex, Stack, Text, Button, Image, VStack, Heading } from "@chakra-ui/core";
import { BigNumber, ethers } from "ethers";
import { Link } from "react-router-dom";

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

const Gift: React.FunctionComponent<GiftModel> = (props) => (
  <Link to={`/gift/${props.id}`}>
    <VStack spacing={0} width="220px" boxShadow="0px 0px 24px rgba(27, 39, 70, 0.1)" cursor="pointer">
      <Image width="220px" height="auto" src={props?.url} borderRadius="16px"></Image>
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
              {`${ethers.utils.formatEther(props?.amount.toString())}`}
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

export { Gift };
