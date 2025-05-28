import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Select from "react-select";
import DefaultEditor from "react-simple-wysiwyg";
import CollapseHeader from "../../components/common/collapse-header";
import { ActivityDetailOfUser } from "../../components/common/detailPages/UserDetails/activityDetails";
import { CallsDetailsOfUser } from "../../components/common/detailPages/UserDetails/callsDetails";
import ImageWithDatabase from "../../components/common/ImageFromDatabase";
import ImageWithBasePath from "../../components/common/imageWithBasePath";
import {
  accountType,
  ascendingandDecending,
  documentType,
  LocaleData,
  statusList
} from "../../components/common/selectoption/selectoption";
import { SelectWithImage2 } from "../../components/common/selectWithImage2";
import {
  fetchContactById
} from "../../redux/contacts/contactSlice";
import { fetchLostReasons } from "../../redux/lostReasons";
import { all_routes } from "../../routes/all_routes";
import DateFormat from "../../utils/DateFormat";
import AddCompanyModal from "../companies/modal/AddCompanyModal";
import AddDealModal from "../deals/modal/AddDealModal";
import DeleteAlert from "./alert/DeleteAlert";
import EditContactModal from "./modal/EditContactModal";
import FilesDetails from "../../components/common/detailPages/UserDetails/FilesDetails";

const ContactDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchContactById(id));
    dispatch(fetchLostReasons());
  }, [id, dispatch]);
  

  // Get the contact details from Redux store
  const { contactDetail, loading } = useSelector((state) => state.contacts);
  const {lostReasons: contactStatus} = useSelector((state) => state.lostReasons);

  const route = all_routes;

  const dealsopen = [
    { value: "choose", label: "Choose" },
    { value: "collins", label: "Collins" },
    { value: "konopelski", label: "Konopelski" },
    { value: "adams", label: "Adams" },
    { value: "schumm", label: "Schumm" },
    { value: "wisozk", label: "Wisozk" },
  ];
  const badgeClasses = [
    "badge-soft-success",
    "badge-soft-warning",
    "badge-soft-info",
    "badge-soft-danger",
    "badge-soft-primary",
    "badge-soft-secondary",
  ];
  const getRandomClass = () => {
    return badgeClasses[Math.floor(Math.random() * badgeClasses.length)];
  };
  const tagsArray = contactDetail?.tags
    ? contactDetail.tags.split(",").map((tag) => tag.trim())
    : [];
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleDeleteContact = () => {
    setShowDeleteModal(true);
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
         ( <div className="content">
          <div className="row">
            <div className="col-md-12">
              {/* Page Header */}
              <div className="page-header">
                <div className="row align-items-center">
                  <div className="col-sm-4">
                    <h4 className="page-title">Contacts</h4>
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
                          Contacts
                        </Link>
                      </li>
                      <li>{`${contactDetail?.firstName} ${contactDetail?.lastName}`}</li>
                    </ul>
                  </div>
                  <div className="col-sm-6 text-sm-end">
                    <div className="contact-pagination">
                      <p>1 of 40</p>
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
                        <img
                          src="https://www.ampleserv.com/public/images/1718694633.png"
                          alt="img"
                        />
                        <span className="status online" />
                      </div>
                      <div>
                        <h5 className="mb-1">
                          {`${contactDetail?.firstName} ${contactDetail?.lastName}`}{" "}
                          <span className="star-icon">
                            <i className="fa-solid fa-star" />
                          </span>
                        </h5>
                        <p className="mb-2">
                          {" "}
                          <i className="ti ti-building" />{" "}
                          {contactDetail?.jobTitle +
                            "  ( " +
                            contactDetail?.company_details?.name +
                            " )"}
                        </p>
                        <p className="mb-0">
                          {" "}
                          <i className="ti ti-map-pin-pin" />{" "}
                          {`${contactDetail?.streetAddress}, ${contactDetail?.city}, ${contactDetail?.state}, ${contactDetail?.country}, ${contactDetail?.zipcode}`}
                        </p>
                      </div>
                    </div>
                    <div className="contacts-action">
                      <Link
                        to="#"
                        className="btn btn-danger"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvas_add_deal"
                      >
                        <i className="ti ti-circle-plus" />
                        Add Deal
                      </Link>
                      <Link
                        to="#"
                        className="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#add_compose"
                      >
                        <i className="ti ti-mail" />
                        Send Email
                      </Link>
                      <Link to={route.chat} className="btn-icon">
                        <i className="ti ti-brand-hipchat" />
                      </Link>
                      <Link
                        to="#"
                        className="btn-icon"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvas_edit"
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
                            onClick={() => handleDeleteContact(true)}
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
                    <div className="d-flex align-items-center mb-3">
                      <span className="avatar avatar-xs bg-light-300 p-0 flex-shrink-0 rounded-circle text-dark me-2">
                        <i className="ti ti-mail" />
                      </span>
                      <p className="text-break">{contactDetail?.email}</p>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <span className="avatar avatar-xs bg-light-300 p-0 flex-shrink-0 rounded-circle text-dark me-2">
                        <i className="ti ti-phone" />
                      </span>
                      <p>{contactDetail?.phone1}</p>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <span className="avatar avatar-xs bg-light-300 p-0 flex-shrink-0 rounded-circle text-dark me-2">
                        <i className="ti ti-map-pin" />
                      </span>
                      <p>{contactDetail?.streetAddress}</p>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <span className="avatar avatar-xs bg-light-300 p-0 flex-shrink-0 rounded-circle text-dark me-2">
                        <i className="ti ti-calendar-exclamation" />
                      </span>
                      <p>Created on {DateFormat(contactDetail?.createdate)}</p>
                    </div>
                  </div>
                  <hr />
                  <h6 className="mb-3 fw-semibold">Other Information</h6>
                  <ul>
                    <li className="row mb-3">
                      <span className="col-6">Language</span>
                      <span className="col-6">{contactDetail?.language}</span>
                    </li>
                    <li className="row mb-3">
                      <span className="col-6">Currency</span>
                      <span className="col-6">{contactDetail?.currency}</span>
                    </li>
                    <li className="row mb-3">
                      <span className="col-6">Last Modified</span>
                      <span className="col-6">
                        {DateFormat(contactDetail?.updatedate)}
                      </span>
                    </li>
                    <li className="row mb-3">
                      <span className="col-6">Source</span>
                      <span className="col-6">{contactDetail?.source_details?.name || " - - "}</span>
                    </li>
                  </ul>
                  <hr />
                  <h6 className="mb-3 fw-semibold">Tags</h6>
                  <div className="mb-3">
                    {tagsArray.map((tag, index) => (
                      <Link
                        to="#"
                        key={index} // Use index as key
                        className={`badge ${getRandomClass()} fw-medium me-2 mb-1`}
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                  <hr />
                  <div className="d-flex align-items-center justify-content-between flex-wrap">
                    <h6 className="mb-3 fw-semibold">Company</h6>
                    <Link
                      to="#"
                      className="link-purple mb-3"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvas_add_company"
                    >
                      <i className="ti ti-circle-plus me-1" />
                      Add New
                    </Link>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex align-items-center">
                      <span className="avatar avatar-lg rounded me-2 border">
                        {contactDetail?.company_details?.logo ? 
                        <ImageWithDatabase
                          src={contactDetail?.company_details.logo}
                          alt="img" 
                          className="img-fluid w-auto h-auto"/> :
                        <ImageWithBasePath
                          src="assets/img/icons/google-icon.svg"
                          alt=""
                          className="img-fluid w-auto h-auto"
                        />}
                      </span>
                      <div>
                        <h6 className="fw-medium d-flex mb-1 text-capitalize">
                        <div style={{width:'90%'}} className=""> {contactDetail?.company_details?.name}{" "}</div>
                          <i className="fa-solid fa-circle-check text-success" />
                        </h6>
                        <p> {contactDetail?.company_details?.website}</p>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <h6 className="mb-3 fw-semibold">Social Profile</h6>
                  
                  <ul className="social-info">
                    {contactDetail?.socialProfiles &&
                      Object.entries(JSON.parse(contactDetail?.socialProfiles)).map(
                        ([platform, url]) =>
                          url ? ( // Only render if a URL exists
                            <li key={platform}>
                              <Link
                                to={url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {/* {platform + " "+ url} */}
                                
                                <i className={socialIcons[platform]} />
                              </Link>
                            </li>
                          ) : null
                      )}
                  </ul>
                  <hr />
                  {/* <h6 className="mb-3 fw-semibold">Settings</h6>
                  <div className="mb-0">
                    <Link to="#" className="d-block mb-3">
                      <i className="ti ti-share-2 me-1" />
                      Share Contact
                    </Link>
                    <Link to="#" className="d-block mb-3">
                      <i className="ti ti-star me-1" />
                      Add to Favourite
                    </Link>
                    <Link
                      to="#"
                      className="d-block mb-0"
                      onClick={() => handleDeleteContact(true)}
                    >
                      <i className="ti ti-trash-x me-1" />
                      Delete Contact
                    </Link>
                  </div> */}
                </div>
              </div>
            </div>
            {/* /Contact Sidebar */}
            {/* Contact Details */}
            <div className="col-xl-9">
              <div className="card mb-3">
                <div className="card-body pb-0 pt-2">
                  {contactStatus && (
                    <div className="pipeline-list">
                      <ul>
                        {contactStatus.map((item) => (
                          <li key={item.id}>
                            <Link
                              to="#"
                              style={{
                                backgroundColor: item.colorCode,
                                color: "#fff",
                              }}
                            >
                              {item.name.trim()}
                              <span
                                style={{
                                  content: "''",
                                  position: "absolute",
                                  top: 0,
                                  right: "-23px",
                                  width: "45px",
                                  height: "45px",
                                  transform: "scale(0.707) rotate(45deg)",
                                  zIndex: 1,
                                  background: item.colorCode,
                                  borderRadius: "0 5px 0 50px",
                                }}
                              ></span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <ul className="nav nav-tabs nav-tabs-bottom" role="tablist">
                    <li className="nav-item" role="presentation">
                      <Link
                        to="#"
                        data-bs-toggle="tab"
                        data-bs-target="#activities"
                        className="nav-link active"
                      >
                        <i className="ti ti-alarm-minus me-1" />
                        Activities
                      </Link>
                    </li>
                    {/* <li className="nav-item" role="presentation">
                      <Link
                        to="#"
                        data-bs-toggle="tab"
                        data-bs-target="#notes"
                        className="nav-link"
                      >
                        <i className="ti ti-notes me-1" />
                        Notes
                      </Link>
                    </li> */}
                    <li className="nav-item" role="presentation">
                      <Link
                        to="#"
                        data-bs-toggle="tab"
                        data-bs-target="#calls"
                        className="nav-link"
                      >
                        <i className="ti ti-phone me-1" />
                        Calls
                      </Link>
                    </li>
                    <li className="nav-item" role="presentation">
                      <Link
                        to="#"
                        data-bs-toggle="tab"
                        data-bs-target="#files"
                        className="nav-link"
                      >
                        <i className="ti ti-file me-1" />
                        Files
                      </Link>
                    </li>
                    {/* <li className="nav-item" role="presentation">
                      <Link
                        to="#"
                        data-bs-toggle="tab"
                        data-bs-target="#email"
                        className="nav-link"
                      >
                        <i className="ti ti-mail-check me-1" />
                        Email
                      </Link>
                    </li> */}
                  </ul>
                </div>
              </div>
              {/* Tab Content */}
              <div className="tab-content pt-0">
                {/* Activities */}
                   <ActivityDetailOfUser contact_id={id}  />
              
                {/* Calls */}
                <CallsDetailsOfUser contact_id={id}/>
                {/* Files */}
                <FilesDetails type="Contacts" type_id={id} type_name={`${contactDetail?.firstName} ${contactDetail?.lastName}`} />
                {/* <div className="tab-pane fade" id="files">
                  <div className="card">
                    <div className="card-header">
                      <h4 className="fw-semibold">Files</h4>
                    </div>
                    <div className="card-body">
                      <div className="card border mb-3">
                        <div className="card-body pb-0">
                          <div className="row align-items-center">
                            <div className="col-md-8">
                              <div className="mb-3">
                                <h4 className="fw-medium mb-1">
                                  Manage Documents
                                </h4>
                                <p>
                                  Send customizable quotes, proposals and
                                  contracts to close deals faster.
                                </p>
                              </div>
                            </div>
                            <div className="col-md-4 text-md-end">
                              <div className="mb-3">
                                <Link
                                  to="#"
                                  className="btn btn-primary"
                                  data-bs-toggle="modal"
                                  data-bs-target="#new_file"
                                >
                                  Create Document
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card border shadow-none mb-3">
                        <div className="card-body pb-0">
                          <div className="row align-items-center">
                            <div className="col-md-8">
                              <div className="mb-3">
                                <h4 className="fw-medium mb-1">
                                  Collier-Turner Proposal
                                </h4>
                                <p>
                                  Send customizable quotes, proposals and
                                  contracts to close deals faster.
                                </p>
                                <div className="d-flex align-items-center">
                                  <span className="avatar avatar-md me-2 flex-shrink-0">
                                    <ImageWithBasePath
                                      src="assets/img/profiles/avatar-21.jpg"
                                      alt="img"
                                      className="rounded-circle"
                                    />
                                  </span>
                                  <div>
                                    <span className="fs-12">Owner</span>
                                    <p>Vaughan</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4 text-md-end">
                              <div className="mb-3 d-inline-flex align-items-center">
                                <span className="badge badge-danger-light me-1">
                                  Proposal
                                </span>
                                <span className="badge bg-pending priority-badge me-1">
                                  Draft
                                </span>
                                <div className="dropdown">
                                  <Link
                                    to="#"
                                    className="p-0 btn btn-icon btn-sm d-flex align-items-center justify-content-center"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <i className="ti ti-dots-vertical" />
                                  </Link>
                                  <div className="dropdown-menu dropdown-menu-right">
                                    <Link className="dropdown-item" to="#">
                                      <i className="ti ti-edit text-blue me-1" />
                                      Edit
                                    </Link>
                                    <Link className="dropdown-item" to="#">
                                      <i className="ti ti-trash text-danger me-1" />
                                      Delete
                                    </Link>
                                    <Link className="dropdown-item" to="#">
                                      <i className="ti ti-download text-info me-1" />
                                      Download
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card border shadow-none mb-3">
                        <div className="card-body pb-0">
                          <div className="row align-items-center">
                            <div className="col-md-8">
                              <div className="mb-3">
                                <h4 className="fw-medium mb-1">
                                  Collier-Turner Proposal
                                </h4>
                                <p>
                                  Send customizable quotes, proposals and
                                  contracts to close deals faster.
                                </p>
                                <div className="d-flex align-items-center">
                                  <span className="avatar avatar-md me-2 flex-shrink-0">
                                    <ImageWithBasePath
                                      src="assets/img/profiles/avatar-01.jpg"
                                      alt="img"
                                      className="rounded-circle"
                                    />
                                  </span>
                                  <div>
                                    <span className="fs-12">Owner</span>
                                    <p>Jessica</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4 text-md-end">
                              <div className="mb-3 d-inline-flex align-items-center">
                                <span className="badge badge-purple-light me-1">
                                  Quote
                                </span>
                                <span className="badge bg-success me-1">
                                  Sent
                                </span>
                                <div className="dropdown">
                                  <Link
                                    to="#"
                                    className="p-0 btn btn-icon btn-sm d-flex align-items-center justify-content-center"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <i className="ti ti-dots-vertical" />
                                  </Link>
                                  <div className="dropdown-menu dropdown-menu-right">
                                    <Link className="dropdown-item" to="#">
                                      <i className="ti ti-edit text-blue me-1" />
                                      Edit
                                    </Link>
                                    <Link className="dropdown-item" to="#">
                                      <i className="ti ti-trash text-danger me-1" />
                                      Delete
                                    </Link>
                                    <Link className="dropdown-item" to="#">
                                      <i className="ti ti-download text-info me-1" />
                                      Download
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card border shadow-none mb-0">
                        <div className="card-body pb-0">
                          <div className="row align-items-center">
                            <div className="col-md-8">
                              <div className="mb-3">
                                <h4 className="fw-medium mb-1">
                                  Collier-Turner Proposal
                                </h4>
                                <p>
                                  Send customizable quotes, proposals and
                                  contracts to close deals faster.
                                </p>
                                <div className="d-flex align-items-center">
                                  <span className="avatar avatar-md me-2 flex-shrink-0">
                                    <ImageWithBasePath
                                      src="assets/img/profiles/avatar-22.jpg"
                                      alt="img"
                                      className="rounded-circle"
                                    />
                                  </span>
                                  <div>
                                    <span className="fs-12">Owner</span>
                                    <p>Dawn Merhca</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4 text-md-end">
                              <div className="mb-3 d-inline-flex align-items-center">
                                <span className="badge badge-danger-light me-1">
                                  Proposal
                                </span>
                                <span className="badge bg-pending priority-badge me-1">
                                  Draft
                                </span>
                                <div className="dropdown">
                                  <Link
                                    to="#"
                                    className="p-0 btn btn-icon btn-sm d-flex align-items-center justify-content-center"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <i className="ti ti-dots-vertical" />
                                  </Link>
                                  <div className="dropdown-menu dropdown-menu-right">
                                    <Link className="dropdown-item" to="#">
                                      <i className="ti ti-edit text-blue me-1" />
                                      Edit
                                    </Link>
                                    <Link className="dropdown-item" to="#">
                                      <i className="ti ti-trash text-danger me-1" />
                                      Delete
                                    </Link>
                                    <Link className="dropdown-item" to="#">
                                      <i className="ti ti-download text-info me-1" />
                                      Download
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                /Files */}
                {/* Email */}
                <div className="tab-pane fade" id="email">
                  <div className="card">
                    <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                      <h4 className="fw-semibold">Email</h4>
                      <div className="d-inline-flex align-items-center">
                        <OverlayTrigger
                          placement="left"
                          overlay={
                            <Tooltip id="refresh-tooltip">
                              There are no email accounts configured, Please
                              configured your email account in order to Send/
                              Create EMails
                            </Tooltip>
                          }
                        >
                          <Link to="#">
                            <i className="ti ti-circle-plus me-1" />
                            Create Email
                          </Link>
                        </OverlayTrigger>
                        {/* <Link
                        to="#"
                        className="link-purple fw-medium"
                        data-bs-toggle="tooltip"
                        data-bs-placement="left"
                        data-bs-custom-class="tooltip-dark"
                        data-bs-original-title=""
                      >
                        <i className="ti ti-circle-plus me-1" />
                        Create Email
                      </Link> */}
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="card border mb-0">
                        <div className="card-body pb-0">
                          <div className="row align-items-center">
                            <div className="col-md-8">
                              <div className="mb-3">
                                <h4 className="fw-medium mb-1">
                                  Manage Emails
                                </h4>
                                <p>
                                  You can send and reply to emails directly via
                                  this section.
                                </p>
                              </div>
                            </div>
                            <div className="col-md-4 text-md-end">
                              <div className="mb-3">
                                <Link
                                  to="#"
                                  className="btn btn-primary"
                                  data-bs-toggle="modal"
                                  data-bs-target="#create_email"
                                >
                                  Connect Account
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Email */}
              </div>
              {/* /Tab Content */}
            </div>
            {/* /Contact Details */}
          </div>
        </div>)
        {/* {loading && <div style={{zIndex:9999, paddingTop:'20%',paddingLeft:"35%",width:"100%",marginLeft:"0%",  minHeight:"100vh",  backgroundColor: 'rgb(255, 255, 255)'}}  
          className=" position-fixed  w-screen  top-0   bg-gray  ">
          <div
            className="spinner-border position-absolute d-flex justify-content-center  text-primary"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          </div>} */}
      </div>
      <DeleteAlert
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        selectedContact={contactDetail}
      />
      {/* /Delete Contact */}
      {/* Create Deal */}
      <div
        className="modal custom-modal fade"
        id="create_success"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0 m-0 justify-content-end">
              <button
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <div className="success-message text-center">
                <div className="success-popup-icon bg-light-blue">
                  <i className="ti ti-building" />
                </div>
                <h3>Deal Created Successfully!!!</h3>
                <p>View the details of deal, created</p>
                <div className="col-lg-12 text-center modal-btn">
                  <Link
                    to="#"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link
                    to={route.contactDetails}
                    data-bs-dismiss="modal"
                    className="btn btn-primary"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Create Deal */}
      {/* Add Note */}
      <div
        className="modal custom-modal fade modal-padding"
        id="add_notes"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Notes</h5>
              <button
                type="button"
                className="btn-close position-static"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form action={route.contactDetails}>
                <div className="mb-3">
                  <label className="col-form-label">
                    Title <span className="text-danger"> *</span>
                  </label>
                  <input className="form-control" type="text" />
                </div>
                <div className="mb-3">
                  <label className="col-form-label">
                    Note <span className="text-danger"> *</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows={4}
                    defaultValue={""}
                  />
                </div>
                <div className="mb-3">
                  <label className="col-form-label">
                    Attachment <span className="text-danger"> *</span>
                  </label>
                  <div className="drag-attach">
                    <input type="file" />
                    <div className="img-upload">
                      <i className="ti ti-file-broken" />
                      Upload File
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="col-form-label">Uploaded Files</label>
                  <div className="upload-file">
                    <h6>Projectneonals teyys.xls</h6>
                    <p>4.25 MB</p>
                    <div className="progress">
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: "25%" }}
                        aria-valuenow={25}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                    <p className="black-text">45%</p>
                  </div>
                  <div className="upload-file upload-list">
                    <div>
                      <h6>tes.txt</h6>
                      <p>4.25 MB</p>
                    </div>
                    <Link to="#" className="text-danger">
                      <i className="ti ti-trash-x" />
                    </Link>
                  </div>
                </div>
                <div className="col-lg-12 text-end modal-btn">
                  <Link
                    to="#"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <button className="btn btn-primary" type="submit">
                    Confirm
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Note */}
      {/* Create Call Log */}
      <div
        className="modal custom-modal fade modal-padding"
        id="create_call"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create Call Log</h5>
              <button
                type="button"
                className="btn-close position-static"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form action={route.contactDetails}>
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="col-form-label">
                        Status <span className="text-danger"> *</span>
                      </label>
                      <Select
                        className="select2"
                        options={statusList}
                        placeholder="Choose"
                        classNamePrefix="react-select"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="col-form-label">
                        Follow Up Date <span className="text-danger"> *</span>
                      </label>
                      <div className="icon-form">
                        <span className="form-icon">
                          <i className="ti ti-calendar-check" />
                        </span>
                        <input
                          type="text"
                          className="form-control datetimepicker"
                          placeholder=""
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="col-form-label">
                        Note <span className="text-danger"> *</span>
                      </label>
                      <textarea
                        className="form-control"
                        rows={4}
                        placeholder="Add text"
                        defaultValue={""}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" /> Create a followup task
                      </label>
                    </div>
                    <div className="text-end modal-btn">
                      <Link
                        to="#"
                        className="btn btn-light"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </Link>
                      <button className="btn btn-primary" type="submit">
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Create Call Log */}
      {/* Add File */}
      <div
        className="modal custom-modal fade custom-modal-two modal-padding"
        id="new_file"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create New File</h5>
              <button
                type="button"
                className="btn-close position-static"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="add-info-fieldset">
                <div className="add-details-wizard">
                  <ul className="progress-bar-wizard">
                    <li className="active">
                      <span>
                        <i className="ti ti-file" />
                      </span>
                      <div className="multi-step-info">
                        <h6>Basic Info</h6>
                      </div>
                    </li>
                    <li>
                      <span>
                        <i className="ti ti-circle-plus" />
                      </span>
                      <div className="multi-step-info">
                        <h6>Add Recipient</h6>
                      </div>
                    </li>
                  </ul>
                </div>
                <fieldset id="first-field-file">
                  <form action={route.contactDetails}>
                    <div className="contact-input-set">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="mb-3">
                            <label className="col-form-label">
                              Choose Deal <span className="text-danger">*</span>
                            </label>
                            <Select
                              className="select2"
                              options={dealsopen}
                              placeholder="Choose"
                              classNamePrefix="react-select"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="col-form-label">
                              Document Type{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <Select
                              className="select2"
                              options={documentType}
                              placeholder="Choose"
                              classNamePrefix="react-select"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="col-form-label">
                              Owner <span className="text-danger">*</span>
                            </label>
                            <SelectWithImage2 />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="col-form-label">
                              Title <span className="text-danger"> *</span>
                            </label>
                            <input className="form-control" type="text" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="col-form-label">
                              Locale <span className="text-danger">*</span>
                            </label>
                            <Select
                              className="select2"
                              options={LocaleData}
                              placeholder="Choose"
                              classNamePrefix="react-select"
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="signature-wrap">
                            <h4>Signature</h4>
                            <ul className="nav sign-item">
                              <li className="nav-item">
                                <span
                                  className=" mb-0"
                                  data-bs-toggle="tab"
                                  data-bs-target="#nosign"
                                >
                                  <input
                                    type="radio"
                                    className="status-radio"
                                    id="sign1"
                                    name="email"
                                  />
                                  <label htmlFor="sign1">
                                    <span className="sign-title">
                                      No Signature
                                    </span>
                                    This document does not require a signature
                                    before acceptance.
                                  </label>
                                </span>
                              </li>
                              <li className="nav-item">
                                <span
                                  className="active mb-0"
                                  data-bs-toggle="tab"
                                  data-bs-target="#use-esign"
                                >
                                  <input
                                    type="radio"
                                    className="status-radio"
                                    id="sign2"
                                    name="email"
                                    defaultChecked
                                  />
                                  <label htmlFor="sign2">
                                    <span className="sign-title">
                                      Use e-signature
                                    </span>
                                    This document require e-signature before
                                    acceptance.
                                  </label>
                                </span>
                              </li>
                            </ul>
                            <div className="tab-content">
                              <div
                                className="tab-pane show active"
                                id="use-esign"
                              >
                                <div className="input-block mb-0">
                                  <label className="col-form-label">
                                    Document Signers{" "}
                                    <span className="text-danger">*</span>
                                  </label>
                                </div>
                                <div className="sign-content">
                                  <div className="row">
                                    <div className="col-md-6">
                                      <div className="mb-3">
                                        <input
                                          className="form-control"
                                          type="text"
                                          placeholder="Enter Name"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-6">
                                      <div className="d-flex align-items-center">
                                        <div className="float-none mb-3 me-3 w-100">
                                          <input
                                            className="form-control"
                                            type="text"
                                            placeholder="Email Address"
                                          />
                                        </div>
                                        <div className="input-btn mb-3">
                                          <Link to="#" className="add-sign">
                                            <i className="ti ti-circle-plus" />
                                          </Link>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="input-block mb-3">
                            <label className="col-form-label">
                              Content <span className="text-danger"> *</span>
                            </label>
                            <textarea
                              className="form-control"
                              rows={3}
                              placeholder="Add Content"
                              defaultValue={""}
                            />
                          </div>
                        </div>
                        <div className="col-lg-12 text-end form-wizard-button modal-btn">
                          <button className="btn btn-light" type="reset">
                            Reset
                          </button>
                          <button
                            className="btn btn-primary wizard-next-btn"
                            type="button"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </fieldset>
                <fieldset>
                  <form action={route.contactDetails}>
                    <div className="contact-input-set">
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="signature-wrap">
                            <h4 className="mb-2">
                              Send the document to following signers
                            </h4>
                            <p>In order to send the document to the signers</p>
                            <div className="input-block mb-0">
                              <label className="col-form-label">
                                Recipients (Additional recipients)
                              </label>
                            </div>
                            <div className="sign-content">
                              <div className="row">
                                <div className="col-md-6">
                                  <div className="mb-3">
                                    <input
                                      className="form-control"
                                      type="text"
                                      placeholder="Enter Name"
                                    />
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="d-flex align-items-center">
                                    <div className="float-none mb-3 me-3 w-100">
                                      <input
                                        className="form-control"
                                        type="text"
                                        placeholder="Email Address"
                                      />
                                    </div>
                                    <div className="input-btn mb-3">
                                      <Link to="#" className="add-sign">
                                        <i className="ti ti-circle-plus" />
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="mb-3">
                            <label className="col-form-label">
                              Message Subject{" "}
                              <span className="text-danger"> *</span>
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Enter Subject"
                            />
                          </div>
                          <div className="mb-3">
                            <label className="col-form-label">
                              Message Text{" "}
                              <span className="text-danger"> *</span>
                            </label>
                            <textarea
                              className="form-control"
                              rows={3}
                              placeholder="Your document is ready"
                              defaultValue={""}
                            />
                          </div>
                          <button className="btn btn-light mb-3">
                            Send Now
                          </button>
                          <div className="send-success">
                            <p>
                              <i className="ti ti-circle-check" /> Document sent
                              successfully to the selected recipients
                            </p>
                          </div>
                        </div>
                        <div className="col-lg-12 text-end form-wizard-button modal-btn">
                          <button className="btn btn-light" type="reset">
                            Cancel
                          </button>
                          <button
                            className="btn btn-primary"
                            type="button"
                            data-bs-dismiss="modal"
                          >
                            Save &amp; Next
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </fieldset>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Add File */}
      {/* Connect Account */}
      <div className="modal custom-modal fade" id="create_email" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Connect Account</h5>
              <button
                type="button"
                className="btn-close position-static"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="col-form-label">
                  Account type <span className="text-danger"> *</span>
                </label>
                <Select
                  className="select2"
                  options={accountType}
                  placeholder="Choose"
                  classNamePrefix="react-select"
                />
              </div>
              <div className="mb-3">
                <h5 className="form-title">Sync emails from</h5>
                <div className="sync-radio">
                  <div className="radio-item">
                    <input
                      type="radio"
                      className="status-radio"
                      id="test1"
                      name="radio-group"
                      defaultChecked
                    />
                    <label htmlFor="test1">Now</label>
                  </div>
                  <div className="radio-item">
                    <input
                      type="radio"
                      className="status-radio"
                      id="test2"
                      name="radio-group"
                    />
                    <label htmlFor="test2">1 Month Ago</label>
                  </div>
                  <div className="radio-item">
                    <input
                      type="radio"
                      className="status-radio"
                      id="test3"
                      name="radio-group"
                    />
                    <label htmlFor="test3">3 Month Ago</label>
                  </div>
                  <div className="radio-item">
                    <input
                      type="radio"
                      className="status-radio"
                      id="test4"
                      name="radio-group"
                    />
                    <label htmlFor="test4">6 Month Ago</label>
                  </div>
                </div>
              </div>
              <div className="col-lg-12 text-end modal-btn">
                <Link to="#" className="btn btn-light" data-bs-dismiss="modal">
                  Cancel
                </Link>
                <button
                  className="btn btn-primary"
                  data-bs-target="#success_mail"
                  data-bs-toggle="modal"
                  data-bs-dismiss="modal"
                >
                  Connect Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Connect Account */}
      {/* Success Contact */}
      <div className="modal custom-modal fade" id="success_mail" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0 m-0 justify-content-end">
              <button
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <div className="success-message text-center">
                <div className="success-popup-icon bg-light-blue">
                  <i className="ti ti-mail-opened" />
                </div>
                <h3>Email Connected Successfully!!!</h3>
                <p>
                  Email Account is configured with “example@example.com”. Now
                  you can access email.
                </p>
                <div className="col-lg-12 text-center modal-btn">
                  <Link to={route.contactDetails} className="btn btn-primary">
                    Go to email
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Success Contact */}
      {/* Access */}
      <div className="modal custom-modal fade" id="access_view" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Access For</h5>
              <button
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <form action={route.contactDetails}>
                <div className="mb-2 icon-form">
                  <span className="form-icon">
                    <i className="ti ti-search" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search"
                  />
                </div>
                <div className="access-wrap">
                  <ul>
                    <li className="select-people-checkbox">
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" />
                        <span className="people-profile">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-19.jpg"
                            alt=""
                          />
                          <Link to="#">Darlee Robertson</Link>
                        </span>
                      </label>
                    </li>
                    <li className="select-people-checkbox">
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" />
                        <span className="people-profile">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-20.jpg"
                            alt=""
                          />
                          <Link to="#">Sharon Roy</Link>
                        </span>
                      </label>
                    </li>
                    <li className="select-people-checkbox">
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" />
                        <span className="people-profile">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-21.jpg"
                            alt=""
                          />
                          <Link to="#">Vaughan</Link>
                        </span>
                      </label>
                    </li>
                    <li className="select-people-checkbox">
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" />
                        <span className="people-profile">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-01.jpg"
                            alt=""
                          />
                          <Link to="#">Jessica</Link>
                        </span>
                      </label>
                    </li>
                    <li className="select-people-checkbox">
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" />
                        <span className="people-profile">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-16.jpg"
                            alt=""
                          />
                          <Link to="#">Carol Thomas</Link>
                        </span>
                      </label>
                    </li>
                    <li className="select-people-checkbox">
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" />
                        <span className="people-profile">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-22.jpg"
                            alt=""
                          />
                          <Link to="#">Dawn Mercha</Link>
                        </span>
                      </label>
                    </li>
                  </ul>
                </div>
                <div className="modal-btn text-end">
                  <Link
                    to="#"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <button type="submit" className="btn btn-primary">
                    Confirm
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Access */}
      {/* Add Compose */}
      <div className="modal custom-modal fade" id="add_compose" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Compose</h5>
              <button
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <form action="#">
                <div className="mb-3">
                  <input
                    type="email"
                    placeholder="To"
                    className="form-control"
                  />
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <input
                        type="email"
                        placeholder="Cc"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <input
                        type="email"
                        placeholder="Bcc"
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Subject"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <DefaultEditor className="summernote" />
                </div>
                <div className="mb-3">
                  <div className="text-center">
                    <button className="btn btn-primary">
                      <span>Send</span>
                      <i className="fa-solid fa-paper-plane ms-1" />
                    </button>
                    <button className="btn btn-primary ms-1" type="button">
                      <span>Draft</span>{" "}
                      <i className="fa-regular fa-floppy-disk ms-1" />
                    </button>
                    <button className="btn btn-primary ms-1" type="button">
                      <span>Delete</span>{" "}
                      <i className="fa-regular fa-trash-can ms-1" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Compose */}
      {/* Edit Contact */}
      <EditContactModal contact={contactDetail} />
      {/* /Edit Contact */}
      
     
      <AddCompanyModal />
      <AddDealModal  />
    </>
  );
};

export default ContactDetails;
