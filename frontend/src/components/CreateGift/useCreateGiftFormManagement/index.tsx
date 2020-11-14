import { useCallback, useContext, useState } from "react";
import { yGiftContext } from "../../../hardhat/HardhatContext";
import { YGift } from "../../../hardhat/typechain/YGift";

export function useCreateGiftFormManagement() {
  const yGift = useContext(yGiftContext);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const submitHandler = async (params: Parameters<YGift["mint"]>) => {
    console.log(params);
    return new Promise(async (resolve) => {
      const tx = await yGift?.instance?.mint.apply(null, params);
      await tx?.wait(0);
      setHasSubmitted(true);
      resolve(true);
    });
  };
  const onSubmit = useCallback(submitHandler, [yGift?.instance]);
  // ["_to", "_token", "_amount", "_name", "_msg", "_url", "_start", "_duration"]
  const initialValues: Parameters<YGift["mint"]> = ["", "", "", "", "", "", "", ""];
  return {
    onSubmit,
    initialValues,
    hasSubmitted,
  };
}
