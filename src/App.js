import React from "react";
import { BrowserRouter } from "react-router-dom";
import Routers from "./routers";
import HeaderMain from "./features/shared/components/Header";
import "./App.css";
import "antd/dist/antd.min.css";
function App() {
  return (
    <BrowserRouter>
      <div className="page-container overflow-hidden">
        <div className="header-container">
          <HeaderMain />
        </div>
        <Routers />
      </div>
    </BrowserRouter>
  );
}

export default App;
