import React from "react";
import { BrowserRouter } from "react-router-dom";
import Routers from "./routers";
import HeaderMain from "./features/shared/components/Header";
import "./App.css";
import "antd/dist/antd.min.css";
import { store } from "./store";
import { Provider } from "react-redux";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="page-container">
          <div className="header-container">
            <HeaderMain />
          </div>
          <Routers />
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
