import React from "react";
import { createDataTestId } from "../../lib/create-data-testid";
import {
  Button,
  VStack,
  Input,
  FormControl,
  FormErrorMessage,
  Box,
  HStack,
  Center,
  Image,
  Heading,
  Text,
} from "@chakra-ui/core";
import { useCreateGiftFormManagement } from "./useCreateGiftFormManagement";
import { useFormik } from "formik";
import graphic from "./graphic.png";

export const componentDataTestId = createDataTestId("CreateGift");

export const params = ["_to", "_token", "_amount", "_url", "_name", "_msg", "_lockedDuration"];

interface IProps {}

const CreateGift: React.FunctionComponent<IProps> = (props) => {
  const management = useCreateGiftFormManagement();
  const formik = useFormik(management);
  // const [_to, _token, _amount, _url, _name, _msg, _lockedDuration] = formik.values;

  return (
    <form onSubmit={formik.handleSubmit}>
      <HStack
        spacing={0}
        {...{
          boxShadow: "0px 0px 68px rgba(27, 39, 70, 0.15)",
          borderRadius: "16px",
          background: "linear-gradient(342.98deg, #013A6D 0%, #0055AC 56.01%, #0065D0 93.35%)",
        }}
        minWidth="60vw"
        height="100%"
      >
        <Center height={"100%"} width="50%">
          {" "}
          <VStack spacing={8} py={4}>
            <Image
              borderRadius="16px"
              height="425px"
              width="auto"
              src={formik.values?.[3]?.toString() || graphic}
            ></Image>
            {/* TODO use filestack-react image picker plugin */}
            <FormControl key={"_url"} isInvalid={Boolean(formik.errors[3] && formik.touched[3])}>
              <Input
                placeHolder="Cover image url"
                key={"_url"}
                data-testid={"_url"}
                id={"3"}
                name={"3"}
                onChange={formik.handleChange}
                type="text"
                value={formik.values[3]?.toString()}
                color="white"
                borderRadius="32px"
              />
              <FormErrorMessage>{formik.errors[3]}</FormErrorMessage>
            </FormControl>
          </VStack>
        </Center>

        <Box
          background="white"
          width="50%"
          height="100%"
          py={10}
          px={16}
          borderRadius="16px"
          borderTopLeftRadius="none"
          borderBottomLeftRadius="none"
        >
          <Center>
            <VStack spacing={4} maxWidth={"450px"}>
              <Heading
                {...{
                  fontFamily: "Roboto",
                  fontStyle: "normal",
                  fontWeight: "bold",
                  fontSize: "24px",
                  lineHeight: "126.39%",
                  color: "#013A6D",
                  alignSelf: "flex-start",
                }}
              >
                Create a new Gift
              </Heading>
              <Text
                {...{
                  fontFamily: "Roboto",
                  fontStyle: "normal",
                  fontWeight: "normal",
                  fontSize: "16px",
                  lineHeight: "137.88%",
                  color: "#809EBD",
                  alignSelf: "flex-start",
                }}
              >
                Add artwork, a special message, and yUSD if you like.
              </Text>
              {params.map((param, index) => {
                if (param === "_url") {
                  return null;
                }

                return (
                  <FormControl
                    key={param}
                    isInvalid={Boolean(formik.errors[index] && formik.touched[index])}
                    background="#ECF4FA"
                    borderRadius="24px"
                  >
                    <Input
                      placeholder={param}
                      key={param}
                      data-testid={param}
                      id={index.toString()}
                      name={index.toString()}
                      onChange={formik.handleChange}
                      type="text"
                      value={formik.values[index]?.toString()}
                      color="#013A6D"
                      {...{
                        fontFamily: "Roboto",
                        fontStyle: "normal",
                        fontWeight: "normal",
                        fontSize: "16px",
                      }}
                    />
                    <FormErrorMessage>{formik.errors[index]}</FormErrorMessage>
                  </FormControl>
                );
              })}
              <Button
                data-testid={"submit"}
                type="submit"
                disabled={formik.isSubmitting}
                variant="outline"
                background="#0065D0"
                borderRadius="32px"
                width={"100%"}
                color="white"
                {...{
                  fontFamily: "Roboto",
                  fontStyle: "normal",
                  fontWeight: "normal",
                  fontSize: "16px",
                  lineHeight: "137.88%",
                }}
              >
                Submit
              </Button>
            </VStack>
          </Center>
        </Box>
      </HStack>
    </form>
  );
};

export { CreateGift };
