import { ChakraProvider } from "@chakra-ui/core";
import { HardhatContext } from "../src/hardhat/HardhatContext";
import { BrowserRouter as Router } from "react-router-dom";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};

export const decorators = [
  (Story) => (
    <ChakraProvider>
      <HardhatContext>
        <Router>
          <Story />
        </Router>
      </HardhatContext>
    </ChakraProvider>
  ),
];
