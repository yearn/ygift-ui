import React from "react";
import { createDataTestId } from "../../lib/create-data-testid";
import { Flex, Stack, Text, Button } from "@chakra-ui/core";
import { useCreateGiftFormManagement } from "./useCreateGiftFormManagement";
import { useFormik } from "formik";

export const componentDataTestId = createDataTestId("CreateGift");

export const dataTestIds = {
  _to: componentDataTestId("_to", "input"),
  _token: componentDataTestId("_token", "input"),
  _amount: componentDataTestId("_amount", "input"),
  submitButton: componentDataTestId("submit", "button"),
};

interface IProps {}

const CreateGift: React.FunctionComponent<IProps> = (props) => {
  const management = useCreateGiftFormManagement();
  const formik = useFormik(management);
  const [_to, _token, _amount, _url, _name, _msg, _lockedDuration] = formik.values;
  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <input
          data-testid={dataTestIds._to}
          id="_to"
          name="_to"
          type="text"
          onChange={formik.handleChange}
          value={_to}
        />
        <input
          data-testid={dataTestIds._token}
          id="_token"
          name="_token"
          type="text"
          onChange={formik.handleChange}
          value={_token}
        />
        <input
          data-testid={dataTestIds._amount}
          id="_amount"
          name="_amount"
          type="number"
          onChange={formik.handleChange}
          value={_amount.toString()}
        />
        <button data-testid={dataTestIds.submitButton} type="submit" disabled={formik.isSubmitting}>
          Submit
        </button>
      </form>
    </div>
  );
};

export { CreateGift };
