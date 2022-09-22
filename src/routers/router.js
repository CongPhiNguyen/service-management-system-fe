import React from "react";
import { Navigate } from "react-router-dom";
const ServiceManagement = React.lazy(() =>
  import("../features/main/pages/MainPage")
);
const EditServicesPage = React.lazy(() => import("../features/EditService/pages/EditServicesPage"))
const AddServicesPage = React.lazy(() =>
  import("../features/AddService/pages/AddServicesPage")
);

const Login = React.lazy(() => import("../features/authentication/pages/Login"))

// Những route chỉ truy xuất khi chưa đăng nhập
const publicRoute = [
  { path: "/:id", name: "Search", element: < Navigate to="/login" /> },
  { path: "/", name: "Home", element: < Navigate to="login" /> },
  {
    path: "/login",
    name: "Login",
    element: <Login />
  }
];

// Những route dùng khi đã đăng nhập
const protectedRoute = [
  { path: "/edit-service/:id", name: "Edit Service", element: <EditServicesPage /> },
  { path: "/add-service", name: "Add Service", element: <AddServicesPage /> },
  {
    path: "/service-management",
    name: "Service Management",
    element: <ServiceManagement />,
  },
  { path: "/:id", name: "Search", element: < Navigate to="/service-management" /> },
  { path: "/", name: "Home", element: < Navigate to="service-management" /> },
];

// route dùng cho mọi trường hợp
const commonRoute = [

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
