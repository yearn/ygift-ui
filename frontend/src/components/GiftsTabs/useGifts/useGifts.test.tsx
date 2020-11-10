import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import { useGifts } from ".";
import { HardhatContext } from "../../../hardhat/HardhatContext";

it("should have gifts owned", async () => {
  const wrapper: React.FC = ({ children }) => <HardhatContext>{children}</HardhatContext>;
  const { result, waitForNextUpdate } = renderHook(() => useGifts(), { wrapper });
  await waitForNextUpdate();
  expect(result.current.giftsOwned).toEqual([]);
});
it("should have gifts sent", async () => {
  const wrapper: React.FC = ({ children }) => <HardhatContext>{children}</HardhatContext>;
  const { result, waitForNextUpdate } = renderHook(() => useGifts(), { wrapper });
  await waitForNextUpdate();
  expect(result.current.giftsSent).toEqual([]);
});
