import React from "react";

import { Erc20Select } from ".";

const story = {
  component: Erc20Select,
  title: "Erc20Select",
};
export default story;

const Template: any = (args: any) => <Erc20Select {...args} />;

export const Default = Template.bind({});
Default.args = {};
