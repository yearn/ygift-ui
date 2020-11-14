import React, { useCallback, useContext, useEffect, useState } from "react";
import { createDataTestId } from "../../lib/create-data-testid";
import {
  Button,
  VStack,
  Input,
  FormControl,
  FormErrorMessage,
  Box,
  HStack,
  Center,
  Image,
  Heading,
  useClipboard,
  Text,
} from "@chakra-ui/core";
import { CopyIcon } from "@chakra-ui/icons";
import { useCreateGiftFormManagement } from "./useCreateGiftFormManagement";
import { useFormik } from "formik";
import graphic from "./graphic.png";
import { ethers } from "ethers";
import { CurrentAddressContext, ProviderContext, SignerContext } from "../../hardhat/HardhatContext";

export const componentDataTestId = createDataTestId("CreateGift");

export const params = ["_to", "_token", "_amount", "_url", "_name", "_msg", "_lockedDuration"];
const yGiftContractAddress = "0x02f55d8495551a59279ea0ad0d329e04fe1ad1b3";
const erc20Abi = [
  // Some details about the token
  "function name() view returns (string)",
  "function symbol() view returns (string)",

  // Get the account balance
  "function balanceOf(address) view returns (uint)",
  "function approve(address spender, uint256 amount) returns (bool)",

  // Send some of your tokens to someone else
  "function transfer(address to, uint amount)",

  // An event triggered whenever anyone transfers to someone else
  "event Transfer(address indexed from, address indexed to, uint amount)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
];

interface IProps {
  isSubmitting?: boolean;
}

const Processing = () => (
  <svg width="88" height="88" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M44 88C35.2976 88 26.7907 85.4194 19.5549 80.5847C12.3191 75.7499 6.67955 68.878 3.3493 60.8381C0.0190407 52.7981 -0.852304 43.9512 0.84545 35.416C2.5432 26.8809 6.73379 19.0408 12.8873 12.8873C19.0408 6.73379 26.8809 2.54319 35.416 0.845445C43.9512 -0.852304 52.7981 0.0190432 60.8381 3.3493C68.878 6.67956 75.7499 12.3191 80.5847 19.5549C85.4194 26.7907 88 35.2976 88 44L77 44C77 37.4732 75.0646 31.093 71.4385 25.6662C67.8124 20.2394 62.6585 16.0097 56.6286 13.512C50.5986 11.0143 43.9634 10.3608 37.562 11.6341C31.1606 12.9074 25.2806 16.0503 20.6655 20.6655C16.0503 25.2806 12.9074 31.1606 11.6341 37.562C10.3608 43.9634 11.0143 50.5986 13.512 56.6285C16.0097 62.6585 20.2394 67.8124 25.6662 71.4385C31.093 75.0646 37.4732 77 44 77L44 88Z"
      fill="white"
    />
  </svg>
);

const Submitting: React.FC = () => (
  <Center
    {...{
      position: "absolute",
      width: "100%",
      height: "90%",
      background: "#013A6D",
      opacity: 0.9,
      borderRadius: "16px",
      zIndex: 500,
    }}
  >
    <VStack spacing={4}>
      <Heading
        {...{
          fontFamily: "Roboto",
          fontStyle: "normal",
          fontWeight: "bold",
          fontSize: "24px",
          color: "white",
        }}
      >
        Processing
      </Heading>
      <Processing></Processing>
    </VStack>
  </Center>
);

interface ISubmittedProps {
  imageURL: string;
}
export const Submitted: React.FC<ISubmittedProps> = (props) => {
  const { hasCopied, onCopy } = useClipboard(props.imageURL);
  return (
    <Center
      {...{
        background: "linear-gradient(342.98deg, #013A6D 0%, #0055AC 56.01%, #0065D0 93.35%)",
        borderRadius: "16px",
        width: "70vw",
        py: 8,
      }}
    >
      <VStack spacing={2}>
        <Heading
          as="h3"
          {...{
            fontFamily: "Roboto",
            fontStyle: "normal",
            fontWeight: "bold",
            fontSize: "24px",
            color: "white",
          }}
        >
          Your gift has been created succesfully
        </Heading>
        <Image src={props.imageURL} width="425px" height="425px"></Image>
        <HStack spacing={3}>
          <Text
            {...{
              fontFamily: "Roboto",
              fontStyle: "normal",
              fontWeight: "normal",
              fontSize: "16px",
              textOverflow: "ellipsis",
              width: "300px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              color: "white",
            }}
          >
            {props.imageURL}
          </Text>
          {hasCopied ? <Text>Copied</Text> : <CopyIcon id="add" cursor="pointer" onClick={onCopy}></CopyIcon>}
        </HStack>
        <VStack spacing={1}>
          <Text
            color="white"
            {...{
              fontFamily: "Roboto",
              fontStyle: "normal",
              fontWeight: "bold",
              fontSize: "18px",
              width: "400px",
              textAlign: "center",
            }}
          >
            Want to make this even more memorable?
          </Text>
          <Text
            {...{
              fontFamily: "Roboto",
              fontStyle: "normal",
              fontWeight: "bold",
              fontSize: "18px",
              width: "400px",
              textAlign: "center",
              color: "white",
            }}
          >
            Share the image and URL so that others can add tips in yUSD.
          </Text>
        </VStack>
      </VStack>
    </Center>
  );
};

