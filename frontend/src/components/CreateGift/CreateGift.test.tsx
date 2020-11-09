import React from "react";
import { render, screen, act } from "@testing-library/react";
import { CreateGift, dataTestIds } from ".";
import { HardhatContext } from "../../hardhat/HardhatContext";

test("should render hello", async () => {
  const wrapper: React.FC = ({ children }) => <HardhatContext>{children}</HardhatContext>;
  act(() => {
    render(<CreateGift></CreateGift>, { wrapper });
  });

  await act(async () => {
    const hello = await screen.findByTestId(dataTestIds.hello);
    expect(hello).toBeInTheDocument();
  });
});
