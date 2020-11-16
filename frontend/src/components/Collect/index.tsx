import React, { useContext, useEffect, useState } from "react";
import { createDataTestId } from "../../lib/create-data-testid";
import { Button, VStack, Input, FormControl, FormLabel, FormErrorMessage, Text, HStack } from "@chakra-ui/core";
import { useCollectFormManagement } from "./useCollectFormManagement";
import { useFormik } from "formik";
import { yGiftContext } from "../../hardhat/HardhatContext";
import { ethers } from "ethers";

export const componentDataTestId = createDataTestId("Collect");

export const params = ["_tokenId", "_amount"];

interface IProps {
  tokenId: string;
}

const Collect: React.FunctionComponent<IProps> = (props) => {
  const management = useCollectFormManagement(props.tokenId);
  const yGift = useContext(yGiftContext);
  const formik = useFormik(management);
  const [collectible, setCollectible] = useState("");

  useEffect(() => {
    const fetch = async () => {
      console.log(props.tokenId);
      const collectible = await yGift?.instance?.collectible(props.tokenId);
      console.log(collectible);
      if (collectible) {
        console.log(collectible.toString());
        setCollectible(collectible.toString());
      }
    };
    fetch();
  }, [yGift?.instance, props.tokenId]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <VStack spacing={2}>
        {collectible && (
          <HStack spacing={1}>
            <Text>Available to collect:</Text>
            <Text>{ethers.utils.formatEther(collectible)}</Text>
          </HStack>
        )}
        {params.map((param, index) => {
          if (param === "_tokenId") {
            return null;
          }
          return (
            <FormControl key={param} isInvalid={Boolean(formik.errors[index] && formik.touched[index])}>
              <FormLabel htmlFor={param}>{param === "_amount" ? "Amount" : ""}</FormLabel>
              <Input
                key={param}
                data-testid={param}
                id={index.toString()}
                name={index.toString()}
                onChange={formik.handleChange}
                max={
                  collectible && param === "_amount" && Number(ethers.utils.formatEther(collectible)) > 0
                    ? Number(ethers.utils.formatEther(collectible))
                    : undefined
                }
                type="number"
                value={formik.values[index]?.toString()}
              />
              <FormErrorMessage>{formik.errors[index]}</FormErrorMessage>
            </FormControl>
          );
        })}

        <Button data-testid={"submit"} type="submit" disabled={formik.isSubmitting || collectible === "0"}>
          Collect
        </Button>
      </VStack>
    </form>
  );
};

export { Collect };
