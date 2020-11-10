import React from "react";
import { render, screen, act, cleanup } from "@testing-library/react";
import { CreateGift, params } from ".";
import { HardhatContext } from "../../hardhat/HardhatContext";

it("should render form inputs", async () => {
  const wrapper: React.FC = ({ children }) => <HardhatContext>{children}</HardhatContext>;
  render(<CreateGift></CreateGift>, { wrapper });

  const ids = params.map((param) => screen.findByTestId(param));
  const inputs = await Promise.all(ids);

  inputs.forEach((input) => {
    expect(input).toBeInTheDocument();
  });
  const submit = await screen.getByTestId("submit");
  expect(submit).toBeInTheDocument();
});
