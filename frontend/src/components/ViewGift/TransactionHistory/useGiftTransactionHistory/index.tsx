import { useContext, useEffect, useState } from "react";
import { ProviderContext, SignerContext, yGiftContext } from "../../../../hardhat/HardhatContext";
import { TransactionModel } from "../";
import { BigNumber, ethers } from "ethers";

export function useGiftTransactionHistory(id: string) {
  const yGift = useContext(yGiftContext);
  const signer = useContext(SignerContext);
  const [provider] = useContext(ProviderContext);
  const [transactionHistory, setTransactionHistory] = useState<TransactionModel[]>([]);

  useEffect(() => {
    const fetch = async () => {
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
      const transferEventFilter = yGift?.instance?.filters?.Transfer(null, null, BigNumber.from(id).toHexString());

      const transactions: TransactionModel[] = [];
      let minter,
        recipient = "";

      if (giftMintedSentEventFilter) {
        const logs = await provider?.getLogs({ ...giftMintedSentEventFilter, fromBlock: 0 });
        const [giftMinted] = logs.map((log) => yGift?.instance?.interface?.parseLog(log)?.args);
        const gift = await yGift?.instance?.gifts(id);
        if (giftMinted) {
          const [mintedFrom, mintedFor] = giftMinted;
          minter = (await provider?.resolveName(mintedFrom)) || mintedFrom;
          recipient = (await provider?.resolveName(mintedFor)) || mintedFor;

          const block = await provider?.getBlock(logs[0].blockHash);
          const transaction: TransactionModel = {
            minter,
            recipient,
            date: block.timestamp,
            event: "Minted",
            amount: gift?.amount,
          };
          transactions.push(transaction);
        }
      }

      //
      if (collectedEventFilter) {
        const logs = await provider?.getLogs({ ...collectedEventFilter, fromBlock: 0 });
        const collected = logs.map((log) => yGift?.instance?.interface?.parseLog(log)?.args);
        if (collected.length > 0) {
          const gift = await yGift?.instance?.gifts(id);
          if (gift) {
            const blocks = await Promise.all(logs.map((log) => provider?.getBlock(log.blockHash)));
            blocks.forEach(async (block, index) => {
              console.log(collected);
              const collectedMinter = (await provider?.resolveName(collected?.[index]?.[0])) || collected?.[index]?.[0];

              const transaction: TransactionModel = {
                minter: collectedMinter,
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
        const logs = await provider?.getLogs({ ...tipEventFilter, fromBlock: 0 });
        const tipped = logs.map((log) => yGift?.instance?.interface?.parseLog(log)?.args);
        if (tipped.length > 1) {
          const gift = await yGift?.instance?.gifts(id);
          if (gift) {
            const blocks = await Promise.all(logs.map((log) => provider?.getBlock(log.blockHash)));
            blocks.forEach(async (block, index) => {
              if (index === 0) {
                return;
              } else {
                const tippedMinter = (await provider?.resolveName(tipped?.[index]?.[0])) || tipped?.[index]?.[0];

                const transaction: TransactionModel = {
                  minter: tippedMinter,
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

      if (transferEventFilter) {
        const logs = await provider?.getLogs({ ...transferEventFilter, fromBlock: 0 });
        const transferred = logs.map((log) => yGift?.instance?.interface?.parseLog(log)?.args);
        if (transferred.length > 1) {
          const gift = await yGift?.instance?.gifts(id);
          if (gift) {
            const blocks = await Promise.all(logs.map((log) => provider?.getBlock(log.blockHash)));
            blocks.forEach(async (block, index) => {
              if (index === 0) {
                return;
              } else {
                const transferMinter =
                  (await provider?.resolveName(transferred?.[index]?.[0])) || transferred?.[index]?.[0];
                const transferRecipient =
                  (await provider?.resolveName(transferred?.[index]?.[1])) || transferred?.[index]?.[1];

                const transaction: TransactionModel = {
                  minter: transferMinter,
                  recipient: transferRecipient,
                  date: block.timestamp,
                  event: "Transferred",
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
