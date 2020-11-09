import { useCallback, useContext } from "react";
import { yGiftContext } from "../../../hardhat/HardhatContext";
import { YGift } from "../../../hardhat/typechain/YGift";

export function useCreateGiftFormManagement() {
  const yGift = useContext(yGiftContext);
  const submitHandler = (params: Parameters<YGift["mint"]>) =>
    yGift?.instance?.mint.apply(null, params)?.then(() => {
      console.debug("hello");
    });
  const handleSubmit = useCallback(submitHandler, [yGift?.instance]);
  const initialValues: Parameters<YGift["mint"]> = ["", "", 0, "", "", "", 0];
  return {
    handleSubmit,
    initialValues,
  };
}
