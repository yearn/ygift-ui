import React from "react";

import { GiftsTabs } from ".";

const story = {
  component: GiftsTabs,
  title: "GiftsTabs",
};
export default story;

const Template: any = (args: any) => <GiftsTabs {...args} />;

export const Default = Template.bind({});
Default.args = {};
