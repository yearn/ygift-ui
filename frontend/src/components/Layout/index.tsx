import React from "react";
import { createDataTestId } from "../../lib/create-data-testid";
import { VStack } from "@chakra-ui/core";
import { Navbar } from "../Navbar";

export const componentDataTestId = createDataTestId("Layout");

export const dataTestIds = {};

interface IProps {}

const Layout: React.FunctionComponent<IProps> = (props) => (
  <VStack spacing={0}>
    <Navbar></Navbar>
    {props.children}
  </VStack>
);

export { Layout };
