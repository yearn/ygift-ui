import { useCallback, useContext, useState } from "react";
import { CurrentAddressContext, ProviderContext, yGiftContext } from "../../../hardhat/HardhatContext";
import { YGift } from "../../../hardhat/typechain/YGift";
import { DateTime, Duration } from "luxon";

export function useCreateGiftFormManagement() {
  const yGift = useContext(yGiftContext);
  const [currentAddress] = useContext(CurrentAddressContext);
  const [provider] = useContext(ProviderContext);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [giftCreatedId, setGiftCreatedId] = useState("");
  const _start = Math.floor(DateTime.local().toSeconds());
  const dayInSeconds = 86400;

  const submitHandler = async (params: Parameters<YGift["mint"]>) => {
    console.log(params);
    return new Promise(async (resolve) => {
      // Convert days to seconds
      console.log(params[7]);
      params[7] = dayInSeconds * Number(params[7]);
      console.log(params[7]);

      const tx = yGift?.instance?.mint.apply(null, params.concat({ gasLimit: 5000000 }) as any);
      const createGiftTx = await tx;
      const result = await createGiftTx?.wait();
      setHasSubmitted(true);
      const giftMintedSentEventFilter = yGift?.instance?.filters?.GiftMinted(String(currentAddress), null, null, null);
      if (giftMintedSentEventFilter) {
        const logs = await provider?.getLogs({ ...giftMintedSentEventFilter, fromBlock: 0 });
        const giftsMinted = logs.map((log) => yGift?.instance?.interface?.parseLog(log)?.args);
        if (giftsMinted?.[giftsMinted.length - 1]) {
          console.log(giftsMinted);
          const giftMinted = giftsMinted?.[giftsMinted.length - 1];
          setGiftCreatedId(giftMinted?.[2]);
        }
      }
      console.log(result);
      console.log(result?.logs);
      // const parsedLogs = result?.logs.map((log) => yGift?.instance?.interface?.parseLog(log)?.args);
      // console.log(parsedLogs);
      resolve(true);
    });
  };
  const onSubmit = useCallback(submitHandler, [yGift?.instance, provider, currentAddress]);
  // _to: string, _token: string, _amount: BigNumberish, _name: string, _msg: string, _url: string, _start: BigNumberish, _duration: BigNumberish,
  const initialValues: Parameters<YGift["mint"]> = ["", "", "", "", "", "", _start, ""];
  return {
    onSubmit,
    initialValues,
    hasSubmitted,
    giftCreatedId,
  };
}
