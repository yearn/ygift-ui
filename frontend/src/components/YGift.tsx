import React, { useContext, useEffect, useState } from "react";
import { SignerContext, yGiftContext } from "../hardhat/HardhatContext";

interface Props {}

export const YGift: React.FC<Props> = () => {
  const yGift = useContext(yGiftContext);
  const [signer] = useContext(SignerContext);
  const [message, setMessage] = useState("");
  const [inputGreeting, setInputGreeting] = useState("");
  useEffect(() => {
    const doAsync = async () => {
      if (!yGift.instance) return;
      if (!signer?._isSigner) return;
      console.log("Greeter is deployed at ", yGift.instance.address);
      const address = await signer?.getAddress();
      console.log("Address: ", address);
      const message = await (await yGift.instance.balanceOf(address)).toString();
      setMessage(message);
    };
    doAsync();
  }, [yGift]);

  const handleSetGreeting = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (!yGift.instance) throw Error("Greeter instance not ready");
    if (yGift.instance) {
      const tx = await yGift.instance.approve(inputGreeting, inputGreeting);
      console.log("setGreeting tx", tx);
      await tx.wait();
    }
  };
  return (
    <div>
      <p>{message}</p>
      <input onChange={(e) => setInputGreeting(e.target.value)}></input>
      <button onClick={(e) => handleSetGreeting(e)}>Set greeting</button>
    </div>
  );
};
