import { useCallback, useContext, useState } from "react";
import { yGiftContext } from "../../../hardhat/HardhatContext";
import { YGift } from "../../../hardhat/typechain/YGift";

export function useCreateGiftFormManagement() {
  const yGift = useContext(yGiftContext);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const submitHandler = (params: Parameters<YGift["mint"]>) => {
    console.log(params);
    return yGift?.instance?.mint.apply(null, params)?.then(() => {
      console.debug(params);
      setHasSubmitted(true);
    });
  };
  const onSubmit = useCallback(submitHandler, [yGift?.instance]);
  const initialValues: Parameters<YGift["mint"]> = ["", "", "", "", "", "", ""];
  return {
    onSubmit,
    initialValues,
    hasSubmitted,
  };
}
