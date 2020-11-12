import React from "react";

import { CreateGift } from ".";
import { Submitted } from ".";
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

export const SubmittedGift = (args: any) => (
  <Layout>
    <Submitted {...args}></Submitted>
  </Layout>
);
SubmittedGift.args = {
  imageURL:
    "https://cdn.vox-cdn.com/thumbor/W-3KoS_ImZ6ZsL4zujBCknYCpcg=/0x0:1750x941/1400x1400/filters:focal(735x331:1015x611):format(png)/cdn.vox-cdn.com/uploads/chorus_image/image/53111665/Mewtwo_M01.0.0.png",
};
