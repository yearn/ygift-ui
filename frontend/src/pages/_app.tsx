import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps /*, AppContext */ } from "next/app";
import { Layout } from "../components/Layout";
import { HardhatContext } from "../hardhat/HardhatContext";
// @ts-ignore-next
import SimpleReactLightbox from "simple-react-lightbox";
import ErrorBoundary from "../components/Error/ErrorBoundary";
import Head from "next/head";
import "../App.css";
import { useEffect } from "react";

function MyApp({ Component, pageProps, router }: AppProps) {
  useEffect(() => {
    if (!window) return;
    window.onerror = (event: Event | string, source?: string, lineno?: number, colno?: number, error?: Error) => {
      console.error(event);
      console.error(error);

      setTimeout(() => {
        window.location.href = "/error";
      }, 3000);
    };
  }, []);
  return (
    <ChakraProvider>
      <HardhatContext>
        <Layout>
          <SimpleReactLightbox>
            <ErrorBoundary key={router.asPath}>
              <Head>
                <title>yGift</title>
              </Head>
              <Component {...pageProps} />
            </ErrorBoundary>
          </SimpleReactLightbox>
        </Layout>
      </HardhatContext>
    </ChakraProvider>
  );
}

export default MyApp;
