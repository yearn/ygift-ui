import React from "react";

import { ViewGift } from "./";

const story = {
  component: ViewGift,
  title: "ViewGift",
};
export default story;

const Template: any = (args: any) => <ViewGift {...args} />;

export const Default = Template.bind({});
Default.args = {
  gift: {
    0: "ViewGift Name goes here",
    1: "0x89205A3A3b2A601ED13B2108B2c43e7",
    2: "0x89205A3A3b2A601ED13B2108B2c43e7",
    4: "420.690",
    5: "https://ipfs.rarible.com/ipfs/QmQcHGycE8vqeNzowUd6RkJ9zLwVS7u4azoAMT6jphXdhb",
    message: "Thank you for your contribution. Here some tips",
  },
  history: [{}],
};

export const ViewNoGift = Template.bind({});
ViewNoGift.args = {
  Viewgift: [],
};
