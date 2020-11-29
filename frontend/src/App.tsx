import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { HardhatContext } from "./hardhat/HardhatContext";
import { BrowserRouter as Router, Switch, Route, Link, useLocation } from "react-router-dom";
import { CreateGift } from "./components/CreateGift";
import { Layout } from "./components/Layout";
import { About } from "./components/About";
import { ViewGift } from "./components/ViewGift";
import { ChakraProvider } from "@chakra-ui/react";
import { GiftsTabs } from "./components/GiftsTabs";
import { Error } from "./components/Error";
// @ts-ignore-next
import SimpleReactLightbox from "simple-react-lightbox";
import ErrorBoundary from "./components/Error/ErrorBoundary";

export const AppRouter = () => {
  const location = useLocation();

  return (
    <ErrorBoundary key={location.pathname}>
      <Switch>
        <Route exact path="/">
          <About></About>
        </Route>
        <Route path="/create-gift">
          <CreateGift />
        </Route>
        <Route path="/gifts/">
          <GiftsTabs />
        </Route>
        <Route path="/gift/:id">
          <ViewGift />
        </Route>
        <Route path="/about">
          <About></About>
        </Route>
        <Route component={Error}></Route>
      </Switch>
    </ErrorBoundary>
  );
};

function App() {
  return (
    <div className="App">
      <Router>
        <ChakraProvider>
          <HardhatContext>
            <Layout>
              <SimpleReactLightbox>
                <AppRouter></AppRouter>
              </SimpleReactLightbox>
            </Layout>
          </HardhatContext>
        </ChakraProvider>
      </Router>
    </div>
  );
}

export default App;
