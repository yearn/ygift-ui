import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps /*, AppContext */ } from "next/app";
import { Layout } from "../components/Layout";
import { HardhatContext } from "../hardhat/HardhatContext";
// @ts-ignore-next
import SimpleReactLightbox from "simple-react-lightbox";
import ErrorBoundary from "../components/Error/ErrorBoundary";

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <ChakraProvider>
      <HardhatContext>
        <Layout>
          <SimpleReactLightbox>
            <ErrorBoundary key={router.asPath}>
              <Component {...pageProps} />
            </ErrorBoundary>
          </SimpleReactLightbox>
        </Layout>
      </HardhatContext>
    </ChakraProvider>
  );
}

export default MyApp;
