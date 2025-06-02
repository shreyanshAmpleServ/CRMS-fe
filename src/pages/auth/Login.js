// src/components/Login.js
import React, { useState, useEffect } from "react";
import ImageWithBasePath from "../../components/common/imageWithBasePath";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser, registerUser } from "../../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AllRoutes } from "../../config/AllRoute";
import { useSelector } from "react-redux";
import FlashMessage from "../../components/common/modals/FlashMessage";
import logo from "../../assets/crms.png";

const Login = () => {
  const route = AllRoutes;
  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [errMsg, setErrMsg] = useState("");

  // Sync initial error state to errMsg
  useEffect(() => {
    if (error?.message) {
      setErrMsg(error.message);
    }
  }, [error]);
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser({ email: username, password }));

      if (loginUser.fulfilled.match(result)) {
        navigate("/");
      } else {
        console.error("Login failed:", result.payload || result.error);
        // Optionally set an error state and show a message
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      // Avoid crashing and reloading the page
    }
  };
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };
  useEffect(() => {
    localStorage.setItem("menuOpened", "Dashboard");
  }, []);

  return (
    <div className="account-content">
      <Helmet>
        <title>Login - DCC CRMS</title>
        <meta name="description" content="Login to access your dashboard." />
      </Helmet>
      <div className="d-flex align-items-center   vw-100 vh-100 overflow-hidden account-bg-0 bg-white">
        <img
          className="d-none d-xl-flex  align-items-center justify-content-center flex-wrap  overflow-auto vh-75 m-auto p-4 w-50 bg-backdrop"
          src={logo}
          alt="image"
        />
        <div
          className="d-flex responsive-padding mx-auto overflow-hidden  align-items-center justify-content-center flex-wrap vh-100 overflow-auto   w-md-50   bg-opacity-25"
          // style={{
          //     width:  window.innerWidth >= 992 ? "50%" : "100%",
          // }}
        >
          <div
            className="shadow-lg rounded p-3 p-lg-4 "
            style={{
              border: "2px light black",
              transform: "scale(1.1)",
              // padding: "40px",
              boxShadow: "10px black",
            }}
          >
            {/* {errMsg && (
                  <FlashMessage
                    type="error"
                    message={errMsg}
                    onClose={() => setErrMsg(null)}
                  />
                )} */}
            <form className="flex-fill" onSubmit={handleLogin}>
              <div className="mx-auto mw-450">
                <div className="text-center mb-4">
                  <ImageWithBasePath
                    src="assets/img/logo/logo-2.png"
                    className="img-fluid  "
                    style={{ height: "70px", width: "90px" }}
                    alt="Logo"
                  />
                </div>
                <div className="mb-4">
                  <h4>Sign In</h4>
                  <p>Access the CRMS panel using your email and passcode.</p>
                </div>
                <div className="mb-3">
                  <label className="col-form-label">Email Address</label>
                  <div className="position-relative">
                    <span className="input-icon-addon">
                      <i className="ti ti-mail"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      value={username}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="col-form-label">Password</label>
                  <div className="pass-group">
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      className="pass-input form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <span
                      className={`ti toggle-password ${
                        isPasswordVisible ? "ti-eye" : "ti-eye-off"
                      }`}
                      onClick={togglePasswordVisibility}
                    ></span>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="form-check form-check-md d-flex align-items-center">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="checkebox-md"
                      defaultChecked
                    />
                    <label className="form-check-label" htmlFor="checkebox-md">
                      Remember Me
                    </label>
                  </div>
                  <div className="text-end">
                    <Link
                      to={route.forgotPassword}
                      className="text-primary fw-medium link-hover"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </div>
                <div className="mb-3">
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? "Signing In..." : "Sign In"}
                    {loading && (
                      <div
                        style={{
                          height: "15px",
                          width: "15px",
                        }}
                        className="spinner-border ml-2 text-light"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    )}
                  </button>
                </div>
                <div className="text-center">
                  <p className="fw-medium text-gray">
                    Copyright © 2025 - DCC CRMS
                  </p>
                </div>
                {/* <div className="mb-3">
                <h6>
                  New on our platform?
                  <Link to={route.register} className="text-purple link-hover">
                    {" "}
                    Create an account
                  </Link>
                </h6>
              </div>
              <div className="form-set-login or-text mb-3">
                <h4>OR</h4>
              </div>
              <>
                <div className="d-flex align-items-center justify-content-center flex-wrap mb-3">
                  <div className="text-center me-2 flex-fill">
                    <Link
                      to="#"
                      className="br-10 p-2 px-4 btn bg-pending  d-flex align-items-center justify-content-center"
                    >
                      <ImageWithBasePath
                        className="img-fluid m-1"
                        src="assets/img/icons/facebook-logo.svg"
                        alt="Facebook"
                      />
                    </Link>
                  </div>
                  <div className="text-center me-2 flex-fill">
                    <Link
                      to="#"
                      className="br-10 p-2 px-4 btn bg-white d-flex align-items-center justify-content-center"
                    >
                      <ImageWithBasePath
                        className="img-fluid  m-1"
                        src="assets/img/icons/google-logo.svg"
                        alt="Facebook"
                      />
                    </Link>
                  </div>
                  <div className="text-center flex-fill">
                    <Link
                      to="#"
                      className="bg-dark br-10 p-2 px-4 btn btn-dark d-flex align-items-center justify-content-center"
                    >
                      <ImageWithBasePath
                        className="img-fluid  m-1"
                        src="assets/img/icons/apple-logo.svg"
                        alt="Apple"
                      />
                    </Link>
                  </div>
                </div>
                <div className="text-center">
                  <p className="fw-medium text-gray">Copyright © 2024 - CRMS</p>
                </div>
              </> */}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
// style={{ background: "linear-gradient(to right top,rgba(228, 33, 7, 0.49) 0%,rgba(66, 242, 104, 0.69) 50% ,rgba(143, 119, 250, 0.69) 100%) " ,color:"white" ,}}
