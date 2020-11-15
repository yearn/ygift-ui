import { useCallback, useContext } from "react";
import { yGiftContext } from "../../../hardhat/HardhatContext";
import { YGift } from "../../../hardhat/typechain/YGift";

export function useCollectFormManagement(tokenId: string) {
  const yGift = useContext(yGiftContext);
  const submitHandler = async (params: Parameters<YGift["collect"]>) => {
    const tx = yGift?.instance?.collect.apply(null, params.concat({ gasLimit: 5000000 }) as any);
    const collectTx = await tx;
    await collectTx?.wait();
    window.location.reload();
  };
  const onSubmit = useCallback(submitHandler, [yGift?.instance]);
  const initialValues: Parameters<YGift["collect"]> = [tokenId, ""];
  return {
    onSubmit,
    initialValues,
  };
}
