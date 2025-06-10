import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import CollapseHeader from "../../components/common/collapse-header";
import ImageWithBasePath from "../../components/common/imageWithBasePath";
import { deleteCompany, fetchCompanyById } from "../../redux/companies/";
import { all_routes } from "../../routes/all_routes";
import DateFormat from "../../utils/DateFormat";
import DeleteAlert from "./alert/DeleteAlert";
import ComapanyActvities from "./modal/ComapanyActvities";
import EditCompanyModal from "./modal/EditCompanyModal";
const CompanyDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch the contact details when the component mounts
    dispatch(fetchCompanyById(id));
  }, [id, dispatch]);
  // Get the contact details from Redux store
  const { companyDetail, loading, error } = useSelector(
    (state) => state.companies,
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
    if (companyDetail) {
      dispatch(deleteCompany(companyDetail.id)); // Dispatch the delete action
      navigate(`/crms/companies`); // Navigate to the specified route
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
      <div className="page-wrapper">
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
        ) : <div className="content">
          <div className="row">
            <div className="col-md-12">
              {/* Page Header */}
              <div className="page-header">
                <div className="row align-items-center">
                  <div className="col-sm-4">
                    <h4 className="page-title">Company</h4>
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
                          Company
                        </Link>
                      </li>
                      <li>{companyDetail?.name}</li>
                    </ul>
                  </div>
                  <div className="col-sm-6 text-sm-end">
                    <div className="contact-pagination">
                      <ul>
                        <li>
                          <Link to={route.contactDetails}>
                            <i className="ti ti-chevron-left" />
                          </Link>
                        </li>
                        <li>
                          <Link to={route.contactDetails}>
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
                        {companyDetail?.logo ? (
                          <img
                            src={companyDetail?.logo}
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
                      </div>
                      <div>
                        <h5 className="mb-1 text-capitalize">{companyDetail?.name}</h5>
                        <p className="mb-0 text-capitalize"> <i className="ti ti-building" />{companyDetail?.industryType}</p>
                        <p className="mb-0 text-capitalize"><i className="ti ti-map-pin-pin" /> {companyDetail?.address}</p>
                      </div>
                    </div>
                    <div className="contacts-action">
                      <Link
                        to="#"
                        className="btn-icon"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvas_edit_company"
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
            <div className="col-xl-3 theiaStickySidebar ">
              <div style={{height:"58vh"}}  className="card">
                <div   className="card-body p-3">
                  <h6 className="mb-3 fw-semibold">Basic Information</h6>
                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-3">
                      <span className="avatar avatar-xs bg-light-300 p-0 flex-shrink-0 rounded-circle text-dark me-2">
                        <i className="ti ti-mail" />
                      </span>
                      <p>{companyDetail?.email || "- -"}</p>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <span className="avatar avatar-xs bg-light-300 p-0 flex-shrink-0 rounded-circle text-dark me-2">
                        <i className="ti ti-phone" />
                      </span>
                      <p>{companyDetail?.phone || "- -"}</p>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <span className="avatar avatar-xs bg-light-300 p-0 flex-shrink-0 rounded-circle text-dark me-2">
                        <i className="ti ti-world" />
                      </span>
                      <p>
                        <a
                          href={companyDetail?.website || "- -"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-decoration-none text-primary"
                        >
                          {companyDetail?.website || "- -"}
                        </a>
                      </p>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <span className="avatar avatar-xs bg-light-300 p-0 flex-shrink-0 rounded-circle text-dark me-2">
                        <i className="ti ti-map-pin" />
                      </span>
                      <p>{companyDetail?.address || "- -"}</p>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <span className="avatar avatar-xs bg-light-300 p-0 flex-shrink-0 rounded-circle text-dark me-2">
                        <i className="ti ti-calendar-exclamation" />
                      </span>
                      <p>Created on {DateFormat(companyDetail?.createdDate)}</p>
                    </div>
                  </div>
                  <hr />
                </div>
              </div>
            </div>
            {/* /Contact Sidebar */}
            {/* Contact Details */}
            <ComapanyActvities company_id={id} company_name={companyDetail?.name} />
            {/* /Contact Details */}
          </div>
        </div>}
      </div>
      {/* /Page Wrapper */}
      {/* Delete Contact */}
      {/* Include the Delete Contact Modal */}
      <DeleteAlert
        label="Company"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        selectedCompany={companyDetail}
        onDelete={deleteData}
      />
      {/* /Delete Contact */}

      {/* Edit Contact */}
      <EditCompanyModal company={companyDetail} />
      {/* /Edit Contact */}
    </>
  );
};

export default CompanyDetail;
