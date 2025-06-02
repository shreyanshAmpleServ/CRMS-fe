import moment from "moment";
import React, { useEffect, useState } from "react";
import { Tooltip } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";

import { all_routes } from "../../routes/all_routes";

import { useDispatch, useSelector } from "react-redux";
import Breadcrumb from "../../components/common/detailPages/Breadcrumb";
import PageHeader from "../../components/common/detailPages/PageHeader";

import Actvities from "../../components/common/detailPages/Actvities";
import { base_path } from "../../config/environment";
import { fetchLeadById } from "../../redux/leads";
import { fetchLostReasons } from "../../redux/lostReasons";
import AddUserModal from "../user-management/manage-users/modal/AddUserModal";

const LeadsDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchLeadById(id));
    dispatch(fetchLostReasons());
  }, [id, dispatch]);

  const {
    leadDetail,
    loading: leadLoading,
  } = useSelector((state) => state.leads);

  const {
    lostReasons,
  } = useSelector((state) => state.lostReasons);
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
  const tagsArray = leadDetail?.tags
    ? leadDetail.tags.split(",").map((tag) => tag.trim())
    : [];

  return (
    <div>
      <div className="page-wrapper position-relative">
        {/* {leadLoading ? (
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
        ) : ( */}
          <div className="content">
            <div className="row">
              <div className="col-md-12">
                {/* Page Header */}
                <PageHeader title="Leads Overview" />
                {/* /Page Header */}
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                {/* Breadcrumbs */}

                <Breadcrumb
                  links={[
                    {
                      path: "/leads",
                      label: "Leads",
                      icon: "ti ti-arrow-narrow-left",
                    },
                    {
                      label: `${leadDetail?.first_name} ${leadDetail?.last_name}`,
                    },
                  ]}
                />
                {/* /Breadcrumbs */}
                {/* Lead Card */}
                <div className="card">
                  <div className="card-body pb-2">
                    <div className="d-flex align-items-center justify-content-between flex-wrap">
                      <div className="d-flex align-items-center mb-2">
                        <div className="avatar avatar-xxl me-3 flex-shrink-0 border p-2">
                          {leadDetail?.company_icon ? (
                            <img
                              src={leadDetail?.company_icon}
                              alt="Company Logo"
                              className="preview"
                            />
                          ) : (
                            <h6 className="text-default fw-medium">
                              {" "}
                              {leadDetail?.first_name?.charAt(0)}
                              {leadDetail?.last_name?.charAt(0)}
                            </h6>
                          )}
                        </div>
                        <div>
                          <h5 className="mb-1">
                            {`${leadDetail?.first_name} ${leadDetail?.last_name}`}{" "}
                            <span className="star-icon">
                              <i className="fa-solid fa-star" />
                            </span>
                          </h5>
                          <p className="mb-1">
                            <i className="ti ti-building" />{" "}
                            {`${leadDetail?.title}  ( ${leadDetail?.lead_company?.name} )`}
                          </p>
                          <p className="mb-0">
                            <i className="ti ti-map-pin-pin" />{" "}
                            {`${leadDetail?.street}, ${leadDetail?.city}, ${leadDetail?.state}, ${leadDetail?.country}, ${leadDetail?.zipcode}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Lead Card */}
              </div>
              {/* Deals Sidebar */}
              <div className="col-xl-3 theiaStickySidebar">
                <div className="card">
                  <div className="card-body p-3">
                    <h6 className="mb-3 fw-semibold">Deal Information</h6>
                    <ul>
                      <li className="row mb-3">
                        <span className="col-6">Date Created</span>
                        <span className="col-6">
                          {leadDetail?.createdate
                            ? moment(leadDetail?.createdate).format(
                                "DD MMM YYYY, hh:mm a"
                              )
                            : "N/A"}
                        </span>
                      </li>
                      <li className="row mb-3">
                        <span className="col-6">Value</span>
                        <span className="col-6">
                          {leadDetail?.annual_revenue
                            ? `$${leadDetail.annual_revenue}`
                            : "N/A"}
                        </span>
                      </li>

                      <li className="row mb-3">
                        <span className="col-6">Source</span>
                        <span className="col-6">
                          {leadDetail?.crms_m_sources?.name || "N/A"}
                        </span>
                      </li>
                    </ul>

                    <hr />
                    <div className="d-flex align-items-center justify-content-between flex-wrap">
                      <h6 className="mb-3 fw-semibold">Owner</h6>
                      {/* <Link
                                                to="#"
                                                className="link-purple fw-medium mb-3"
                                                data-bs-toggle="offcanvas"
                                                data-bs-target="#offcanvas_add_lead"
                                                onClick={() => setSelectedLead(leadDetail)}
                                            >
                                                <i className="ti ti-circle-plus me-1" />
                                                Add New
                                            </Link> */}
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <div className="avatar avatar-md me-2">
                        <img
                          src={
                            leadDetail?.crms_m_user?.profile_img ||
                            `${base_path}assets/img/profiles/avatar-21.jpg`
                          }
                          alt={leadDetail?.crms_m_user?.full_name || "User"}
                          className="rounded-circle"
                          width="40"
                          height="40"
                        />
                      </div>
                      <p>{leadDetail?.crms_m_user?.full_name || "N/A"}</p>
                    </div>

                    <hr />
                    <h6 className="mb-3 fw-semibold">Tags</h6>
                    {tagsArray.map((tag, index) => (
                      <Link
                        to="#"
                        key={index} // Use index as key
                        className={`badge ${getRandomClass()} fw-medium me-2 mb-1`}
                      >
                        {tag}
                      </Link>
                    ))}
                    <hr />

                    <h6 className="mb-3 fw-semibold">Status</h6>
                    <div className="priority-info">
                      <span
                        style={{
                          color: leadDetail?.crms_m_lost_reasons?.colorCode,
                        }}
                      >
                        <i className="ti ti-square-rounded-filled me-1" />
                        {leadDetail?.crms_m_lost_reasons?.name || "N/A"}
                      </span>
                    </div>
                    <hr />

                    <ul>
                      <li className="row mb-3">
                        <span className="col-6">Last Modified</span>
                        <span className="col-6">
                          {leadDetail?.updatedate
                            ? moment(leadDetail?.updatedate).format(
                                "DD MMM YYYY, hh:mm a"
                              )
                            : "N/A"}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* /Deals Sidebar */}
              {/* Deals Details */}
              <Actvities type="Leads" name={`${leadDetail?.first_name} ${leadDetail?.last_name}`} id={id} obj={leadDetail} leadStatus={lostReasons} />
              {/* /Deals Details */}
            </div>
          </div>
        {/* )} */}
      </div>
      <AddUserModal />
    </div>
  );
};

export default LeadsDetail;
