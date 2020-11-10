import { useContext, useEffect, useState } from "react";
import { ProviderContext, SignerContext, yGiftContext } from "../../../hardhat/HardhatContext";
import { GiftModel } from "../../Gifts/Gift";

export function useGifts() {
  const yGift = useContext(yGiftContext);
  const signer = useContext(SignerContext);
  const provider = useContext(ProviderContext);
  const [giftsOwned, setGiftsOwned] = useState<(GiftModel | undefined)[]>([]);
  const [giftsSent, setGiftsSent] = useState<(GiftModel | undefined)[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const address = await signer?.[0]?.getAddress();
      const giftMintedSentEventFilter = yGift?.instance?.filters?.GiftMinted(String(address), null, null, null);
      const giftMintedOwnedEventFilter = yGift?.instance?.filters?.GiftMinted(null, String(address), null, null);

      if (giftMintedSentEventFilter) {
        const logs = await provider?.[0]?.getLogs(giftMintedSentEventFilter);
        const giftsMinted = logs.map((log) => yGift?.instance?.interface?.parseLog(log)?.args);
        const _tokenIds: string[] = giftsMinted.map((gift) => {
          const _tokenId = gift?.[2];
          return _tokenId;
        });
        const gifts = await Promise.all(_tokenIds.map((_tokenId) => yGift?.instance?.getGift(_tokenId)));
        setGiftsSent(gifts);
      }

      // Now do giftsReceived/Owned
      if (giftMintedOwnedEventFilter) {
        const logs = await provider?.[0]?.getLogs(giftMintedOwnedEventFilter);
        const giftsMinted = logs.map((log) => yGift?.instance?.interface?.parseLog(log)?.args);
        const _tokenIds: string[] = giftsMinted.map((gift) => {
          const _tokenId = gift?.[2];
          return _tokenId;
        });
        const gifts = await Promise.all(_tokenIds.map((_tokenId) => yGift?.instance?.getGift(_tokenId)));
        setGiftsOwned(gifts);
      }
    };
    fetch();
  }, [yGift?.instance, signer, provider]);

  return { giftsOwned, giftsSent };
}
