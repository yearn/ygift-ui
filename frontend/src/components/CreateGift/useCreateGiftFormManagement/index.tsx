import { useFormikContext } from "formik";
import { useCallback, useContext } from "react";
import { yGiftContext } from "../../../hardhat/HardhatContext";
import { YGift } from "../../../hardhat/typechain/YGift";

export function useCreateGiftFormManagement() {
  const yGift = useContext(yGiftContext);
  const formik = useFormikContext();
  const submitHandler = (params: Parameters<YGift["mint"]>) =>
    yGift?.instance?.mint.apply(null, params)?.then(() => {
      console.debug(params);
      formik.setSubmitting(false);
    });
  const onSubmit = useCallback(submitHandler, [yGift?.instance, formik]);
  const initialValues: Parameters<YGift["mint"]> = ["", "", "", "", "", "", ""];
  return {
    onSubmit,
    initialValues,
  };
}
