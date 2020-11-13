import { useCallback, useContext } from "react";
import { yGiftContext } from "../../../hardhat/HardhatContext";
import { YGift } from "../../../hardhat/typechain/YGift";

export function useTipFormManagement(tokenId: string) {
  const yGift = useContext(yGiftContext);
  const submitHandler = (params: Parameters<YGift["tip"]>) =>
    yGift?.instance?.tip.apply(null, params)?.then(() => {
      console.debug("hello");
    });
  const onSubmit = useCallback(submitHandler, [yGift?.instance]);
  const initialValues: Parameters<YGift["tip"]> = [tokenId, 0, ""];
  return {
    onSubmit,
    initialValues,
  };
}
