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
      console.log(BigNumber.from(id).toHexString());
      const giftMintedSentEventFilter = yGift?.instance?.filters?.GiftMinted(
        null,
        null,
        BigNumber.from(id).toHexString(),
        null
      );
      const giftMintedOwnedEventFilter = yGift?.instance?.filters?.GiftMinted(
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
          const [mintedFrom, mintedTo] = giftMinted;
          minter = mintedFrom;
          recipient = mintedTo;
          const block = await provider?.[0]?.getBlock(logs[0].blockHash);
          const transaction: TransactionModel = {
            minter,
            recipient,
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
          const block = await provider?.[0]?.getBlock(logs[0].blockHash);
          const transaction: TransactionModel = {
            minter,
            recipient,
            date: block.timestamp,
          };
          transactions.push(transaction);
        }
      }

      //
      if (collectedEventFilter) {
        const logs = await provider?.[0]?.getLogs({ ...collectedEventFilter, fromBlock: 0 });
        const [collected] = logs.map((log) => yGift?.instance?.interface?.parseLog(log)?.args);
        if (collected) {
          const block = await provider?.[0]?.getBlock(logs[0].blockHash);
          const gift = await yGift?.instance?.gifts(id);
          if (gift) {
            const transaction: TransactionModel = {
              minter,
              recipient,
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
          const gift = await yGift?.instance?.gifts(id);
          if (gift) {
            const transaction: TransactionModel = {
              minter,
              recipient,
              date: block.timestamp,
            };
            transactions.push(transaction);
          }
        }
      }

      setTransactionHistory(transactions);
    };
    fetch();
  }, [yGift?.instance, signer, provider, id]);

  return { transactionHistory };
}
