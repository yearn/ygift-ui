import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

window.onerror = (event: Event | string, source?: string, lineno?: number, colno?: number, error?: Error) => {
  console.error(event);
  console.error(error);

  setTimeout(() => {
    window.location.href = "/error";
  }, 3000);
};

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
