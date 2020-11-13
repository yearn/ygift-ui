import React from "react";
import { createDataTestId } from "../../lib/create-data-testid";
import { Button, VStack, Input, FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/core";
import { useTipFormManagement } from "./useTipFormManagement";
import { useFormik } from "formik";

export const componentDataTestId = createDataTestId("Tip");

export const params = ["_tokenId", "_amount", "_msg"];

interface IProps {
  tokenId: string;
}

const Tip: React.FunctionComponent<IProps> = (props) => {
  const management = useTipFormManagement(props.tokenId);
  const formik = useFormik(management);

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
          Tip
        </Button>
      </VStack>
    </form>
  );
};

export { Tip };
