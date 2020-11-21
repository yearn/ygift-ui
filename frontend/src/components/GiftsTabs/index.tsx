import React from "react";
import { createDataTestId } from "../../lib/create-data-testid";
import { Tabs, TabList, Tab, TabPanels, TabPanel, Heading } from "@chakra-ui/react";
import { Gifts } from "../Gifts";
import { useGifts } from "./useGifts";

export const componentDataTestId = createDataTestId("GiftsTabs");

export const dataTestIds = {};

interface IProps {}

const GiftsTabs: React.FunctionComponent<IProps> = (props) => {
  const { giftsOwned, giftsSent } = useGifts();
  return (
    <Tabs align="center" variant="enclosed" alignSelf="flex-start">
      <TabList borderBottom="none">
        <Tab
          _selected={{
            // @ts-ignore
            "> *": { color: "#013A6D" },
          }}
        >
          <Heading
            color={`#809EBD`}
            as="h4"
            fontFamily="Roboto"
            fontSize="16px"
            fontWeight="700"
            textDecoration="underline"
          >
            Gifts owned
          </Heading>
        </Tab>
        <Tab
          _selected={{
            // @ts-ignore
            "> *": { color: "#013A6D" },
          }}
        >
          {" "}
          <Heading
            color={`#809EBD`}
            as="h4"
            fontFamily="Roboto"
            fontSize="16px"
            fontWeight="700"
            textDecoration="underline"
          >
            Gifts sent
          </Heading>
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Gifts gifts={giftsOwned as any}></Gifts>
        </TabPanel>
        <TabPanel>
          <Gifts gifts={giftsSent as any}></Gifts>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export { GiftsTabs };
