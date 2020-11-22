import React, { useCallback, useContext, useEffect, useState } from "react";
import { createDataTestId } from "../../lib/create-data-testid";
import ipfsClient from "ipfs-http-client";
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
  FormLabel,
} from "@chakra-ui/react";
import { CloseIcon, CopyIcon, SmallCloseIcon, SpinnerIcon } from "@chakra-ui/icons";
import { useCreateGiftFormManagement } from "./useCreateGiftFormManagement";
import { useFormik } from "formik";
import graphic from "./graphic.png";
import { BigNumber, ethers } from "ethers";
import { CurrentAddressContext, ProviderContext, SignerContext } from "../../hardhat/HardhatContext";
import yGiftDeployment from "../../hardhat/deployments/localhost/yGift.json";
import DeleteIcon from "./delete-icon.png";
import { YGift } from "../../hardhat/typechain/YGift";
// /src/hardhat/deployments/localhost/yGift.json

export const componentDataTestId = createDataTestId("CreateGift");

export const params = ["_to", "_token", "_amount", "_name", "_msg", "_url", "_start", "_duration"] as const;
export const yGiftContractAddress = yGiftDeployment.receipt.contractAddress;
export const erc20Abi = [
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
      width: "60vw",
      height: "100%",
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
  url: string;
  id: string;
}
export const Submitted: React.FC<ISubmittedProps> = (props) => {
  const { hasCopied, onCopy } = useClipboard(props.url);
  const giftIdUrl = `${window.location.href.replace("/create-gift", `/gift/${props.id}`)}`;
  const { hasCopied: hasIdCopied, onCopy: onIdCopy } = useClipboard(giftIdUrl);
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
        <Image src={props.url} width="425px" height="auto"></Image>
        <HStack spacing={3}>
          <Text
            {...{
              fontFamily: "Roboto",
              fontStyle: "normal",
              fontWeight: "normal",
              fontSize: "16px",
              textOverflow: "ellipsis",
              width: "290px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              color: "white",
            }}
          >
            {props.url}
          </Text>
          {hasCopied ? <Text>Copied</Text> : <CopyIcon id="add" cursor="pointer" onClick={onCopy}></CopyIcon>}
        </HStack>
        <HStack spacing={3}>
          <Text
            {...{
              fontFamily: "Roboto",
              fontStyle: "normal",
              fontWeight: "normal",
              fontSize: "16px",
              textOverflow: "ellipsis",
              width: "290px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              color: "white",
            }}
          >
            {giftIdUrl}
          </Text>
          {hasIdCopied ? <Text>Copied</Text> : <CopyIcon id="add" cursor="pointer" onClick={onIdCopy}></CopyIcon>}
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

export type ValuesOf<T extends readonly any[]> = T[number];

const getPlaceholder = (param: ValuesOf<typeof params>) => {
  switch (param) {
    case "_to": {
      return "To (ETH or ENS address)";
    }
    case "_name": {
      return "Gift Name";
    }
    case "_msg": {
      return "Message";
    }
    case "_amount": {
      return "Gift Amount";
    }
    case "_token": {
      return "Token (Contract or ENS) address";
    }
    case "_duration": {
      return "Vesting duration in days - (0 is instant)";
    }
    default: {
      return param;
    }
  }
};

const CreateGift: React.FunctionComponent<IProps> = (props) => {
  const management = useCreateGiftFormManagement();
  const formik = useFormik(management);
  const [provider] = useContext(ProviderContext);
  const [signer] = useContext(SignerContext);
  const [currentAddress] = useContext(CurrentAddressContext);
  const _token = String(formik?.values[Number(params.indexOf("_token"))]);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [maxAmount, setMaxAmount] = useState<number>(0);
  const [erc20Contract, setErc20Contract] = useState<ethers.Contract | undefined>(undefined);
  const [isUploadingCoverImageUrl, setIsUploadingImage] = useState<boolean>(false);
  const [uploadedCoverImageUrls, setUploadedCoverImageUrls] = useState<string[]>([]);

  useEffect(() => {
    const fetch = async () => {
      // The Contract object
      if (_token === "") {
        setMaxAmount(0);
      }
      // Resolve ens for _token
      const resolvedToken = (_token.length > 3 && (await provider?.resolveName(_token))) || _token;
      if (!ethers.utils.isAddress(resolvedToken)) {
        return;
      }
      if (signer && _token) {
        console.log(_token);
        const erc20Contract = new ethers.Contract(resolvedToken, erc20Abi, provider).connect(signer);
        setErc20Contract(erc20Contract);

        const filter = erc20Contract?.filters.Approval(currentAddress, yGiftContractAddress);
        const events = await erc20Contract.queryFilter(filter);
        console.log(events);
        setIsApproved(events?.length > 0);

        if (events?.length > 0) {
          const balance = await erc20Contract.balanceOf(currentAddress);
          console.log(balance?.toString());
          console.log(ethers.utils.formatEther(balance));
          setMaxAmount(balance);
        }
      }
    };
    fetch();
  }, [_token, currentAddress, provider, signer]);

  const erc20Approve = useCallback(() => {
    const fetch = async () => {
      if (erc20Contract && signer) {
        erc20Contract.connect(signer);
        const tx = (erc20Contract as any).approve(yGiftContractAddress, BigNumber.from(2).pow(256).sub(1));
        const approveTx = await tx;
        await approveTx?.wait();
        setIsApproved(true);
      }
    };

    fetch();
  }, [erc20Contract, signer]);

  async function saveToIpfs(files: FileList) {
    if (files) {
      const ipfs = ipfsClient({ url: "https://ipfs.infura.io:5001" });
      setIsUploadingImage(true);
      ipfs
        .add([...(files as any)], {
          progress: (prog: any) => console.log(`received: ${prog}`),
        })
        .then((file) => {
          console.log(file);
          const ipfsHash = file.path;
          const ipfsGateway = "https://cloudflare-ipfs.com/ipfs/";
          console.log(uploadedCoverImageUrls.concat(ipfsGateway + ipfsHash));
          const newUploadedCoverImageUrls = uploadedCoverImageUrls.concat(ipfsGateway + ipfsHash);
          formik.setFieldValue(String(params.indexOf("_url")), ipfsGateway + ipfsHash);
          setIsUploadingImage(false);
          setUploadedCoverImageUrls(newUploadedCoverImageUrls);
        })
        .catch((err) => {
          console.error(err);
        });
      // try {
      //   for (const file of await source) {
      //     console.log(file);
      //   }
      // } catch (err) {
      //   console.error(err);
      // }
    }
  }

  if (management.hasSubmitted) {
    return <Submitted id={management.giftCreatedId} url={formik.values?.["5"]}></Submitted>;
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
        width="1200px"
        height="700px"
      >
        <Center height={"100%"} width="50%">
          {" "}
          <VStack spacing={0} py={"36px"} height={"100%"}>
            <Box position="relative">
              <Image
                borderRadius="16px"
                height={(formik.values?.[Number(params.indexOf("_url"))] && "auto") || "463px"}
                maxWidth={(formik.values?.[Number(params.indexOf("_url"))] && "424px") || "304px"}
                src={formik.values?.[Number(params.indexOf("_url"))]?.toString() || graphic}
                mb={"18px"}
              ></Image>
              {formik.values?.[Number(params.indexOf("_url"))] && (
                <Box
                  {...{
                    position: "absolute",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "40px",
                    height: "40px",
                    right: "8px",
                    top: "8px",
                    // background: "#FFFFFF",
                    background: "rgba(255, 255, 255, 0.3)",
                    borderRadius: "32px",
                  }}
                  cursor="pointer"
                  onClick={() => {
                    const uploadedCoverImageUrlsWithLastRemoved = uploadedCoverImageUrls.slice(
                      0,
                      uploadedCoverImageUrls.length - 1
                    );
                    console.log(uploadedCoverImageUrls);
                    console.log(
                      uploadedCoverImageUrlsWithLastRemoved[uploadedCoverImageUrlsWithLastRemoved.length - 1]
                    );
                    formik.setFieldValue(
                      String(params.indexOf("_url")),
                      uploadedCoverImageUrlsWithLastRemoved.length
                        ? uploadedCoverImageUrlsWithLastRemoved[uploadedCoverImageUrlsWithLastRemoved.length - 1]
                        : ""
                    );
                    setUploadedCoverImageUrls(uploadedCoverImageUrlsWithLastRemoved);
                  }}
                >
                  <CloseIcon height="12px" width="12px"></CloseIcon>
                </Box>
              )}
            </Box>
            <FormControl
              borderRadius="24px"
              key={"_url"}
              isInvalid={Boolean(formik.errors[3] && formik.touched[3])}
              mt={(formik.values?.[Number(params.indexOf("_url"))] && "auto !important") || "inherit"}
            >
              <Input
                height={"56px"}
                width={"424px"}
                placeholder="Cover image URL"
                key={"_url"}
                data-testid={"_url"}
                id={String(params.indexOf("_url"))}
                name={String(params.indexOf("_url"))}
                onChange={formik.handleChange}
                type="text"
                value={formik.values[Number(params.indexOf("_url"))]?.toString()}
                borderRadius={"32px"}
                border="none"
                color="#A1C5E2"
                bg="#336da6"
                {...{
                  fontFamily: "Roboto",
                  fontStyle: "normal",
                  fontWeight: "normal",
                  fontSize: "16px",
                  lineHeight: "137.88%",
                }}
                mb={"32px"}
              />
              <FormErrorMessage>{formik.errors[Number(params.indexOf("_url"))]}</FormErrorMessage>
            </FormControl>

            <FormLabel
              display="inline-block"
              cursor="pointer"
              {...{
                fontFamily: "Roboto",
                fontStyle: "normal",
                fontWeight: "normal",
                fontSize: "16px",
                lineHeight: "137.88%",
              }}
              color="white"
              borderRadius="32px"
              border="1px solid white"
              textAlign="center"
              height={"56px"}
              width={"424px"}
              m={0}
              px={5}
              py={"17px"}
            >
              {isUploadingCoverImageUrl ? <SpinnerIcon /> : "Choose Image"}
              <Input
                onChange={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                  if (event.target.files) {
                    saveToIpfs(event.target.files);
                  }
                }}
                display="none"
                type="file"
              ></Input>
            </FormLabel>
          </VStack>
        </Center>

        <Center
          background="white"
          width="50%"
          height="100%"
          px={20}
          borderRadius="16px"
          borderTopLeftRadius="none"
          borderBottomLeftRadius="none"
        >
          <VStack spacing={"24px"} width={"420px"}>
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
              mt={`0px !important`}
              mb={"8px"}
            >
              Create a new gift
            </Heading>
            <Text
              {...{
                fontFamily: "Roboto",
                fontStyle: "normal",
                fontWeight: "normal",
                fontSize: "16px",
                lineHeight: "137.88%",
                color: "#809EBD",
                textAlign: "left",
                alignSelf: "flex-start",
              }}
              mt={`0px !important`}
              mb={"32px"}
            >
              Add artwork, a special message, and yUSD if you like.
            </Text>
            {params.map((param, index) => {
              if (param === "_url") {
                return null;
              }
              if (param === "_start") {
                return null;
              }

              return (
                <FormControl
                  key={param}
                  isInvalid={Boolean(formik.errors[index] && formik.touched[index])}
                  background="#ECF4FA"
                  borderRadius="24px"
                  mt={index === 0 ? `0px !important` : "inherit"}
                >
                  {maxAmount && param === "_amount" ? (
                    <FormLabel textAlign="center" for="_amount">
                      {`Max: ${Math.floor(Number(ethers.utils.formatEther(maxAmount)) * 100) / 100}`}
                    </FormLabel>
                  ) : null}
                  <Input
                    required={true}
                    placeholder={getPlaceholder(param)}
                    key={param}
                    data-testid={param}
                    id={index.toString()}
                    name={index.toString()}
                    onChange={formik.handleChange}
                    type={param === "_duration" || param === "_amount" ? "number" : "text"}
                    max={param === "_amount" ? ethers.utils.formatEther(maxAmount) : undefined}
                    min={param === "_amount" ? "0" : undefined}
                    step={param === "_amount" ? "0.0001" : undefined}
                    value={formik.values[index]?.toString()}
                    {...{
                      fontFamily: "Roboto",
                      fontStyle: "normal",
                      fontWeight: "normal",
                      fontSize: "16px",
                      textAlign: "left",
                    }}
                    height={"56px"}
                    width={"424px"}
                    borderRadius="32px"
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
              height={"56px"}
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
      </HStack>
    </form>
  );
};

export { CreateGift };
