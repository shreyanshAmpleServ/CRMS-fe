import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";
import { useDispatch, useSelector } from "react-redux";
import ImageWithBasePath from "../../components/common/imageWithBasePath";
import CollapseHeader from "../../components/common/collapse-header";
import { fetchCompanyById, deleteCompany } from "../../redux/companies";
import EditCompanyModal from "./modal/EditProjectModal";
import DeleteAlert from "./alert/DeleteAlert";
import DateFormat from "../../utils/DateFormat";
import ProjectActvities from "./modal/ProjectActvities";
import { useNavigate } from "react-router-dom";
import { deleteProject, fetchProjectById } from "../../redux/projects";
import moment from "moment";
import EditProjectModal from "./modal/EditProjectModal";
const ProjectDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch the contact details when the component mounts
    dispatch(fetchProjectById(id));
  }, [id, dispatch]);
  // Get the contact details from Redux store
  const { projectDetail,loading} = useSelector(
    (state) => state.projects
  );

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
  const handleDeleteCompany = () => {
    setShowDeleteModal(true);
  };
  const deleteData = () => {
    if (projectDetail) {
      dispatch(deleteProject(projectDetail.id)); // Dispatch the delete action
      // navigate(`/companies`); // Navigate to the specified route
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
      {loading ? (
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
        ) :
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              {/* Page Header */}
              <div className="page-header">
                <div className="row align-items-center">
                  <div className="col-sm-4">
                    <h4 className="page-title">Project</h4>
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
              {/* Contact User */}
              <div className="contact-head">
                <div className="row align-items-center">
                  <div className="col-sm-6">
                    <ul className="contact-breadcrumb">
                      <li>
                        <Link to={route.contactGrid}>
                          <i className="ti ti-arrow-narrow-left" />
                          Project
                        </Link>
                      </li>
                      <li>{projectDetail?.name}</li>
                    </ul>
                  </div>
                  <div className="col-sm-6 text-sm-end">
                    <div className="contact-pagination">
                      <ul>
                        <li>
                          <Link to={route.projectDetails}>
                            <i className="ti ti-chevron-left" />
                          </Link>
                        </li>
                        <li>
                          <Link to={route.projectDetails}>
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
                      {/* <div className="avatar avatar-xxl online online-sm me-3 flex-shrink-0">
                        {projectDetail?.logo ? (
                          <img
                            src={projectDetail?.logo}
                            alt="Company Logo"
                            className="preview"
                          />
                        ) : (
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-14.jpg"
                            alt="Company Logo"
                          />
                        )}
                        <span className="status online" />
                      </div> */}
                      <div>
                        <h5 className="mb-1">{projectDetail?.name}</h5>
                        <p className="mb-2">{projectDetail?.projectTiming}</p>
                      </div>
                    </div>
                    <div className="contacts-action">
                      <Link
                        to="#"
                        className="btn-icon"
                         data-bs-toggle="offcanvas"
              data-bs-target="#offcanvas_edit_project"
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
                            onClick={() => handleDeleteCompany(true)}
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
              {/* /Contact User */}
            </div>
            {/* Contact Sidebar */}
            <div className="col-xl-3 theiaStickySidebar">
              <div className="card">
                <div className="card-body p-3">
                  <h6 className="mb-3 fw-semibold">Basic Information</h6>
                  <div className="mb-3">
                    <div className="row mb-3">
                      <span className="col-6">Timing</span>
                      <span className="col-6" style={{ fontSize: "13px" }}>
                        {projectDetail?.projectTiming}
                      </span>
                    </div>
                    <div className="row mb-3">
                      <span className="col-6">Budget</span>
                      <span className="col-6" style={{ fontSize: "13px" }}>
                        {projectDetail?.amount}
                      </span>
                    </div>

                    <div className="row mb-3">
                      <span className="col-6">Start Date</span>
                      <span className="col-6 " style={{ fontSize: "13px" }}>
                        {moment(projectDetail?.startDate).format("ll")}
                      </span>
                    </div>
                    <div className="row mb-3">
                      <span className="col-6">Due Date</span>
                      <span className="col-6" style={{ fontSize: "13px" }}>
                        {moment(projectDetail?.dueDate).format("ll")}
                      </span>
                    </div>
                    <div className="row mb-3">
                      <span className="col-6">Created at</span>
                      <span className="col-6" style={{ fontSize: "13px" }}>
                        {moment(projectDetail?.createdDate).format("ll")}
                      </span>
                    </div>
                  </div>
                  <hr />
                </div>
              </div>
            </div>
            {/* /Contact Sidebar */}
            {/* Contact Details */}
            <ProjectActvities />
            {/* /Contact Details */}
          </div>
        </div>}
      </div>
      {/* /Page Wrapper */}
      {/* Delete Contact */}
      {/* Include the Delete Contact Modal */}
      <DeleteAlert
        label="Project"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        selectedCompany={projectDetail}
        onDelete={deleteData}
      />
      {/* /Delete Contact */}

      {/* Edit Contact */}
      <EditProjectModal project={projectDetail} />
      {/* /Edit Contact */}
    </>
  );
};

export default ProjectDetail;
