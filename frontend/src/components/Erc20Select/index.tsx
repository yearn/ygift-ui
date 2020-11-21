import React from "react";
import { createDataTestId } from "../../lib/create-data-testid";
import { Flex, Stack, Text, Button } from "@chakra-ui/react";

export const componentDataTestId = createDataTestId("Erc20Select");

export const dataTestIds = {};

interface IProps {}

const Erc20Select: React.FunctionComponent<IProps> = (props) => (
  <Stack spacing={1}>
    <Text>Hello world</Text>
  </Stack>
);

export { Erc20Select };
