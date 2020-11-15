import { useContext, useEffect, useState } from "react";
import { ProviderContext, SignerContext, yGiftContext } from "../../../../hardhat/HardhatContext";
import { TransactionModel } from "../";
import { BigNumber, ethers } from "ethers";

export function useGiftTransactionHistory(id: string) {
  const yGift = useContext(yGiftContext);
  const signer = useContext(SignerContext);
  const provider = useContext(ProviderContext);
  const [transactionHistory, setTransactionHistory] = useState<TransactionModel[]>([]);

  useEffect(() => {
    const fetch = async () => {
      // const address = await signer?.[0]?.getAddress();
      // console.log(BigNumber.from(id).toHexString());
      const giftMintedSentEventFilter = yGift?.instance?.filters?.GiftMinted(
        null,
        null,
        BigNumber.from(id).toHexString(),
        null
      );
      const collectedEventFilter = yGift?.instance?.filters?.Collected(
        null,
        BigNumber.from(id).toHexString(),
        null,
        null
      );
      const tipEventFilter = yGift?.instance?.filters?.Tip(null, BigNumber.from(id).toHexString(), null, null, null);

      const transactions: TransactionModel[] = [];
      let minter,
        recipient = "";

      if (giftMintedSentEventFilter) {
        const logs = await provider?.[0]?.getLogs({ ...giftMintedSentEventFilter, fromBlock: 0 });
        const [giftMinted] = logs.map((log) => yGift?.instance?.interface?.parseLog(log)?.args);
        if (giftMinted) {
          const [mintedFrom, mintedFor] = giftMinted;
          minter = mintedFrom;
          recipient = mintedFor;
          const block = await provider?.[0]?.getBlock(logs[0].blockHash);
          const transaction: TransactionModel = {
            minter,
            recipient,
            date: block.timestamp,
            event: "Minted",
          };
          transactions.push(transaction);
        }
      }

      //
      if (collectedEventFilter) {
        const logs = await provider?.[0]?.getLogs({ ...collectedEventFilter, fromBlock: 0 });
        const collected = logs.map((log) => yGift?.instance?.interface?.parseLog(log)?.args);
        if (collected.length > 0) {
          const gift = await yGift?.instance?.gifts(id);
          if (gift) {
            const blocks = await Promise.all(logs.map((log) => provider?.[0]?.getBlock(log.blockHash)));
            blocks.forEach((block, index) => {
              console.log(collected);
              const transaction: TransactionModel = {
                minter: collected?.[0]?.[0],
                recipient,
                date: block.timestamp,
                event: "Collected",
                amount: collected?.[index]?.amount,
              };
              transactions.push(transaction);
            });
          }
        }
      }
      if (tipEventFilter) {
        const logs = await provider?.[0]?.getLogs({ ...tipEventFilter, fromBlock: 0 });
        const tipped = logs.map((log) => yGift?.instance?.interface?.parseLog(log)?.args);
        if (tipped.length > 1) {
          const gift = await yGift?.instance?.gifts(id);
          if (gift) {
            const blocks = await Promise.all(logs.map((log) => provider?.[0]?.getBlock(log.blockHash)));
            blocks.forEach((block, index) => {
              if (index === 0) {
                return;
              } else {
                const transaction: TransactionModel = {
                  minter: tipped?.[0]?.[0],
                  recipient,
                  date: block.timestamp,
                  event: "Tipped",
                  message: tipped?.[index]?.message,
                  amount: tipped?.[index]?.amount,
                };
                transactions.push(transaction);
              }
            });
          }
        }
      }

      const sortedTransactions = transactions.sort((a, b) => a.date - b.date);
      setTransactionHistory(sortedTransactions);
    };
    fetch();
  }, [yGift?.instance, signer, provider, id]);

  return { transactionHistory };
}
