import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ImageWithBasePath from "../../../components/common/imageWithBasePath";
import { ascendingandDecending } from "../../../components/common/selectoption/selectoption";
import Select from "react-select";
import DefaultEditor from "react-simple-wysiwyg";
import { Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { ActivityDetailOfUser } from "../../../components/common/detailPages/UserDetails/activityDetails";
import { CallsDetailsOfUser } from "../../../components/common/detailPages/UserDetails/callsDetails";
import FilesDetails from "../../../components/common/detailPages/UserDetails/FilesDetails";
const ProjectActvities = () => {
  const {id}= useParams()
  return (
    <div className="col-xl-9">
      <div className="card mb-3">
        <div className="card-body pb-0 pt-2">
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
            
          </ul>
        </div>
      </div>
      {/* Tab Content */}
      <div className="tab-content pt-0">
        {/* Activities */}
        
 <ActivityDetailOfUser project_id={id} />
        {/* <div className="tab-pane active show" id="activities">
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
              <h4 className="fw-semibold">Activities</h4>
              <div>
                <div className="form-sort mt-0">
                  <i className="ti ti-sort-ascending-2" />
                  <Select
                    className="select"
                    options={ascendingandDecending}
                    placeholder="Ascending"
                    classNamePrefix="react-select"
                  />
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="badge badge-soft-purple fs-14 fw-normal shadow-none mb-3">
                <i className="ti ti-calendar-check me-1" />
                29 Aug 2023
              </div>
              <div className="card border shadow-none mb-3">
                <div className="card-body p-3">
                  <div className="d-flex">
                    <span className="avatar avatar-md flex-shrink-0 rounded me-2 bg-pending">
                      <i className="ti ti-mail-code" />
                    </span>
                    <div>
                      <h6 className="fw-medium mb-1">
                        You sent 1 Message to the contact.
                      </h6>
                      <p>10:25 pm</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card border shadow-none mb-3">
                <div className="card-body p-3">
                  <div className="d-flex">
                    <span className="avatar avatar-md flex-shrink-0 rounded me-2 bg-secondary-success">
                      <i className="ti ti-phone" />
                    </span>
                    <div>
                      <h6 className="fw-medium mb-1">
                        Denwar responded to your appointment schedule question
                        by call at 09:30pm.
                      </h6>
                      <p>09:25 pm</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card border shadow-none mb-3">
                <div className="card-body p-3">
                  <div className="d-flex">
                    <span className="avatar avatar-md flex-shrink-0 rounded me-2 bg-orange">
                      <i className="ti ti-notes" />
                    </span>
                    <div>
                      <h6 className="fw-medium mb-1">Notes added by Antony</h6>
                      <p className="mb-1">
                        Please accept my apologies for the inconvenience caused.
                        It would be much appreciated if it's possible to
                        reschedule to 6:00 PM, or any other day that week.
                      </p>
                      <p>10.00 pm</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="badge badge-soft-purple fs-14 fw-normal shadow-none mb-3">
                <i className="ti ti-calendar-check me-1" />
                28 Feb 2024
              </div>
              <div className="card border shadow-none mb-3">
                <div className="card-body p-3">
                  <div className="d-flex">
                    <span className="avatar avatar-md flex-shrink-0 rounded me-2 bg-info">
                      <i className="ti ti-user-pin" />
                    </span>
                    <div>
                      <h6 className="fw-medium mb-1 d-inline-flex align-items-center flex-wrap">
                        Meeting With{" "}
                        <span className="avatar avatar-xs mx-2">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-19.jpg"
                            alt="img"
                          />
                        </span>{" "}
                        Abraham
                      </h6>
                      <p>Schedueled on 05:00 pm</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card border shadow-none mb-3">
                <div className="card-body p-3">
                  <div className="d-flex">
                    <span className="avatar avatar-md flex-shrink-0 rounded me-2 bg-secondary-success">
                      <i className="ti ti-notes" />
                    </span>
                    <div>
                      <h6 className="fw-medium mb-1">
                        Drain responded to your appointment schedule question.
                      </h6>
                      <p>09:25 pm</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="badge badge-soft-purple fs-14 fw-normal shadow-none mb-3">
                <i className="ti ti-calendar-check me-1" />
                Upcoming Activity
              </div>
              <div className="card border shadow-none mb-0">
                <div className="card-body p-3">
                  <div className="d-flex">
                    <span className="avatar avatar-md flex-shrink-0 rounded me-2 bg-info">
                      <i className="ti ti-user-pin" />
                    </span>
                    <div>
                      <h6 className="fw-medium mb-1">Product Meeting</h6>
                      <p className="mb-1">
                        A product team meeting is a gathering of the
                        cross-functional product team — ideally including team
                        members from product, engineering, marketing, and
                        customer support.
                      </p>
                      <p>25 Jul 2023, 05:00 pm</p>
                      <div className="upcoming-info">
                        <div className="row">
                          <div className="col-sm-4">
                            <p>Reminder</p>
                            <div className="dropdown">
                              <Link
                                to="#"
                                className="dropdown-toggle"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <i className="ti ti-clock-edit me-1" />
                                Reminder
                                <i className="ti ti-chevron-down ms-1" />
                              </Link>
                              <div className="dropdown-menu dropdown-menu-right">
                                <Link className="dropdown-item" to="#">
                                  Remainder
                                </Link>
                                <Link className="dropdown-item" to="#">
                                  1 hr
                                </Link>
                                <Link className="dropdown-item" to="#">
                                  10 hr
                                </Link>
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <p>Task Priority</p>
                            <div className="dropdown">
                              <Link
                                to="#"
                                className="dropdown-toggle"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <i className="ti ti-square-rounded-filled me-1 text-danger circle" />
                                High
                                <i className="ti ti-chevron-down ms-1" />
                              </Link>
                              <div className="dropdown-menu dropdown-menu-right">
                                <Link className="dropdown-item" to="#">
                                  <i className="ti ti-square-rounded-filled me-1 text-danger circle" />
                                  High
                                </Link>
                                <Link className="dropdown-item" to="#">
                                  <i className="ti ti-square-rounded-filled me-1 text-success circle" />
                                  Low
                                </Link>
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <p>Assigned to</p>
                            <div className="dropdown">
                              <Link
                                to="#"
                                className="dropdown-toggle"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <ImageWithBasePath
                                  src="assets/img/profiles/avatar-19.jpg"
                                  alt="img"
                                  className="avatar-xs"
                                />
                                John
                                <i className="ti ti-chevron-down ms-1" />
                              </Link>
                              <div className="dropdown-menu dropdown-menu-right">
                                <Link className="dropdown-item" to="#">
                                  <ImageWithBasePath
                                    src="assets/img/profiles/avatar-19.jpg"
                                    alt="img"
                                    className="avatar-xs"
                                  />
                                  John
                                </Link>
                                <Link className="dropdown-item" to="#">
                                  <ImageWithBasePath
                                    src="assets/img/profiles/avatar-15.jpg"
                                    alt="img"
                                    className="avatar-xs"
                                  />
                                  Peter
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
          </div>
        </div> */}
       
        {/* Calls */}
        <CallsDetailsOfUser project_id={id} />

        {/* Files */}
       <FilesDetails type={"Projects"} type_id={id} />

      </div>
      {/* /Tab Content */}
    </div>
  );
};

export default ProjectActvities;
