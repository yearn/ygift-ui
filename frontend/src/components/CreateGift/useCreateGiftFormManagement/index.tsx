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
      await tx;
      setHasSubmitted(true);
      resolve(true);
    });
  };
  const onSubmit = useCallback(submitHandler, [yGift?.instance]);
  // ["_to", "_token", "_amount", "_name", "_msg", "_url", "_start", "_duration"] // 0: "0xbfeceC47dD8bf5F6264A9830A9d26ef387c38A67" // 1: "0xee71557964a9872FBf77F29b87579329462529Cf" // 2: 1000000000000
  // 3: "http://localhost:3000/static/media/graphic.d9afa5d0.png"
  // 4: "Mr Right"
  // 5: "http://localhost:3000/static/media/graphic.d9afa5d0.png"
  // 6: "1605370757966"
  // 7: "1000"
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
