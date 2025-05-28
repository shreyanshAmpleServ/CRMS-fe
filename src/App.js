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
import NoPermissionPage from "./components/common/noPermission";

const App = () => {
  const dispatch = useDispatch();
  const isAdmin = localStorage.getItem("role")?.includes("admin") 
  const Permissions = localStorage.getItem("permissions")
    ? JSON?.parse(localStorage.getItem("permissions"))
    : [];


    const pathName = window.location.pathname;
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if( pathName !== "/login" || pathName !== "/") {
    dispatch(loadUser());
    }
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
                <Route
            path="*"
            element={
              <Navigate to="/login" />
            }
          />
              {/* Additional public routes */}
            </Route>
          )}

          {/* Private Layout and Routes */}
          {isAuthenticated && filteredRoutes?.length > 0  ?  (
            <Route path="/" element={<PrivateLayout />}>
               <Route index element={filteredRoutes[0]?.element || <Navigate to={filteredRoutes[0]?.path || "/"} />} />
              {/* <Route index element={<Dashboard />} /> */}
              {filteredRoutes?.map((route, idx) => {
                return <Route path={route.path} element={route.element} key={idx} />
 } )}
 <Route path="*" element={<Navigate to={filteredRoutes[0]?.path} replace />} />

     {/* <Route
            path="*"
            element={
              <Navigate to={isAuthenticated ? "/dashboard" : "/login"} />
            }
          /> */}
            </Route>
            
          ) : 
 

    isAuthenticated && filteredRoutes?.length === 0 && (
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<NoPermissionPage />} />
        <Route path="no-permission" element={<NoPermissionPage />} />
        <Route path="*" element={<Navigate to="/no-permission" replace />} />
      </Route>)
    
           }

          {/* Redirect for unmatched routes */}
     
        </Routes>
      </Router>
      <Toaster  />
    </HelmetProvider>
  );
};

export default App;
