import { BigNumber, ethers } from "ethers";
import { useCallback, useContext } from "react";
import { useRouter } from "next/router";
import { yGiftContext } from "../../../hardhat/HardhatContext";
import { YGift } from "../../../hardhat/typechain/YGift";

export function useTipFormManagement(tokenId: string) {
  const [yGift] = useContext(yGiftContext);
  const Router = useRouter();

  const submitHandler = async (params: Parameters<YGift["tip"]>) => {
    try {
      params[1] = ethers.utils.parseEther(params[1].toString());

      const gasLimit = await yGift?.instance?.estimateGas.tip.apply(null, params as any);
      const tx = yGift?.instance?.tip.apply(null, params.concat({ gasLimit: gasLimit?.add("80000") }) as any);
      const tipTx = await tx;
      await tipTx?.wait();
      window.location.reload();
    } catch (e) {
      console.error(e);
      Router.push("/error");
    }
  };
  const onSubmit = useCallback(submitHandler, [yGift?.instance, Router]);
  const initialValues: Parameters<YGift["tip"]> = [tokenId, "", ""];
  return {
    onSubmit,
    initialValues,
  };
}
