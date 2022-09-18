import React from "react";

const ServiceManagement = React.lazy(() =>
  import("../features/main/pages/MainPage")
);
const AddServicesPage = React.lazy(() =>
  import("../features/AddService/pages/AddServicesPage")
);
const D3js = React.lazy(() => import("../features/d3js/D3js"))
const Search = React.lazy(() => import("../features//search/Search.js"));
const Home = React.lazy(() => import("../features//shared/pages/Home.js"));
const Test = React.lazy(() => import("../features//search/Test.js"));

// Những route chỉ truy xuất khi chưa đăng nhập
const publicRoute = [
  { path: "/add-service", name: "Add Service", element: <AddServicesPage /> },
  {
    path: "/service-management",
    name: "Service Management",
    element: <ServiceManagement />,
  },
  {
    path: "/d3js", name: "D3js", element: <D3js />
  }
];

// Những route dùng khi đã đăng nhập
const protectedRoute = [];

// route dùng cho mọi trường hợp
const commonRoute = [
  { path: "/search", name: "Search", element: <Search /> },
  { path: "/test", name: "Search", element: <Test /> },
  { path: "/", name: "Home", element: <Home /> },
];

// Route dùng cho manager
const managerRoute = [];

const routes = {
  publicRoute,
  commonRoute,
  protectedRoute,
  managerRoute,
};

export default routes;
