import React from "react";
import { render, screen } from "@testing-library/react";
import { CreateGift, dataTestIds } from ".";

test("should render hello", async () => {
  render(<CreateGift></CreateGift>);
  const hello = await screen.findByTestId(dataTestIds.hello);
  expect(hello).toBeInTheDocument();
});
