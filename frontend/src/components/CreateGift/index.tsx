import React from "react";
import { createDataTestId } from "../../lib/create-data-testid";
import { Button, VStack, Input, FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/core";
import { useCreateGiftFormManagement } from "./useCreateGiftFormManagement";
import { useFormik } from "formik";

export const componentDataTestId = createDataTestId("CreateGift");

export const params = ["_to", "_token", "_amount", "_url", "_name", "_msg", "_lockedDuration"];

interface IProps {}

const CreateGift: React.FunctionComponent<IProps> = (props) => {
  const management = useCreateGiftFormManagement();
  const formik = useFormik(management);
  // const [_to, _token, _amount, _url, _name, _msg, _lockedDuration] = formik.values;

  return (
    <form onSubmit={formik.handleSubmit}>
      <VStack spacing={2}>
        {params.map((param, index) => (
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
        ))}

        <Button data-testid={"submit"} type="submit" disabled={formik.isSubmitting}>
          Submit
        </Button>
      </VStack>
    </form>
  );
};

export { CreateGift };
