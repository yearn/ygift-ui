import React from "react";
import { createDataTestId } from "../../lib/create-data-testid";
import { Button, VStack, Heading, Center, Image } from "@chakra-ui/react";
import graphic from "./error-graphic.png";
import { useHistory } from "react-router-dom";

export const componentDataTestId = createDataTestId("Error ");

export const dataTestIds = {};

interface IProps {}

const Error: React.FunctionComponent<IProps> = (props) => {
  const history = useHistory();

  return (
    <Center
      width={["100vw", "90vw", "90vw", "70vw"]}
      {...{
        background: "linear-gradient(342.98deg, #013A6D 0%, #0055AC 56.01%, #0065D0 93.35%)",
        borderRadius: "16px",
      }}
    >
      <VStack spacing={8} p={10}>
        <Heading
          as="h3"
          {...{
            fontFamily: "Roboto",
            fontStyle: "normal",
            fontWeight: "bold",
            fontSize: "24px",
            color: "#FFFFFF",
          }}
        >
          Oops, something went wrong :(
        </Heading>
        <Image src={graphic}></Image>
        {history.length > 1 ? (
          <Button
            {...{
              border: "1px solid #FFFFFF",
              boxSizing: "border-box",
              borderRadius: "32px",
              color: "#FFFFFF",
              fontFamily: "Roboto",
              fontStyle: "normal",
              fontWeight: "normal",
              fontSize: "16px",
            }}
            _hover={{ border: "1px solid grey" }}
            width={350}
            height={"56px"}
            variant="outline"
            onClick={(): void => {
              history.goBack();
            }}
          >
            Try again
          </Button>
        ) : null}
      </VStack>
    </Center>
  );
};

export { Error };
