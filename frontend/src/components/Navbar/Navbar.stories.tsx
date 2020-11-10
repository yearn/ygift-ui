import React from "react";

import { Navbar } from ".";

const story = {
  component: Navbar,
  title: "Navbar",
};
export default story;

const Template: any = (args: any) => <Navbar {...args} />;

export const Default = Template.bind({});
Default.args = {};
