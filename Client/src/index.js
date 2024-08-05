import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./stateManagement/store";
import App from "./App";
import { ThemeProvider } from "@emotion/react";
import Theme from "../src/themes/theme";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={Theme}>
      <Provider store={store}>
        <App />
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);
