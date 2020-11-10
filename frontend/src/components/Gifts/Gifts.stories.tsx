import React from "react";

import { Gifts } from "./";

const story = {
  component: Gifts,
  title: "Gifts",
};
export default story;

const Template: any = (args: any) => <Gifts {...args} />;

export const Default = Template.bind({});
Default.args = {
  gifts: [
    {
      0: "Gift Name goes here",
      5: "https://ipfs.rarible.com/ipfs/QmQcHGycE8vqeNzowUd6RkJ9zLwVS7u4azoAMT6jphXdhb",
    },
    {
      0: "Gift Name goes here",
      4: "420.690",
      5: "https://ipfs.rarible.com/ipfs/QmQcHGycE8vqeNzowUd6RkJ9zLwVS7u4azoAMT6jphXdhb",
    },
    {
      0: "Gift Name goes here",
      4: "420.690",
      5: "https://ipfs.rarible.com/ipfs/QmQcHGycE8vqeNzowUd6RkJ9zLwVS7u4azoAMT6jphXdhb",
      message: "Thank you for your contribution. Here some tips",
    },
    {
      0: "Gift Name goes here",
      5: "https://ipfs.rarible.com/ipfs/QmQcHGycE8vqeNzowUd6RkJ9zLwVS7u4azoAMT6jphXdhb",
    },
    {
      0: "Gift Name goes here",
      4: "420.690",
      5: "https://ipfs.rarible.com/ipfs/QmQcHGycE8vqeNzowUd6RkJ9zLwVS7u4azoAMT6jphXdhb",
    },
    {
      0: "Gift Name goes here",
      4: "420.690",
      5: "https://ipfs.rarible.com/ipfs/QmQcHGycE8vqeNzowUd6RkJ9zLwVS7u4azoAMT6jphXdhb",
      message: "Thank you for your contribution. Here some tips",
    },
  ],
};

export const NoGifts = Template.bind({});
NoGifts.args = {
  gifts: [],
};
