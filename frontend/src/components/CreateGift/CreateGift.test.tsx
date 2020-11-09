import React from "react";
import { render, screen, act, cleanup } from "@testing-library/react";
import { CreateGift, dataTestIds } from ".";
import { HardhatContext } from "../../hardhat/HardhatContext";

beforeEach(cleanup);

test("should render form inputs", async () => {
  const wrapper: React.FC = ({ children }) => <HardhatContext>{children}</HardhatContext>;
  act(() => {
    render(<CreateGift></CreateGift>, { wrapper });
  });

  const { _to, _amount, _token } = dataTestIds;
  const inputs = await Promise.all([_to, _token, _amount].map((input) => screen.findByTestId(input)));

  expect(inputs[0]).toBeInTheDocument();
  expect(inputs[1]).toBeInTheDocument();
  expect(inputs[2]).toBeInTheDocument();
});
