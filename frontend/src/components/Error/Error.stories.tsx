import React from "react";

import { Error } from ".";
import { Layout } from "../Layout";

const story = {
  component: Error,
  title: "Error",
};
export default story;

const Template: any = (args: any) => (
  <Layout>
    <Error {...args} />
  </Layout>
);

export const Default = Template.bind({});
Default.args = {};
