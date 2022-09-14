import React from "react";
import { Route, Routes } from "react-router-dom";
import routes from "./router";

const Routers = () => {
  return (
    <React.Suspense>
      <Routes>
        {routes.publicRoute.map((route, index) => {
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
        {routes.protectedRoute.map((route, index) => {
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
