import React from "react";
import { createDataTestId } from "../../lib/create-data-testid";
import { Flex, Stack, Text, Button } from "@chakra-ui/core";

export const componentDataTestId = createDataTestId("CreateGift");

export const dataTestIds = { hello: componentDataTestId("hello") };

interface IProps {}

const CreateGift: React.FunctionComponent<IProps> = (props) => (
  <Stack spacing={1}>
    <Text data-testid={dataTestIds.hello}>helloWorld</Text>
  </Stack>
);

export { CreateGift };
