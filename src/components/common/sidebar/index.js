import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Scrollbars from "react-custom-scrollbars-2";
import { SidebarData } from "../data/json/sidebarData";
import ImageWithBasePath from "../imageWithBasePath";
import { useDispatch, useSelector } from "react-redux";
import { setExpandMenu, setMobileSidebar } from "../../../redux/common/commonSlice";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

const Sidebar = () => {
  const Location = useLocation();
  const expandMenu = useSelector((state) => state.common?.expandMenu);
  const dispatch = useDispatch();
  const isAdmin = localStorage.getItem("role")?.includes("admin");
  const Permissions = localStorage.getItem("permissions")
    ? JSON?.parse(localStorage.getItem("permissions"))
    : [];

  const [subOpen, setSubopen] = useState("");
  const [subsidebar, setSubsidebar] = useState("");
  const { user, isAuthenticated } = useSelector((state) => state.auth);
    const mobileSidebar = useSelector((state) => state.common?.mobileSidebar);
  const toggleSidebar = (title) => {
    localStorage.setItem("menuOpened", title.label);
    if (title.label === subOpen) {
      setSubopen("");
    } else {
      setSubopen(title.label);
    }
    !title.submenu && toggleMobileSidebar()
  };

  const toggleSubsidebar = (subitem) => {
    if (subitem === subsidebar) {
      setSubsidebar("");
    } else {
      setSubsidebar(subitem);
      toggleMobileSidebar()
    }
  };
  const toggle = () => {
    dispatch(setExpandMenu(true));
  };
  const toggle2 = () => {
    dispatch(setExpandMenu(false));
  };

  useEffect(() => {
    setSubopen(localStorage.getItem("menuOpened"));
    // Select all 'submenu' elements
    const submenus = document.querySelectorAll(".submenu");
    // Loop through each 'submenu'
    submenus.forEach((submenu) => {
      // Find all 'li' elements within the 'submenu'
      const listItems = submenu.querySelectorAll("li");
      submenu.classList.remove("active");
      // Check if any 'li' has the 'active' class
      listItems.forEach((item) => {
        if (item.classList.contains("active")) {
          // Add 'active' class to the 'submenu'
          submenu.classList.add("active");
          return;
        }
      });
    });
  }, [Location.pathname]);

  const isMatch = (subLink, currentPath) => {
    if (!subLink || !currentPath) return false;

    const subLinkParts = subLink.split("/");
    const pathParts = currentPath.split("/");

    if (subLinkParts.length !== pathParts.length) return false;

    return subLinkParts.every(
      (part, index) => part.startsWith(":") || part === pathParts[index]
    );
  };
const [openMain, setOpenMain] = useState("CRM");

const toggleMainSection = (label , subMenu) => {
  setOpenMain(prev => (prev === label ? "" : label));
      localStorage.setItem("menuOpened", subMenu?.[0]?.label );
    if (subMenu?.[0]?.label  === subOpen) {
      setSubopen("");
    } else {
      setSubopen(subMenu?.[0]?.label );
    }
    const targetLink = subMenu?.[0]?.submenu ? "#" : subMenu?.[0]?.link;
  if (targetLink && targetLink !== "#") {
     window.history.pushState({}, "", targetLink);
  }

};
const toggleMobileSidebar = () => {
  dispatch(setMobileSidebar(!mobileSidebar));
};
  return (
    <>
      <div
        className="sidebar"
        id="sidebar"
        onMouseEnter={toggle}
        onMouseLeave={toggle2}
      >
        <Scrollbars>
          <div className="sidebar-inner slimscroll">
            <div id="sidebar-menu" className="sidebar-menu">
              <ul>
                <li className="clinicdropdown theme">
                  <Link to="/profile">
                    <img
                      src={
                        user?.profile_img || "assets/img/profiles/avatar-14.jpg"
                      }
                      className="img-fluid"
                      alt="Profile"
                    />

                    <div className="user-names">
                      <h5>{`${user?.full_name}`}</h5>
                      <h6>{`${user?.crms_d_user_role?.[0]?.crms_m_role["role_name"]}`}</h6>
                    </div>
                  </Link>
                </li>
              </ul>

              <ul>
                {SidebarData?.map((mainLabel, index) => (
                  <li className="clinicdropdown" key={index}>
                    <div className="d-flex justify-content-between fw-bolder border-bottom"   
                     onClick={() => {toggleMainSection(mainLabel.label , mainLabel?.submenuItems)}}>
                    <h6 className="submenu-hdr fw-bold">{mainLabel?.label}</h6>
                   {openMain === mainLabel.label ? <IoIosArrowDown /> :
                    <IoIosArrowUp />}
                 
                    </div>
                  
                    <ul   style={{
        display: openMain === mainLabel.label ? "block" : "none",
      }}>
                      {mainLabel?.submenuItems?.map((title, i) => {
                        let link_array = [];
                        if ("submenuItems" in title) {
                          title.submenuItems?.forEach((link) => {
                            link_array.push(link?.link);
                            if (link?.submenu && "submenuItems" in link) {
                              link.submenuItems?.forEach((item) => {
                                link_array.push(item?.link);
                              });
                            }
                          });
                        }
                        title.links = link_array;

                        // **Filter items based on permissions**
                        const hasPermission = isAdmin
                          ? true
                          : Permissions.some(
                              (permission) =>
                                permission.module_name
                                  ?.trim()
                                  ?.toLowerCase() ===
                                  title.label?.trim()?.toLowerCase() &&
                                Object.values(permission.permissions).some(
                                  (perm) => perm === true
                                )
                            );

                        if (!hasPermission) return null;

                        return (
                          <li className="submenu" key={title?.label}>
                            <Link
                              to={title?.submenu ? "#" : title?.link}
                              onClick={() => toggleSidebar(title)}
                              className={`${
                                subOpen === title?.label ? "subdrop" : ""
                              } ${
                                title?.links?.includes(Location.pathname)
                                  ? "active"
                                  : ""
                              } ${
                                title?.submenuItems
                                  ?.map((link) => link?.link)
                                  .includes(Location.pathname) ||
                                title?.link === Location.pathname
                                  ? "active"
                                  : "" ||
                                      isMatch(
                                        title?.subLink1,
                                        Location.pathname
                                      )
                                    ? "active"
                                    : "" ||
                                        isMatch(
                                          title?.subLink2,
                                          Location.pathname
                                        )
                                      ? "active"
                                      : "" ||
                                          title?.subLink3 === Location.pathname
                                        ? "active"
                                        : "" ||
                                            title?.subLink4 ===
                                              Location.pathname
                                          ? "active"
                                          : ""
                              }`}
                            >
                              <i className={title.icon}></i>
                              <span>{title?.label}</span>
                              <span
                                className={title?.submenu ? "menu-arrow" : ""}
                              />
                            </Link>
                            <ul
                              style={{
                                display:
                                  subOpen === title?.label ? "block" : "none",
                              }}
                            >
                              {title?.submenuItems?.map((item) => (
                                <li
                                  className="submenu submenu-two"
                                  key={item.label}
                                >
                                  <Link
                                    to={item?.link}
                                    className={`${
                                      item?.submenuItems
                                        ?.map((link) => link?.link)
                                        .includes(Location.pathname) ||
                                      item?.link === Location.pathname
                                        ? "active subdrop"
                                        : ""
                                    } `}
                                    onClick={() => {
                                      toggleSubsidebar(item?.label);
                                    }}
                                  >
                                    {item?.label}
                                    <span
                                      className={
                                        item?.submenu ? "menu-arrow" : ""
                                      }
                                    />
                                  </Link>
                                  <ul
                                    style={{
                                      display:
                                        subsidebar === item?.label
                                          ? "block"
                                          : "none",
                                    }}
                                  >
                                    {item?.submenuItems?.map((items) => (
                                      <li key={items.label}>
                                        <Link
                                          to={items?.link}
                                          className={`${
                                            subsidebar === items?.label
                                              ? "submenu-two subdrop"
                                              : "submenu-two"
                                          } ${
                                            items?.submenuItems
                                              ?.map((link) => link.link)
                                              .includes(Location.pathname) ||
                                            items?.link === Location.pathname
                                              ? "active"
                                              : ""
                                          }`}
                                        >
                                          {items?.label}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </li>
                              ))}
                            </ul>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Scrollbars>
      </div>
    </>
  );
};

export default Sidebar;
