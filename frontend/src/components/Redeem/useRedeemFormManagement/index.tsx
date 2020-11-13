import { useCallback, useContext } from "react";
import { yGiftContext } from "../../../hardhat/HardhatContext";
import { YGift } from "../../../hardhat/typechain/YGift";

export function useRedeemFormManagement(tokenId: string) {
  const yGift = useContext(yGiftContext);
  const submitHandler = (params: Parameters<YGift["redeem"]>) =>
    yGift?.instance?.redeem.apply(null, params)?.then(() => {
      console.debug("hello");
    });
  const onSubmit = useCallback(submitHandler, [yGift?.instance]);
  const initialValues: Parameters<YGift["redeem"]> = [tokenId];
  return {
    onSubmit,
    initialValues,
  };
}
