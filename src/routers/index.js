import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import routes from "./router";
import { get } from "../api/axios"
import URL from "../api/config"
import { useDispatch, useSelector } from "react-redux";

import { UserLogin } from "../actions/userAction";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";
const Routers = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(state => {
    console.log("state", state)
  })
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    const refreshApi = () => {
      get(URL.URL_ADMIN_REFRESH)
        .then(res => {
          if (res.data.message === "Refresh thành công") {
            dispatch(UserLogin(res.data.token))
            navigate("/service-management")
            setIsLoading(true)
          } else {
            navigate("/login")
            setIsLoading(true)
          }
        })
        .catch(err => {
          navigate("/login")
        })
    }
    console.log(user)
    refreshApi()
  }, [])

  if (!isLoading) return <Spin></Spin>

  return (
    <React.Suspense>
      <Routes>
        {
          user.isLogin ? routes.protectedRoute.map((route, index) => {
            return (
              route.element && (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              )
            );
          }) : routes.publicRoute.map((route, index) => {
            return (
              route.element && (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              )
            );
          })
        }
        {routes.commonRoute.map((route, index) => {
          return (
            route.element && (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            )
          );
        })}
      </Routes>
    </React.Suspense>
  );
};

export default Routers;
