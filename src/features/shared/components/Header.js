import { NavLink, useNavigate } from "react-router-dom";
import { Layout } from "antd";
import React from "react";
const { Header } = Layout;

const navItem = "px-3 inline-block mr-[1em] hover:opacity";
const HeaderMain = () => {
  const navigate = useNavigate();
  const makeClass = (isActive) => {
    return isActive
      ? `${navItem} bg-[#947a0d] text-[white]`
      : `${navItem} text-[white]`;
  };

  return (
    <Layout>
      <Header className="header flex items-center !bg-[#f7cc15]">
        <img
          src="/logo_2.png"
          alt=""
          className="h-[50px] ml-[-40px] mr-[20px]"
        />
        <NavLink to="/service-management">
          <img
            className="h-[40px]"
            alt="logo"
            width={100}
            src="/logo.png"
          ></img>
        </NavLink>

        <div className="left-nav ml-[50px]">
          <NavLink
            style={{ fontWeight: "600", fontSize: "16px" }}
            className={({ isActive }) => makeClass(isActive)}
            to="/service-management"
          >
            Home
          </NavLink>
          <NavLink
            style={{ fontWeight: "600", fontSize: "16px" }}
            className={({ isActive }) => makeClass(isActive)}
            to="/add-service"
          >
            Add Service
          </NavLink>
        </div>
        {/* <Menu className="w-[1000px]" theme="dark" mode="horizontal" defaultSelectedKeys={['2']} items={items1} /> */}
      </Header>
    </Layout>
  );
};

export default HeaderMain;
