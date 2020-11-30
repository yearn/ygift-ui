import { useContext, useEffect, useState } from "react";
import { CurrentAddressContext, ProviderContext, SignerContext, yGiftContext } from "../../../hardhat/HardhatContext";
import { GiftModel } from "../../Gifts/Gift";

export function useGifts() {
  const [signer] = useContext(SignerContext);
  const [provider] = useContext(ProviderContext);
  const [currentAddress] = useContext(CurrentAddressContext);
  const [yGift] = useContext(yGiftContext);
  const [giftsOwned, setGiftsOwned] = useState<(GiftModel | undefined)[]>([]);
  const [giftsSent, setGiftsSent] = useState<(GiftModel | undefined)[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const giftMintedSentEventFilter = yGift?.instance?.filters?.GiftMinted(String(currentAddress), null, null, null);
      const giftMintedOwnedEventFilter = yGift?.instance?.filters?.GiftMinted(null, String(currentAddress), null, null);

      if (giftMintedSentEventFilter) {
        const logs = await provider?.getLogs({ ...giftMintedSentEventFilter, fromBlock: 0 });
        const giftsMinted = logs.map((log) => yGift?.instance?.interface?.parseLog(log)?.args);
        const ids: string[] = giftsMinted.map((gift) => {
          console.log(gift);
          const id = gift?.[2];
          return id;
        });
        let gifts = await Promise.all(ids.map((id) => yGift?.instance?.gifts(id)));
        (gifts as any) = ids.map((id, index) => ({ ...gifts[index], id }));
        setGiftsSent(gifts);
      }

      // Now do giftsReceived/Owned
      if (giftMintedOwnedEventFilter) {
        const logs = await provider?.getLogs({ ...giftMintedOwnedEventFilter, fromBlock: 0 });
        const giftsMinted = logs.map((log) => yGift?.instance?.interface?.parseLog(log)?.args);
        const ids: string[] = giftsMinted.map((gift) => {
          const id = gift?.[2];
          return id;
        });
        let gifts = await Promise.all(ids.map((id) => yGift?.instance?.gifts(id)));
        (gifts as any) = ids.map((id, index) => ({ ...gifts[index], id }));
        setGiftsOwned(gifts);
      }
    };
    fetch();
  }, [yGift?.instance, signer, provider, currentAddress]);

  return { giftsOwned, giftsSent };
}
