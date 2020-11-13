import React from "react";
import { createDataTestId } from "../../lib/create-data-testid";
import { Button, VStack, Input, FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/core";
import { useRedeemFormManagement } from "./useRedeemFormManagement";
import { useFormik } from "formik";

export const componentDataTestId = createDataTestId("Redeem");

export const params = ["_tokenId"];

interface IProps {
  tokenId: string;
}

const Redeem: React.FunctionComponent<IProps> = (props) => {
  const management = useRedeemFormManagement(props.tokenId);
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
          Redeem
        </Button>
      </VStack>
    </form>
  );
};

export { Redeem };
