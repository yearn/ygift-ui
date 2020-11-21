import React from "react";
import { createDataTestId } from "../../lib/create-data-testid";
import { Flex, Stack, Text, Button, VStack, Heading, HStack, Input, Image } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import graphic from "./graphic.png";

export const componentDataTestId = createDataTestId("About");

export const dataTestIds = {};

interface IProps {}

interface IContentProps {}
const Content: React.FC<IContentProps> = (props) => {
  // const [address, setAddress] = React.useState("");
  // const history = useHistory();
  return (
    <VStack spacing={4} textAlign="left" width="543px">
      <Heading
        as="h2"
        fontSize="58px"
        {...{
          fontFamily: "Roboto",
          fontStyle: "normal",
          fontWeight: "bold",
          lineHeight: "73px",
          color: "#013A6D",
        }}
        mb={8}
      >
        NFTs for gifts, grants, and gratitude
      </Heading>
      <VStack textAlign="left" alignItems="flex-start">
        {/* <Text
          {...{
            fontFamily: "Roboto",
            fontStyle: "normal",
            fontWeight: "normal",
            fontSize: "16px",
            color: "#809EBD",
          }}
        > */}
        {/* Send a thank you with a custom NFT—or add yUSD to reward contributors with a sharable NFT that stays meaningful */}
        {/* and memorable forever. */}
        {/* NFTs for gifts, grants, and gratitude
        </Text>{" "} */}
        <Text
          {...{
            fontFamily: "Roboto",
            fontStyle: "normal",
            fontWeight: "normal",
            fontSize: "16px",
            color: "#809EBD",
          }}
        >
          Send a thank you with a custom NFT collectible—or add tokens to reward contributors with a sharable NFT that
          stays meaningful and memorable forever.
        </Text>
      </VStack>
      {/* TODO: Hide until route implemented */}
      {/* <HStack spacing={4}>
        <Input
          background="#ECF4FA"
          borderRadius="24px"
          placeholder="ETH Address"
          onChange={(e) => setAddress(e.target.value)}
          type={"text"}
          minWidth="300px"
        />
        <Button
          variant="outline"
          {...{
            border: "1px solid #0065D0",
            borderColor: "#0065D0",
            boxSizing: "border-box",
            borderRadius: "32px",
            color: "#0065D0",
          }}
          minWidth="300px"
          onClick={() => {
            history.push(`/gifts/${address}`);
          }}
        >
          View someone's gifts
        </Button>
      </HStack> */}
    </VStack>
  );
};

const About: React.FunctionComponent<IProps> = (props) => (
  <HStack spacing={10} px={[5, 10, 40]}>
    <Content></Content>
    <Image src={graphic} width={"574px"} height="auto"></Image>
  </HStack>
);

export { About };
