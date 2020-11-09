import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import { HardhatContext } from "../../../hardhat/HardhatContext";
import { useCreateGiftFormManagement } from "./";

it("should have set accepted initial values by default", async () => {
  const wrapper: React.FC = ({ children }) => <HardhatContext>{children}</HardhatContext>;
  const { result, waitForNextUpdate } = renderHook(() => useCreateGiftFormManagement(), { wrapper });
  await waitForNextUpdate();
  expect(result.current.initialValues).toEqual(["", "", 0, "", "", "", 0]);
});

it("should be able to attempt and mint a gift", async () => {
  const wrapper: React.FC = ({ children }) => <HardhatContext>{children}</HardhatContext>;
  const { result, waitForNextUpdate } = renderHook(() => useCreateGiftFormManagement(), { wrapper });
  await waitForNextUpdate();
  expect(
    result.current.handleSubmit([
      "0xbfeceC47dD8bf5F6264A9830A9d26ef387c38A67",
      "0xbfeceC47dD8bf5F6264A9830A9d26ef387c38A67",
      0,
      "https://www.google.co.uk",
      "Gift name",
      "Gift message",
      0,
    ])
  ).resolves.toThrow();
});
