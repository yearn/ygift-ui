import { BigNumber, ethers } from "ethers";
import { useCallback, useContext } from "react";
import { useHistory } from "react-router-dom";
import { yGiftContext } from "../../../hardhat/HardhatContext";
import { YGift } from "../../../hardhat/typechain/YGift";

export function useTipFormManagement(tokenId: string) {
  const yGift = useContext(yGiftContext);
  const history = useHistory();

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
      history.push("/error");
    }
  };
  const onSubmit = useCallback(submitHandler, [yGift?.instance, history]);
  const initialValues: Parameters<YGift["tip"]> = [tokenId, "", ""];
  return {
    onSubmit,
    initialValues,
  };
}
