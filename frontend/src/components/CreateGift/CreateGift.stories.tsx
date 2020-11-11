import React from "react";

import { CreateGift } from ".";
import { Layout } from "../Layout";

const story = {
  component: CreateGift,
  title: "CreateGift",
};
export default story;

const Template: any = (args: any) => (
  <Layout>
    <CreateGift {...args} />
  </Layout>
);

export const Default = Template.bind({});
Default.args = {
  0: "CreateGift Name goes here",
  5: "https://ipfs.rarible.com/ipfs/QmQcHGycE8vqeNzowUd6RkJ9zLwVS7u4azoAMT6jphXdhb",
};
