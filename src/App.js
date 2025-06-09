import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import Loader from "./components/common/loader";
import PublicLayout from "./pages/layouts/PublicLayout";
import PrivateLayout from "./pages/layouts/PrivateLayout";
import { loadUser } from "./redux/auth/authSlice";
import {
  Login,
  Dashboard,
  privateRoutes,
  publicRoutes,
} from "./routes/router.link";
import NoPermissionPage from "./components/common/noPermission";
import RedirectCRMS from "./pages/Redirection";

const App = () => {
  const dispatch = useDispatch();
  const isAdmin = localStorage.getItem("role")?.includes("admin");
  const Permissions = localStorage.getItem("permissions")
    ? JSON?.parse(localStorage.getItem("permissions"))
    : [];
  // const Permissions = [];
  const isRedirectional = localStorage.getItem("redirectLogin");

  const pathName = window.location.pathname;
  const { isAuthenticated } = useSelector((state) => state.ngAuth);
  console.log("isRedirectional : ", isRedirectional);
  // const { isAuthenticated } = useSelector((state) =>
  //   domain == "mowara" ? state.ngAuth : state.auth
  // );
  // useEffect(() => {
  //   if (pathName !== "/login" && pathName !== "/") {
  //     console.log("kjkkjkj");
  //     dispatch(loadUser());
  //   }
  // }, [dispatch, isAuthenticated]);
  const filteredRoutes = isAdmin
    ? privateRoutes
    : privateRoutes?.filter((route) => {
        return Permissions.some(
          (permission) =>
            route?.title?.includes(permission.module_name) &&
            Object.values(permission.permissions).some((perm) => perm === true)
        );
      });

  // if (hasPermission) return null;
  return (
    <HelmetProvider>
      <Router>
        {/* {loading && <Loader />} */}
        <Routes>
          {/* Public Layout and Routes */}
          {!isAuthenticated && (
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<RedirectCRMS />} />
              <Route path="/login" element={<RedirectCRMS />} />
              {/* <Route
                path="*"
                element={
                  !isRedirectional &&
                  (window.location.href = "https://mowara.dcclogsuite.com")
                }
              /> */}
              {/* <Route index element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/login" />} /> */}
            </Route>
          )}

          {/* Private Layout and Routes */}
          {isAuthenticated && filteredRoutes?.length > 0 ? (
            <Route path="/" element={<PrivateLayout />}>
              <Route
                index
                element={
                  filteredRoutes[0]?.element || (
                    <Navigate to={filteredRoutes[0]?.path || "/"} />
                  )
                }
              />
              {/* <Route index element={<Dashboard />} /> */}
              {filteredRoutes?.map((route, idx) => {
                return (
                  <Route path={route.path} element={route.element} key={idx} />
                );
              })}
              <Route
                path="*"
                element={<Navigate to={filteredRoutes[0]?.path} replace />}
              />

              {/* <Route
            path="*"
            element={
              <Navigate to={isAuthenticated ? "/dashboard" : "/login"} />
            }
          /> */}
            </Route>
          ) : (
            isAuthenticated &&
            filteredRoutes?.length === 0 && (
              <Route path="/" element={<PublicLayout />}>
                <Route index element={<NoPermissionPage />} />
                <Route path="no-permission" element={<NoPermissionPage />} />
                <Route
                  path="*"
                  element={<Navigate to="/no-permission" replace />}
                />
              </Route>
            )
          )}

          {/* Redirect for unmatched routes */}
        </Routes>
      </Router>
      <Toaster />
    </HelmetProvider>
  );
};

export default App;
