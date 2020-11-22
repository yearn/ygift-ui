export const formatAddress = (currentAddress: string) =>
  `${currentAddress.slice(0, 8)}...${currentAddress.slice(currentAddress.length - 7, currentAddress.length)}`;
