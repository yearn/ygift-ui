import React from "react";

import { Gift } from ".";

const story = {
  component: Gift,
  title: "Gift",
};
export default story;

const Template: any = (args: any) => <Gift {...args} />;

export const Default = Template.bind({});
Default.args = {
  0: "Gift Name goes here",
  5: "https://ipfs.rarible.com/ipfs/QmQcHGycE8vqeNzowUd6RkJ9zLwVS7u4azoAMT6jphXdhb",
};

export const ETH = Template.bind({});
ETH.args = {
  ...Default.args,
  4: "420.690",
  5: "https://ipfs.rarible.com/ipfs/QmQcHGycE8vqeNzowUd6RkJ9zLwVS7u4azoAMT6jphXdhb",
};

export const Message = Template.bind({});
Message.args = {
  ...Default.args,
  4: "420.690",
  5: "https://ipfs.rarible.com/ipfs/QmQcHGycE8vqeNzowUd6RkJ9zLwVS7u4azoAMT6jphXdhb",
  message: "Thank you for your contribution. Here some tips",
};
