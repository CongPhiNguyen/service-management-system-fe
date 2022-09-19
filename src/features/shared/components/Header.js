import { NavLink, useNavigate } from "react-router-dom";
import { Layout } from "antd";
import React from "react";
const { Header } = Layout;

const navItem = "px-3  inline-block mr-[1em] hover:opacity";
const HeaderMain = () => {
  const navigate = useNavigate();
  const makeClass = (isActive) => {
    return isActive
      ? `${navItem} bg-[#f7cc15] text-[black]`
      : `${navItem} text-[white]`;
  };

  return (
    <Layout>
      <Header className="header flex items-center">
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
            className={({ isActive }) => makeClass(isActive)}
            to="/service-management"
          >
            Home
          </NavLink>
          <NavLink
            className={({ isActive }) => makeClass(isActive)}
            to="/add-service"
          >
            Add Service
          </NavLink>
          <NavLink
            className={({ isActive }) => makeClass(isActive)}
            to="/search"
          >
            Search
          </NavLink>
          <NavLink className={({ isActive }) => makeClass(isActive)} to="/test">
            Test
          </NavLink>
          <NavLink
            className={({ isActive }) => makeClass(isActive)}
            to="/speech-2-text"
          >
            Speech to text
          </NavLink>
        </div>
        {/* <Menu className="w-[1000px]" theme="dark" mode="horizontal" defaultSelectedKeys={['2']} items={items1} /> */}
      </Header>
    </Layout>
  );
};

export default HeaderMain;
