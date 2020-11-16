import { BigNumber, ethers } from "ethers";
import { useCallback, useContext } from "react";
import { yGiftContext } from "../../../hardhat/HardhatContext";
import { YGift } from "../../../hardhat/typechain/YGift";

export function useTipFormManagement(tokenId: string) {
  const yGift = useContext(yGiftContext);

  const submitHandler = async (params: Parameters<YGift["tip"]>) => {
    params[1] = ethers.utils.parseEther(params[1].toString());
    const tx = yGift?.instance?.tip.apply(null, params.concat({ gasLimit: 5000000 }) as any);
    const tipTx = await tx;
    await tipTx?.wait();
    window.location.reload();
  };
  const onSubmit = useCallback(submitHandler, [yGift?.instance]);
  const initialValues: Parameters<YGift["tip"]> = [tokenId, 0, ""];
  return {
    onSubmit,
    initialValues,
  };
}
