import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { HardhatContext } from "./hardhat/HardhatContext";
import { YGift } from "./components/YGift";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { CreateGift } from "./components/CreateGift";
import { Layout } from "./components/Layout";
import { About } from "./components/About";
import { ViewGift } from "./components/ViewGift";
import { ChakraProvider } from "@chakra-ui/core";

function App() {
  return (
    <div className="App">
      <Router>
        <ChakraProvider>
          <HardhatContext>
            <Layout>
              <Switch>
                <Route exact path="/">
                  <About></About>
                </Route>
                <Route path="/create-gift">
                  <CreateGift />
                </Route>
                <Route path="/gift/:tokenId">
                  <ViewGift />
                </Route>
              </Switch>
            </Layout>
          </HardhatContext>
        </ChakraProvider>
      </Router>
    </div>
  );
}

export default App;
