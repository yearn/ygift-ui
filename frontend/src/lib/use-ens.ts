import { useContext, useEffect, useState } from "react";
import { CurrentAddressContext, ProviderContext } from "../hardhat/HardhatContext";
import { formatAddress } from "./format-address";

export const useEns = (lookupAddress?: string, format: boolean = false) => {
  const [currentAddress] = useContext(CurrentAddressContext);
  const [provider] = useContext(ProviderContext);
  const [ensName, setEnsName] = useState<string | undefined>(undefined);
  // resolveENS
  useEffect(() => {
    const fetch = async () => {
      if (lookupAddress) {
        const ensName = await provider?.lookupAddress(lookupAddress);
        if (ensName) {
          setEnsName(ensName);
        } else {
          setEnsName(format ? formatAddress(lookupAddress) : lookupAddress);
          console.log(ensName);
        }
      } else if (currentAddress) {
        const ensName = await provider?.lookupAddress(currentAddress);
        if (ensName) {
          setEnsName(ensName);
        } else {
          const formattedAddress = formatAddress(currentAddress);
          setEnsName(formattedAddress);
        }
      }
    };
    fetch();
  }, [currentAddress, provider, lookupAddress]);

  return {
    ensName,
  };
};
