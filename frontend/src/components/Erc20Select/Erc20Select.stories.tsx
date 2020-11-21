import React from "react";

import { Erc20Select } from ".";
import { Layout } from "../Layout";

const story = {
  component: Erc20Select,
  title: "Erc20Select",
};
export default story;

const Template: any = (args: any) => (
  <Layout>
    <Erc20Select {...args} />
  </Layout>
);

export const Default = Template.bind({});
Default.args = {};
