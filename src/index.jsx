import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/arya-blue/theme.css";

import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import GuildsWrapper from "./context/guilds.context";
import ToastsWrapper from "./context/toasts.context";
import UserWrapper from "./context/user.context";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastsWrapper>
        <UserWrapper>
          <GuildsWrapper>
            <App />
          </GuildsWrapper>
        </UserWrapper>
      </ToastsWrapper>
    </BrowserRouter>
  </React.StrictMode>
);
