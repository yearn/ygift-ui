import { BigNumber, ethers } from "ethers";
import { NextPageContext } from "next";
import { useRouter } from "next/router";
import { ViewGift } from "../../components/ViewGift";
import { INFURA_API_KEY, network, SymfoniYGift } from "../../hardhat/HardhatContext";
import yGiftDeployment from "../../hardhat/deployments/localhost/yGift.json";
import { YGiftFactory } from "../../hardhat/typechain";
import { GiftModel } from "../../components/Gifts/Gift";

function GiftPage({ gift, from, ownedBy, id }: { gift: GiftModel; from: string; ownedBy: string; id: string }) {
  return <ViewGift from={from} ownedBy={ownedBy} gift={gift} id={id}></ViewGift>;
}

async function getInitialProps(context: NextPageContext) {
  const provider = new ethers.providers.InfuraProvider(network, INFURA_API_KEY);
  const contractAddress = yGiftDeployment.receipt.contractAddress;
  const instance = YGiftFactory.connect(contractAddress, provider);
  const yGift: SymfoniYGift = {
    instance: instance,
    factory: undefined,
  };
  const giftId = String(context.query.giftId);
  let gift = await yGift.instance?.gifts(giftId);
  if (gift) {
    gift = { ...gift, token: (await provider?.resolveName(gift.token)) || gift.token, id: giftId } as any;
    const giftMintedEventFilter = yGift?.instance?.filters?.GiftMinted(
      null,
      null,
      BigNumber.from(giftId).toHexString(),
      null
    );
    const transferEventFilter = yGift?.instance?.filters?.Transfer(null, null, BigNumber.from(giftId).toHexString());
    const [giftMintedLog] = await provider?.getLogs({ ...giftMintedEventFilter, fromBlock: 0 });
    const parsedGiftMintedLog = yGift?.instance?.interface?.parseLog(giftMintedLog)?.args;
    const transferLogs = await provider?.getLogs({ ...transferEventFilter, fromBlock: 0 });
    const parsedTransferLogs = yGift?.instance?.interface?.parseLog(transferLogs[transferLogs.length - 1])?.args;
    if (parsedGiftMintedLog && parsedTransferLogs) {
      const [from] = parsedGiftMintedLog;
      const [, ownedBy] = parsedTransferLogs;
      return {
        id: giftId,
        gift,
        from: (await provider?.resolveName(from)) || from,
        ownedBy: (await provider?.resolveName(ownedBy)) || ownedBy,
      };
    }
  }
  return {};
}

GiftPage.getInitialProps = getInitialProps;

export default GiftPage;
