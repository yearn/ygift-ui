import React from "react";
import { createDataTestId } from "../../lib/create-data-testid";
import { Center, VStack } from "@chakra-ui/react";
import { Navbar } from "../Navbar";

export const componentDataTestId = createDataTestId("Layout");

export const dataTestIds = {};

interface IProps {}

const Layout: React.FunctionComponent<IProps> = (props) => (
  <VStack spacing={0}>
    <Navbar></Navbar>
    <Center minHeight={`calc(100vh - 72px)`} width={"100%"}>
      {props.children}
    </Center>
  </VStack>
);

export { Layout };
