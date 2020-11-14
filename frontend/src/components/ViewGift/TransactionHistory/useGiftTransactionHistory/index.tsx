import { useContext, useEffect, useState } from "react";
import { ProviderContext, SignerContext, yGiftContext } from "../../../../hardhat/HardhatContext";
import { TransactionModel } from "../";

export function useGiftTransactionHistory(tokenId: string) {
  const yGift = useContext(yGiftContext);
  const signer = useContext(SignerContext);
  const provider = useContext(ProviderContext);
  const [transactionHistory, setTransactionHistory] = useState<TransactionModel[]>([]);

  useEffect(() => {
    const fetch = async () => {
      // const address = await signer?.[0]?.getAddress();
      const giftMintedSentEventFilter = yGift?.instance?.filters?.GiftMinted(null, null, tokenId, null);
      const giftMintedOwnedEventFilter = yGift?.instance?.filters?.GiftMinted(null, null, tokenId, null);
      const collectedEventFilter = yGift?.instance?.filters?.Collected(null, tokenId, null, null);
      const tipEventFilter = yGift?.instance?.filters?.Tip(null, tokenId, null, null, null);

      const transactions: TransactionModel[] = [];

      if (giftMintedSentEventFilter) {
        console.log(giftMintedSentEventFilter);
        const logs = await provider?.[0]?.getLogs({ ...giftMintedSentEventFilter, fromBlock: 0 });
        const [giftMinted] = logs.map((log) => yGift?.instance?.interface?.parseLog(log)?.args);
        if (giftMinted) {
          const [from, to] = giftMinted;
          const block = await provider?.[0]?.getBlock(logs[0].blockHash);
          const transaction: TransactionModel = {
            minter: from,
            recipient: to,
            date: block.timestamp,
          };
          transactions.push(transaction);
        }
      }

      // Now do giftsReceived/Owned
      if (giftMintedOwnedEventFilter) {
        const logs = await provider?.[0]?.getLogs({ ...giftMintedOwnedEventFilter, fromBlock: 0 });
        const [giftMinted] = logs.map((log) => yGift?.instance?.interface?.parseLog(log)?.args);
        if (giftMinted) {
          const [from, to] = giftMinted;
          const block = await provider?.[0]?.getBlock(logs[0].blockHash);
          const transaction: TransactionModel = {
            minter: from,
            recipient: to,
            date: block.timestamp,
          };
          transactions.push(transaction);
        }
      }

      //
      if (collectedEventFilter) {
        const logs = await provider?.[0]?.getLogs({ ...collectedEventFilter, fromBlock: 0 });
        const [redeemed] = logs.map((log) => yGift?.instance?.interface?.parseLog(log)?.args);
        if (redeemed) {
          const block = await provider?.[0]?.getBlock(logs[0].blockHash);
          const gift = await yGift?.instance?.getGift(tokenId);
          if (gift) {
            const transaction: TransactionModel = {
              minter: gift?.[1],
              recipient: gift?.[2],
              date: block.timestamp,
            };
            transactions.push(transaction);
          }
        }
      }
      if (tipEventFilter) {
        const logs = await provider?.[0]?.getLogs({ ...tipEventFilter, fromBlock: 0 });
        const [redeemed] = logs.map((log) => yGift?.instance?.interface?.parseLog(log)?.args);
        if (redeemed) {
          const block = await provider?.[0]?.getBlock(logs[0].blockHash);
          const gift = await yGift?.instance?.getGift(tokenId);
          if (gift) {
            const transaction: TransactionModel = {
              minter: gift?.[1],
              recipient: gift?.[2],
              date: block.timestamp,
            };
            transactions.push(transaction);
          }
        }
      }

      setTransactionHistory(transactions);
    };
    fetch();
  }, [yGift?.instance, signer, provider, tokenId]);

  return { transactionHistory };
}
