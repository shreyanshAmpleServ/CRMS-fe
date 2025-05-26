// src/App.js
import React, { useEffect } from "react";
import {Toaster} from "react-hot-toast"
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

const App = () => {
  const dispatch = useDispatch();
  const isAdmin = localStorage.getItem("role")?.includes("admin") 
  const Permissions = localStorage.getItem("permissions")
    ? JSON?.parse(localStorage.getItem("permissions"))
    : [];

  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);
  const filteredRoutes =  isAdmin ? privateRoutes  : privateRoutes?.filter((route) => {
    return Permissions.some((permission) => 
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
              <Route index element={<Login />} />
              <Route path="/login" element={<Login />} />
              {/* Additional public routes */}
            </Route>
          )}

          {/* Private Layout and Routes */}
          {isAuthenticated && (
            <Route path="/" element={<PrivateLayout />}>
               <Route index element={filteredRoutes[0]?.element || <Navigate to={filteredRoutes[0]?.path || "/"} />} />
              {/* <Route index element={<Dashboard />} /> */}
              {filteredRoutes?.map((route, idx) => {
                return <Route path={route.path} element={route.element} key={idx} />
 } )}
            </Route>
          )}

          {/* Redirect for unmatched routes */}
          <Route
            path="*"
            element={
              <Navigate to={isAuthenticated ? "/dashboard" : "/login"} />
            }
          />
        </Routes>
      </Router>
      <Toaster  />
    </HelmetProvider>
  );
};

export default App;
