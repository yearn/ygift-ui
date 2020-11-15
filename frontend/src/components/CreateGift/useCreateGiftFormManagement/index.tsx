import { useCallback, useContext, useState } from "react";
import { yGiftContext } from "../../../hardhat/HardhatContext";
import { YGift } from "../../../hardhat/typechain/YGift";

export function useCreateGiftFormManagement() {
  const yGift = useContext(yGiftContext);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const submitHandler = async (params: Parameters<YGift["mint"]>) => {
    console.log(params);
    return new Promise(async (resolve) => {
      const tx = yGift?.instance?.mint.apply(null, params.concat({ gasLimit: 5000000 }) as any);
      const hello = await tx;
      setHasSubmitted(true);
      await hello?.wait();
      resolve(true);
    });
  };
  const onSubmit = useCallback(submitHandler, [yGift?.instance]);
  // _to: string, _token: string, _amount: BigNumberish, _name: string, _msg: string, _url: string, _start: BigNumberish, _duration: BigNumberish,
  const initialValues: Parameters<YGift["mint"]> = [
    "",
    "",
    "",
    "",
    "",
    "",
    Math.floor(new Date().getTime() / 1000) + 1000,
    1000,
  ];
  return {
    onSubmit,
    initialValues,
    hasSubmitted,
  };
}
