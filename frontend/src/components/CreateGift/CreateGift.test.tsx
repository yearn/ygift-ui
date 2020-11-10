import React from "react";
import { render, screen, act, cleanup } from "@testing-library/react";
import { CreateGift, params } from ".";
import { HardhatContext } from "../../hardhat/HardhatContext";

beforeEach(cleanup);

test("should render form inputs", async () => {
  const wrapper: React.FC = ({ children }) => <HardhatContext>{children}</HardhatContext>;
  act(() => {
    render(<CreateGift></CreateGift>, { wrapper });
  });

  const inputs = await Promise.all(params.map((param) => screen.findByTestId(param)));

  inputs.forEach((input) => {
    expect(input).toBeInTheDocument();
  });
  expect(await screen.getByTestId("submit")).toBeInTheDocument();
});
