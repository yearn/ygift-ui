import React from "react";
import { createDataTestId } from "../../lib/create-data-testid";
import { Flex, Stack, Text, Button } from "@chakra-ui/core";
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
    <div>
      <form onSubmit={formik.handleSubmit}>
        {params.map((param, index) => (
          <input
            key={param}
            data-testid={param}
            id={param}
            name={param}
            onChange={formik.handleChange}
            type="text"
            value={formik.values[index]?.toString()}
          />
        ))}

        <button data-testid={"submit"} type="submit" disabled={formik.isSubmitting}>
          Submit
        </button>
      </form>
    </div>
  );
};

export { CreateGift };
