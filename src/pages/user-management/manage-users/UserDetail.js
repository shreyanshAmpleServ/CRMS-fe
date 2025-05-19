import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { all_routes } from "../../../routes/all_routes";
import { useDispatch, useSelector } from "react-redux";
import ImageWithBasePath from "../../../components/common/imageWithBasePath";
import CollapseHeader from "../../../components/common/collapse-header";
import { fetchUserById, deleteUser } from "../../../redux/manage-user";
import EditUserModal from "./modal/EditUserModal";
import DeleteAlert from "./alert/DeleteAlert";
import DateFormat from "../../../utils/DateFormat";
import UserActivities from "./modal/UserActvities";
import { useNavigate } from "react-router-dom";

const UserDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the user details when the component mounts
    dispatch(fetchUserById(id));
  }, [id, dispatch]);

  // Get the user details from Redux store
  const { userDetail, loading} = useSelector((state) => state.users);

  const route = all_routes;

  const badgeClasses = [
    "badge-soft-success",
    "badge-soft-warning",
    "badge-soft-info",
    "badge-soft-danger",
    "badge-soft-primary",
    "badge-soft-secondary",
  ];

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleDeleteUser = () => {
    setShowDeleteModal(true);
  };
  const deleteData = () => {
    if (userDetail) {
      dispatch(deleteUser(userDetail.id)); // Dispatch the delete action
      navigate(`/users`); // Navigate to the specified route
      setShowDeleteModal(false); // Close the modal
    }
  };

  // Social icons mapping
  const socialIcons = {
    facebook: "fa-brands fa-facebook-f",
    instagram: "fa-brands fa-instagram",
    linkedin: "fa-brands fa-linkedin",
    skype: "fa-brands fa-skype",
    twitter: "fa-brands fa-twitter",
    whatsapp: "fa-brands fa-whatsapp",
  };

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper position-relative">
      {/* {loading ? (
          <div
            style={{
              zIndex: 9999,
              paddingTop: "20%",
              paddingLeft: "35%",
              width: "100%",
              marginLeft: "0%",
              minHeight: "100vh",
              marginTop:"59px",
              backgroundColor: "rgba(255, 255, 255,.5)",
            }}
            className=" position-fixed  w-screen  top-0   bg-gray  "
          >
            <div
              className="spinner-border position-absolute d-flex justify-content-center  text-primary"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : */}
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              {/* Page Header */}
              <div className="page-header">
                <div className="row align-items-center">
                  <div className="col-sm-4">
                    <h4 className="page-title">User</h4>
                  </div>
                  <div className="col-sm-8 text-sm-end">
                    <div className="head-icons">
                      <CollapseHeader />
                    </div>
                  </div>
                </div>
              </div>
              {/* /Page Header */}
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              {/* User Details */}
              <div className="contact-head">
                <div className="row align-items-center">
                  <div className="col-sm-6">
                    <ul className="contact-breadcrumb">
                      <li>
                        <Link to={route.userGrid}>
                          <i className="ti ti-arrow-narrow-left" />
                          User
                        </Link>
                      </li>
                      <li>{userDetail?.full_name}</li>
                    </ul>
                  </div>
                  <div className="col-sm-6 text-sm-end">
                    <div className="contact-pagination">
                      <ul>
                        <li>
                          <Link to={route.userDetails}>
                            <i className="ti ti-chevron-left" />
                          </Link>
                        </li>
                        <li>
                          <Link to={route.userDetails}>
                            <i className="ti ti-chevron-right" />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-body pb-2">
                  <div className="d-flex align-items-center justify-content-between flex-wrap">
                    <div className="d-flex align-items-center mb-2">
                      <div className="avatar avatar-xxl online online-sm me-3 flex-shrink-0">
                        {userDetail?.profile_img ? (
                          <img
                            src={userDetail?.profile_img}
                            alt="User Avatar"
                            className="preview"
                          />
                        ) : (
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-14.jpg"
                            alt="User Avatar"
                          />
                        )}
                        <span className="status online" />
                      </div>
                      <div>
                        <h5 className="mb-1">{userDetail?.full_name}</h5>
                        <p className="mb-2">{userDetail?.role}</p>
                      </div>
                    </div>
                    <div className="contacts-action">
                      <Link
                        to="#"
                        className="btn-icon"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvas_edit_user"
                      >
                        <i className="ti ti-edit-circle" />
                      </Link>
                      <div className="act-dropdown">
                        <Link
                          to="#"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <i className="ti ti-dots-vertical" />
                        </Link>
                        <div className="dropdown-menu dropdown-menu-right">
                          <Link
                            className="dropdown-item"
                            to="#"
                            onClick={() => handleDeleteUser(true)}
                          >
                            <i className="ti ti-trash text-danger" />
                            Delete
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* /User Details */}
            </div>
            {/* User Sidebar */}
            <div className="col-xl-3 theiaStickySidebar">
              <div className="card">
                <div className="card-body p-3">
                  <h6 className="mb-3 fw-semibold">Basic Information</h6>
                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-3">
                      <span className="avatar avatar-xs bg-light-300 p-0 flex-shrink-0 rounded-circle text-dark me-2">
                        <i className="ti ti-mail" />
                      </span>
                      <p>{userDetail?.email}</p>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <span className="avatar avatar-xs bg-light-300 p-0 flex-shrink-0 rounded-circle text-dark me-2">
                        <i className="ti ti-phone" />
                      </span>
                      <p>{userDetail?.phone}</p>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <span className="avatar avatar-xs bg-light-300 p-0 flex-shrink-0 rounded-circle text-dark me-2">
                        <i className="ti ti-map-pin" />
                      </span>
                      <p>{userDetail?.address}</p>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <span className="avatar avatar-xs bg-light-300 p-0 flex-shrink-0 rounded-circle text-dark me-2">
                        <i className="ti ti-calendar-exclamation" />
                      </span>
                      <p>Created at {DateFormat(userDetail?.createdate)}</p>
                    </div>
                  </div>
                  <hr />
                </div>
              </div>
            </div>
            {/* /User Sidebar */}
            {/* User Activities */}
            <UserActivities user={userDetail?.full_name}/>
            {/* /User Activities */}
          </div>
        </div>
        {/* // }  */}
      </div>
      {/* /Page Wrapper */}
      {/* Delete User */}
      <DeleteAlert
        label="User"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        selectedUser={userDetail}
        onDelete={deleteData}
      />
      {/* /Delete User */}

      {/* Edit User */}
      <EditUserModal user={userDetail} />
      {/* /Edit User */}
    </>
  );
};

export default UserDetail;
