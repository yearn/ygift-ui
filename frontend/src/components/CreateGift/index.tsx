import React from "react";
import { createDataTestId } from "../../lib/create-data-testid";
import {
  Button,
  VStack,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Box,
  HStack,
  Center,
  Image,
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
        height={"100%"}
      >
        <Center height={"100%"} width="50%">
          <VStack spacing={8}>
            <Image height="auto" width="300px" src={graphic}></Image>
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
              />
              <FormErrorMessage>{formik.errors[3]}</FormErrorMessage>
            </FormControl>
          </VStack>
        </Center>

        <VStack background="white" width="50%" spacing={2} py={8} px={16}>
          {params.map((param, index) => {
            if (param === "_url") {
              return null;
            }
            return (
              <FormControl key={param} isInvalid={Boolean(formik.errors[index] && formik.touched[index])}>
                <FormLabel htmlFor={param}>{param}</FormLabel>
                <Input
                  key={param}
                  data-testid={param}
                  id={index.toString()}
                  name={index.toString()}
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values[index]?.toString()}
                />
                <FormErrorMessage>{formik.errors[index]}</FormErrorMessage>
              </FormControl>
            );
          })}

          <Button data-testid={"submit"} type="submit" disabled={formik.isSubmitting}>
            Submit
          </Button>
        </VStack>
      </HStack>
    </form>
  );
};

export { CreateGift };
