import React, { useContext } from "react";
import { createDataTestId } from "../../lib/create-data-testid";
import { Flex, Stack, Text, Button } from "@chakra-ui/core";
import { yGiftContext } from "../../hardhat/HardhatContext";

export const params = [];

interface IProps {}

const Gifts: React.FunctionComponent<IProps> = (props) => {
  return <Flex flexWrap="wrap">hello World</Flex>;
};

export { Gifts };
