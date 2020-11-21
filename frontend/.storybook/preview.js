import { ChakraProvider, theme } from "@chakra-ui/react";
import { HardhatContext } from "../src/hardhat/HardhatContext";
import { BrowserRouter as Router } from "react-router-dom";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};

export const decorators = [
  (Story) => (
    <ChakraProvider theme={theme}>
      <HardhatContext>
        <Router>
          <Story />
        </Router>
      </HardhatContext>
    </ChakraProvider>
  ),
];