const CreateGift: React.FunctionComponent<IProps> = (props) => {
  const management = useCreateGiftFormManagement();
  const formik = useFormik(management);
  const [provider] = useContext(ProviderContext);
  const [signer] = useContext(SignerContext);
  const [currentAddress] = useContext(CurrentAddressContext);
  // const [_to, _token, _amount, _url, _name, _msg, _lockedDuration] = formik.values;
  const _token = formik?.values["1"];
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [erc20Contract, setErc20Contract] = useState<ethers.Contract | undefined>(undefined);

  useEffect(() => {
    const fetch = async () => {
      // The Contract object
      const erc20Contract = new ethers.Contract(_token, erc20Abi, provider);
      if (signer && erc20Contract) {
        erc20Contract.connect(signer);
        setErc20Contract(erc20Contract);
        const filter = erc20Contract?.filters.Approval(currentAddress, yGiftContractAddress);
        const events = await erc20Contract.queryFilter(filter);
        console.log(events);
        setIsApproved(events?.length > 0);
      }
    };
    fetch();
  }, [_token, currentAddress, provider, signer]);

  const erc20Approve = useCallback(() => {
    const fetch = async () => {
      if (erc20Contract && signer) {
        erc20Contract.connect(signer);
        const tx = await (erc20Contract as any).approve(yGiftContractAddress, 0);
        await tx.wait();
        setIsApproved(true);
      }
    };

    fetch();
  }, [erc20Contract, signer]);

  if (management.hasSubmitted) {
    return <Submitted imageURL={formik.values?.[3]}></Submitted>;
  }
  return (
    <form onSubmit={formik.handleSubmit}>
      {(props.isSubmitting || formik.isSubmitting) && <Submitting></Submitting>}
      <HStack
        spacing={0}
        {...{
          boxShadow: "0px 0px 68px rgba(27, 39, 70, 0.15)",
          borderRadius: "16px",
          background: "linear-gradient(342.98deg, #013A6D 0%, #0055AC 56.01%, #0065D0 93.35%)",
        }}
        minWidth="60vw"
        height="100%"
      >
        <Center height={"100%"} width="50%">
          {" "}
          <VStack spacing={8} py={4}>
            <Image
              borderRadius="16px"
              height="425px"
              width="auto"
              src={formik.values?.[3]?.toString() || graphic}
            ></Image>
            {/* TODO use filestack-react image picker plugin */}
            <FormControl key={"_url"} isInvalid={Boolean(formik.errors[3] && formik.touched[3])}>
              <Input
                placeHolder="Cover image url"
                key={"_url"}
                data-testid={"_url"}
                id={"3"}
                name={"3"}
                onChange={formik.handleChange}
                type="text"
                value={formik.values[3]?.toString()}
                color="white"
                borderRadius="32px"
              />
              <FormErrorMessage>{formik.errors[3]}</FormErrorMessage>
            </FormControl>
          </VStack>
        </Center>

        <Box
          background="white"
          width="50%"
          height="100%"
          py={10}
          px={16}
          borderRadius="16px"
          borderTopLeftRadius="none"
          borderBottomLeftRadius="none"
        >
          <Center>
            <VStack spacing={4} maxWidth={"450px"}>
              <Heading
                {...{
                  fontFamily: "Roboto",
                  fontStyle: "normal",
                  fontWeight: "bold",
                  fontSize: "24px",
                  lineHeight: "126.39%",
                  color: "#013A6D",
                  alignSelf: "flex-start",
                }}
              >
                Create a new Gift
              </Heading>
              <Text
                {...{
                  fontFamily: "Roboto",
                  fontStyle: "normal",
                  fontWeight: "normal",
                  fontSize: "16px",
                  lineHeight: "137.88%",
                  color: "#809EBD",
                  alignSelf: "flex-start",
                }}
              >
                Add artwork, a special message, and yUSD if you like.
              </Text>
              {params.map((param, index) => {
                if (param === "_url") {
                  return null;
                }

                return (
                  <FormControl
                    key={param}
                    isInvalid={Boolean(formik.errors[index] && formik.touched[index])}
                    background="#ECF4FA"
                    borderRadius="24px"
                  >
                    <Input
                      placeholder={param}
                      key={param}
                      data-testid={param}
                      id={index.toString()}
                      name={index.toString()}
                      onChange={formik.handleChange}
                      type={param === "_lockedDuration" || param === "_amount" ? "number" : "text"}
                      value={formik.values[index]?.toString()}
                      color="#013A6D"
                      {...{
                        fontFamily: "Roboto",
                        fontStyle: "normal",
                        fontWeight: "normal",
                        fontSize: "16px",
                      }}
                    />
                    <FormErrorMessage>{formik.errors[index]}</FormErrorMessage>
                  </FormControl>
                );
              })}
              <Button
                data-testid={"submit"}
                type={isApproved ? "submit" : "button"}
                onClick={() => {
                  !isApproved && erc20Approve();
                }}
                variant="outline"
                background="#0065D0"
                borderRadius="32px"
                width={"100%"}
                color="white"
                {...{
                  fontFamily: "Roboto",
                  fontStyle: "normal",
                  fontWeight: "normal",
                  fontSize: "16px",
                  lineHeight: "137.88%",
                }}
              >
                {isApproved ? "Submit" : "Approve"}
              </Button>
            </VStack>
          </Center>
        </Box>
      </HStack>
    </form>
  );
};

export { CreateGift };
