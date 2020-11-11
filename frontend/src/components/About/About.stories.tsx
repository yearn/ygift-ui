import React from "react";

import { About } from ".";
import { Layout } from "../Layout";

const story = {
  component: About,
  title: "About",
};
export default story;

const Template: any = (args: any) => (
  <Layout>
    <About {...args} />
  </Layout>
);

export const Default = Template.bind({});
Default.args = {};
