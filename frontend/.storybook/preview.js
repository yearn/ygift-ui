import { ChakraProvider } from "@chakra-ui/core";
import { HardhatContext } from "../src/hardhat/HardhatContext";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};

export const decorators = [
  (Story) => (
    <ChakraProvider>
      <HardhatContext>
        <Story />
      </HardhatContext>
    </ChakraProvider>
  ),
];
