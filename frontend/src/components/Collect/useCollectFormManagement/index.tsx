import { useCallback, useContext } from "react";
import { yGiftContext } from "../../../hardhat/HardhatContext";
import { YGift } from "../../../hardhat/typechain/YGift";

export function useCollectFormManagement(tokenId: string) {
  const yGift = useContext(yGiftContext);
  const submitHandler = (params: Parameters<YGift["collect"]>) =>
    yGift?.instance?.collect.apply(null, params.concat({ gasLimit: 5000000 }) as any)?.then(() => {
      console.debug("hello");
    });
  const onSubmit = useCallback(submitHandler, [yGift?.instance]);
  const initialValues: Parameters<YGift["collect"]> = [tokenId, ""];
  return {
    onSubmit,
    initialValues,
  };
}
