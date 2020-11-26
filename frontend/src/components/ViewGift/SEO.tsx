import React from "react";
import { createDataTestId } from "../../lib/create-data-testid";
import Helmet from "react-helmet";
import { Flex, Stack, Text, Button } from "@chakra-ui/react";
import { GiftModel } from "../Gifts/Gift";

export const componentDataTestId = createDataTestId("SEO");

export const dataTestIds = {};

interface IProps {
  gift: GiftModel;
}

const SEO: React.FunctionComponent<IProps> = ({ gift }) => (
  <Helmet>
    {/* <!-- HTML Meta Tags --> */}
    <meta content={gift?.url} />

    {/* <!-- Facebook Meta Tags --> */}
    <meta property="og:url" content={`https://ygift.to/gift/${gift?.id}`} />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="yGift" />
    <meta property="og:description" content="NFTs for gifts, grants, and gratitude" />
    <meta property="og:image" content={gift?.url} />

    {/* <!-- Twitter Meta Tags --> */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="yGift" />
    <meta name="twitter:description" content="NFTs for gifts, grants, and gratitude" />
    <meta name="twitter:image" content={gift?.url} />
  </Helmet>
);

export { SEO };
