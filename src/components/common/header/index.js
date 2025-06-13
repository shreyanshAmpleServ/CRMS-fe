import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ImageWithBasePath from "../imageWithBasePath";
import { all_routes } from "../../../routes/all_routes";
import { useDispatch, useSelector } from "react-redux";
import {
  setExpandMenu,
  setMiniSidebar,
  setMobileSidebar,
} from "../../../redux/common/commonSlice";
import { logoutUser } from "../../../redux/auth/authSlice";
import Logo from "../logo";
// import ChangePassword from "./ChangePassword";
import { ModuleOptions } from "../selectoption/selectoption";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import { base_path } from "../../../config/environment";
import ImageWithDatabase from "../ImageFromDatabase";
import logo_path from "../../../assets/logo-2.png";
import { logoutUserWithToken } from "../../../redux/redirectCrms";
import { BsPersonCircle } from "react-icons/bs";


const Header = () => {
  const route = all_routes;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const mobileSidebar = useSelector((state) => state.common?.mobileSidebar);
  const miniSidebar = useSelector((state) => state.common?.miniSidebar);
  const isRedirectional = localStorage.getItem("redirectLogin");

  const { user, isAuthenticated } = useSelector((state) =>
    isRedirectional ? state.ngAuth : state.auth
  );
  // const { user, isAuthenticated } = useSelector((state) => state.auth);

  const { control } = useForm();

  const toggleMobileSidebar = () => {
    dispatch(setMobileSidebar(!mobileSidebar));
  };
  const toggleMiniSidebar = () => {
    dispatch(setMiniSidebar(!miniSidebar));
  };
  const toggleExpandMenu = () => {
    dispatch(setExpandMenu(true));
  };
  const toggleExpandMenu2 = () => {
    dispatch(setExpandMenu(false));
  };

  const [layoutBs, setLayoutBs] = useState(localStorage.getItem("dataTheme"));
  const isLockScreen = location.pathname === "/lock-screen";

  if (isLockScreen) {
    return null;
  }
  const LayoutDark = () => {
    localStorage.setItem("dataTheme", "dark");
    document.documentElement.setAttribute("data-theme", "dark");
    setLayoutBs("dark");
  };
  const LayoutLight = () => {
    localStorage.setItem("dataTheme", "light");
    document.documentElement.setAttribute("data-theme", "light");
    setLayoutBs("light");
  };
  const handleLogout = async () => {
    try {
      // Dispatch logoutUser thunk
      await dispatch(logoutUser()).unwrap();
      if (isRedirectional) {
        const redirectUrl = localStorage.getItem("SubDomain");
        await dispatch(logoutUserWithToken()).unwrap(); // Ensures proper error handling
        window.location.href = redirectUrl; // Redirect to login page
      } else {
        // await dispatch(logoutUser()).unwrap(); // Ensures proper error handling
        navigate(route?.login); // Redirect to login page
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const handleSelect = (selectedOption) => {
    if (selectedOption) {
      console.log("Navigating to:", selectedOption.path);
      navigate(selectedOption.path);
    }
  };

  return (
    <>
      {/* Header */}
      <div id="header" className="header ">
        {/* Logo */}
        <div
          className="header-left active"
          onMouseEnter={toggleExpandMenu}
          onMouseLeave={toggleExpandMenu2}
        >
          <Link to={route.dasshboard} className="logo logo-normal">
            <Logo base_path={base_path} />
          </Link>
          <Link to={route.dasshboard} className="logo-small">
            <ImageWithDatabase
              src={logo_path}
              alt="Logo"
              className="bg-light"
            />
          </Link>
          <Link id="toggle_btn" to="#" onClick={toggleMiniSidebar}>
            <i className="ti ti-arrow-bar-to-left" />
          </Link>
        </div>
        {/* /Logo */}
        <Link
          id="mobile_btn"
          className="mobile_btn"
          to="#sidebar"
          onClick={toggleMobileSidebar}
        >
          <span className="bar-icon">
            <span />
            <span />
            <span />
          </span>
        </Link>
        <div className="header-user">
          <ul className="nav user-menu">
            {/* Search */}
            <li className="nav-item nav-search-inputs me-auto">
              <div className="top-nav-search">
                <Link to="#" className="responsive-search">
                  <i className="fa fa-search" />
                </Link>
                <form className="dropdown">
                  <div className="searchinputs" id="dropdownMenuClickable">
                    {/* <input option={ModuleOptions} placeholder="Search" className={layoutBs === "dark" ? "text-light" : "text-dark"} /> */}
                    {/* <select onChange={handleChange} placeholder="Search" className={layoutBs === "dark" ? "text-light" : "text-dark"}  >
                    {ModuleOptions?.map((item)=><option value={item?.value}  >{item.name}</option>)}
                    </select> */}

                    <div id="searchs">
                      <Controller
                        name="Select"
                        control={control}
                        style={{ backgroundColor: "red" }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={ModuleOptions}
                            classNamePrefix="react-select"
                            placeholder="Select Modules"
                            onChange={handleSelect}
                            styles={{
                              control: (base, state) => ({
                                ...base,
                                height: "23px",
                                marginTop: "-10px",
                                backgroundColor: "transparent", // ✅ this controls the background
                                borderColor: "transparent",
                                boxShadow: "none",
                                alignItems: "center",
                                "&:hover": {
                                  borderColor: "transparent",
                                },
                                "&:focus": {
                                  borderColor: "transparent",
                                  boxShadow: "none",
                                },
                              }),
                            }}
                          />
                        )}
                      />
                    </div>
                    <div className="search-addon">
                      <button type="button">
                        <i className="ti ti-command" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </li>
            {/* /Search */}
            {/* Nav List */}
            <li className="nav-item nav-list">
              <ul className="nav">
                <li className="dark-mode-list">
                  <Link
                    to="#"
                    className={`dark-mode-toggle ${layoutBs ? "" : "active"}`}
                    id="dark-mode-toggle"
                  >
                    <i
                      className={`ti ti-sun light-mode ${
                        layoutBs === "dark" ? "" : "active"
                      }`}
                      onClick={LayoutLight}
                    >
                      {" "}
                    </i>
                    <i
                      className={`ti ti-moon dark-mode ${
                        layoutBs === "dark" ? "active" : ""
                      }`}
                      onClick={LayoutDark}
                    ></i>
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <Link
                    to="#"
                    className="btn btn-header-list"
                    data-bs-toggle="dropdown"
                  >
                    <i className="ti ti-layout-grid-add" />
                  </Link>
                  <div className="dropdown-menu dropdown-menu-end menus-info">
                    <div className="row">
                      <div className="col-md-6">
                        <ul className="menu-list">
                          <li>
                            <Link to={route.contactList}>
                              <div className="menu-details">
                                <span className="menu-list-icon bg-violet">
                                  <i className="ti ti-user-up" />
                                </span>
                                <div className="menu-details-content">
                                  <p>Contacts</p>
                                  <span>Add New Contact</span>
                                </div>
                              </div>
                            </Link>
                          </li>
                          <li>
                            <Link to={route.pipeline}>
                              <div className="menu-details">
                                <span className="menu-list-icon bg-green">
                                  <i className="ti ti-timeline-event-exclamation" />
                                </span>
                                <div className="menu-details-content">
                                  <p>Pipline</p>
                                  <span>Add New Pipline</span>
                                </div>
                              </div>
                            </Link>
                          </li>
                          <li>
                            <Link to={route.activities}>
                              <div className="menu-details">
                                <span className="menu-list-icon bg-pink">
                                  <i className="ti ti-bounce-right" />
                                </span>
                                <div className="menu-details-content">
                                  <p>Activities</p>
                                  <span>Add New Activity</span>
                                </div>
                              </div>
                            </Link>
                          </li>
                          <li>
                            <Link to={route.analytics}>
                              <div className="menu-details">
                                <span className="menu-list-icon bg-info">
                                  <i className="ti ti-analyze" />
                                </span>
                                <div className="menu-details-content">
                                  <p>Analytics</p>
                                  <span>Shows All Information</span>
                                </div>
                              </div>
                            </Link>
                          </li>
                          <li>
                            <Link to={route.projects}>
                              <div className="menu-details">
                                <span className="menu-list-icon bg-danger">
                                  <i className="ti ti-atom-2" />
                                </span>
                                <div className="menu-details-content">
                                  <p>Projects</p>
                                  <span>Add New Project</span>
                                </div>
                              </div>
                            </Link>
                          </li>
                        </ul>
                      </div>
                      <div className="col-md-6">
                        <ul className="menu-list">
                          <li>
                            <Link to={route.deals}>
                              <div className="menu-details">
                                <span className="menu-list-icon bg-info">
                                  <i className="ti ti-medal" />
                                </span>
                                <div className="menu-details-content">
                                  <p>Deals</p>
                                  <span>Add New Deals</span>
                                </div>
                              </div>
                            </Link>
                          </li>
                          <li>
                            <Link to={route.leads}>
                              <div className="menu-details">
                                <span className="menu-list-icon bg-secondary">
                                  <i className="ti ti-chart-arcs" />
                                </span>
                                <div className="menu-details-content">
                                  <p>Leads</p>
                                  <span>Add New Leads</span>
                                </div>
                              </div>
                            </Link>
                          </li>
                          <li>
                            <Link to={route.companies}>
                              <div className="menu-details">
                                <span className="menu-list-icon bg-tertiary">
                                  <i className="ti ti-building-community" />
                                </span>
                                <div className="menu-details-content">
                                  <p>Company</p>
                                  <span>Add New Company</span>
                                </div>
                              </div>
                            </Link>
                          </li>
                          <li>
                            <Link to={`${route.activities}/Task`}>
                              <div className="menu-details">
                                <span className="menu-list-icon bg-success">
                                  <i className="ti ti-list-check" />
                                </span>
                                <div className="menu-details-content">
                                  <p>Tasks</p>
                                  <span>Add New Task</span>
                                </div>
                              </div>
                            </Link>
                          </li>
                          <li>
                            <Link to={route.campaign}>
                              <div className="menu-details">
                                <span className="menu-list-icon bg-purple">
                                  <i className="ti ti-brand-campaignmonitor" />
                                </span>
                                <div className="menu-details-content">
                                  <p>Campaign</p>
                                  <span>Add New Campaign</span>
                                </div>
                              </div>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </li>
          
            {/* Profile Dropdown */}
            <li className="nav-item dropdown has-arrow main-drop">
              <Link
                to="#"
                className="nav-link userset"
                data-bs-toggle="dropdown"
              >
                <span className="user-info">
                  <span className="user-letter">
                  {(user?.mime_type && user?.template || user?.profile_img) ?    <img
                      src={
                        user?.mime_type && user?.template
                          ? `${user?.mime_type},${user?.template}`
                          : user?.profile_img
                      }
                      alt="Profile"
                      style={{ height: "100%" }}
                      className="p-1"
                    />
                   : <BsPersonCircle style={{fontSize:"3rem" }} />}
                  </span>
                  <span className="badge badge-success rounded-pill" />
                </span>
              </Link>
              <div className={` dropdown-menu  menu-drop-user `}>
                <div className="profilename">
                  <Link className="dropdown-item" to={route.dealsDashboard}>
                    <i className="ti ti-layout-2" /> Dashboard
                  </Link>
                  <Link className="dropdown-item" to={route.profile}>
                    <i className="ti ti-user-pin" /> My Profile
                  </Link>
                  {!isRedirectional && (
                    <Link
                      className="dropdown-item edit-popup"
                      to="#"
                      data-bs-toggle="modal"
                      data-bs-target="#change_password_modal"
                    >
                      <i className="ti ti-password-fingerprint" /> Change
                      Password
                    </Link>
                  )}
                  {isAuthenticated && (
                    <Link
                      className="dropdown-item"
                      to="#"
                      onClick={handleLogout}
                    >
                      <i className="ti ti-lock" /> Logout
                    </Link>
                  )}
                </div>
              </div>
            </li>
            {/* /Profile Dropdown */}
          </ul>
        </div>
        {/* Mobile Menu */}
        <div className="dropdown mobile-user-menu my-auto mt-2 ">
          <Link
            to="#"
            className="nav-link dropdown-toggle border-0 "
            style={{
              paddingTop: "0.5rem",
              paddingBottom: "0.5rem",
              paddingLeft: "1rem",
              paddingRight: "1rem",
            }}
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa fa-ellipsis-v" />
          </Link>
          <div className={` dropdown-menu `}>
            <Link className="dropdown-item" to={route.dealsDashboard}>
              <i className="ti ti-layout-2" /> Dashboard
            </Link>
            <Link className="dropdown-item" to={route.profile}>
              <i className="ti ti-user-pin" /> My Profile
            </Link>
            {!isRedirectional && (
              <Link
                className="dropdown-item edit-popup"
                to="#"
                data-bs-toggle="modal"
                data-bs-target="#change_password_modal"
              >
                <i className="ti ti-password-fingerprint" /> Change Password
              </Link>
            )}
            <Link
              className="dropdown-item"
              onClick={handleLogout}
              to={route.login}
            >
              <i className="ti ti-lock" /> Logout
            </Link>
          </div>
        </div>
        {/* /Mobile Menu */}
      </div>
      {/* <ChangePassword /> */}
    </>
  );
};

export default Header;
