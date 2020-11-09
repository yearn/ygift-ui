import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { HardhatContext } from "./hardhat/HardhatContext";
import { YGift } from "./components/YGift";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { CreateGift } from "./components/CreateGift";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <HardhatContext>
            <Switch>
              <Route exact path="/">
                <div>
                  <img src={logo} className="App-logo" alt="logo" />
                  <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                  </p>
                  <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
                    Learn React
                  </a>
                  <YGift></YGift>
                </div>
              </Route>
              <Route path="/create-gift">
                <CreateGift />
              </Route>
            </Switch>
          </HardhatContext>
        </Router>
      </header>
    </div>
  );
}

export default App;
