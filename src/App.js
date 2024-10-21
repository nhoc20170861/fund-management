/*!

=========================================================
* Argon Dashboard React - v1.2.3
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import { Outlet, Route, Routes, Navigate } from "react-router-dom";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import PrivateRoute from "components/PrivateRoute/PrivateRoute";
import AuthRoutes from "components/PrivateRoute/AuthRoutes";
import { StyledEngineProvider } from "@mui/material/styles";
import routes from "routes.js";
import NotFound from "views/pages/404page";

function App(props) {
  const getRoutes = (routes, _layout = "/auth") => {
    return routes.map((prop, key) => {
      if (prop.layout === _layout) {
        return (
          <Route path={prop.path} element={prop.component} key={key} exact>
            {prop.path === "project-management" && (
              <Route path={prop.childPath} element={prop.childComponent} />
            )}
          </Route>
        );
      } else {
        return null;
      }
    });
  };

  return (
    <StyledEngineProvider injectFirst>
      <Routes>
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminLayout></AdminLayout>
            </PrivateRoute>
          }
        >
          {getRoutes(routes, "/admin")}
        </Route>

        <Route
          path="/"
          element={
            <AuthRoutes>
              <AuthLayout></AuthLayout>
            </AuthRoutes>
          }
        >
          {getRoutes(routes)}
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </StyledEngineProvider>
  );
}

export default App;
