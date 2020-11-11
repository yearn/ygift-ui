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
Default.args = {};

export const Submitting = Template.bind({});
Submitting.args = {
  isSubmitting: true,
};
