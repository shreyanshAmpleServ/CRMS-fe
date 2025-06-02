import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setThemeSettings } from "../../redux/common/commonSlice";

import { Outlet } from "react-router-dom";
import ThemeSettings from "../../components/common/theme-settings/themeSettings";
import Header from "../../components/common/header";
import Sidebar from "../../components/common/sidebar";

const PrivateLayout = () => {
  const dispatch = useDispatch();
  const themeOpen = useSelector((state) => state.common?.themeSettings);
  const headerCollapse = useSelector((state) => state.common?.headerCollapse);
  const mobileSidebar = useSelector((state) => state.common?.mobileSidebar);
  const miniSidebar = useSelector((state) => state.common?.miniSidebar);
  const expandMenu = useSelector((state) => state.common?.expandMenu);
 
  return (
    <div className={`
      ${miniSidebar ? "mini-sidebar" : ""}
      ${expandMenu ? "expand-menu" : ""}`}>
     
       <div
       style={{position:"relative"}}
        className={`main-wrapper  
        ${headerCollapse ? "header-collapse" : ""} 
        ${mobileSidebar ? "slide-nav" : ""}`}
      >
        <Header />
        <Sidebar/>
        <Outlet />
        {/* <ThemeSettings/> */}
      </div>
      <div className="sidebar-overlay"></div>
      <div
        className={`sidebar-themeoverlay ${themeOpen ? "open" : ""}`}
        onClick={() => dispatch(setThemeSettings(!themeOpen))}
      ></div>
    </div>
  );
};

export default PrivateLayout;
