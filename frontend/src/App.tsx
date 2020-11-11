import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { HardhatContext } from "./hardhat/HardhatContext";
import { YGift } from "./components/YGift";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { CreateGift } from "./components/CreateGift";
import { Layout } from "./components/Layout";
import { About } from "./components/About";

function App() {
  return (
    <div className="App">
      <Router>
        <HardhatContext>
          <Layout>
            <Switch>
              <Route exact path="/">
                <About></About>
              </Route>
              <Route path="/create-gift">
                <CreateGift />
              </Route>
            </Switch>
          </Layout>
        </HardhatContext>
      </Router>
    </div>
  );
}

export default App;
