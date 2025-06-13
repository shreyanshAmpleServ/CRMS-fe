// src/components/Login.js
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/common/loader";
import { loginWithToken } from "../../redux/redirectCrms";

const RedirectCRMS = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, isAuthenticated, error } = useSelector(
    (state) => state.ngAuth
  );
  const [errMsg, setErrMsg] = useState("");
  // Sync initial error state to errMsg
  useEffect(() => {
    if (error?.message) {
      setErrMsg(error.message);
    }
  }, [error]);
  //   const handleLogin = async (e) => {
  //     e.preventDefault();
  //     try {
  //       const result = await dispatch(loginUser({ email: username, password }));

  //       if (loginUser.fulfilled.match(result)) {
  //         navigate("/");
  //       } else {
  //         console.error("Login failed:", result.payload || result.error);
  //         // Optionally set an error state and show a message
  //       }
  //     } catch (err) {
  //       console.error("Unexpected error:", err);
  //       // Avoid crashing and reloading the page
  //     }
  //   };
  const Token = localStorage.getItem("token")
  const domain = localStorage.getItem("domain")
  const decodedDomain = domain ?  atob(domain) : null;
  const parseData = JSON.parse(decodedDomain)?.SubDomain
  console.log("Token from local storage ; ", Token)
  useEffect(() => {
    const performLogin = async () => {
      localStorage.setItem("menuOpened", "Dashboard");
      const result = await dispatch(
        loginWithToken({
          token:
            Token ,
                Domain:parseData|| "mowara",
        })
      );
      if (loginWithToken.fulfilled.match(result)) {
        navigate("/");
        // console.log("Login : ", loginWithToken.fulfilled.match(result));
      } else {
        console.error("Login failed:", result.payload || result.error);
      // window.location.href = "https://mowara.dcclogsuite.com/";
      }
    };

    !isAuthenticated && performLogin();
  }, [isAuthenticated, dispatch]);
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  // useEffect(async () => {
  //   localStorage.setItem("menuOpened", "Dashboard");
  //   const result = await dispatch(
  //     loginWithToken({
  //       token:
  //         "eyJhbGciOiJBMjU2Q0JDLUhTNTEyIiwidHlwIjoiSldUIn0.eyJ1c2VyaWQiOiIxIiwidXNlcm5hbWUiOiJhZG1pbiIsImRibmFtZSI6IkRDQ0J1c2luZXNzU3VpdGVfbW93YXJhIiwibmJmIjoxNzQ4ODQ2MTEwLCJleHAiOjE3NDkwMjYxMTAsImlhdCI6MTc0ODg0NjExMH0.5SJkvkX2Js5YxdJA7mxhBW5BgjP6lEEy-70yZ_GXsoBaBcmjYozFRxOcsqAVLVx9sDDwRYdNjSJyX_ErhyOvdQ",
  //       Domain: "mowara",
  //     })
  //   );
  //   console.log(
  //     "Loging and Redirect : ",
  //     loginWithToken.fulfilled.match(result)
  //   );
  //   if (loginWithToken.fulfilled.match(result)) {
  //     navigate("/dashbord");
  //   } else {
  //     console.error("Login failed:", result.payload || result.error);
  //     // Optionally set an error state and show a message
  //   }
  // }, []);

  return (
    <div className="account-content">
      <Helmet>
        <title>Redirecting - DCC CRMS</title>
        <meta name="description" content="Login to access your dashboard." />
      </Helmet>
      <div className="d-flex align-items-center   vw-100 vh-100 overflow-hidden account-bg-0 bg-white">
        <Loader />
      </div>
    </div>
  );
};

export default RedirectCRMS;
