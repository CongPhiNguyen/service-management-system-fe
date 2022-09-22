import React from "react";
import { Navigate } from "react-router-dom";
const ServiceManagement = React.lazy(() =>
  import("../features/main/pages/MainPage")
);
const EditServicesPage = React.lazy(() => import("../features/EditService/pages/EditServicesPage"))
const AddServicesPage = React.lazy(() =>
  import("../features/AddService/pages/AddServicesPage")
);
const Search = React.lazy(() => import("../features//search/Search.js"));
const Test = React.lazy(() => import("../features//search/Test.js"));
// Những route chỉ truy xuất khi chưa đăng nhập
const publicRoute = [
  { path: "/edit-service/:id", name: "Edit Service", element: <EditServicesPage /> },
  { path: "/add-service", name: "Add Service", element: <AddServicesPage /> },
  {
    path: "/service-management",
    name: "Service Management",
    element: <ServiceManagement />,
  },


];

// Những route dùng khi đã đăng nhập
const protectedRoute = [];

// route dùng cho mọi trường hợp
const commonRoute = [
  { path: "/search", name: "Search", element: <Search /> },
  { path: "/test", name: "Search", element: <Test /> },
  { path: "/:id", name: "Search", element: < Navigate to="/service-management" /> },
  { path: "/", name: "Home", element: < Navigate to="service-management" /> },
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
