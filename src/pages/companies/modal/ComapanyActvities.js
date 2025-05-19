import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../components/common/imageWithBasePath";
import { ascendingandDecending } from "../../../components/common/selectoption/selectoption";
import Select from "react-select";
import DefaultEditor from "react-simple-wysiwyg";
import { Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { ActivityDetailOfUser } from "../../../components/common/detailPages/UserDetails/activityDetails";
import { CallsDetailsOfUser } from "../../../components/common/detailPages/UserDetails/callsDetails";
import FilesDetails from "../../../components/common/detailPages/UserDetails/FilesDetails";
const ComapanyActvities = ({ company_id ,company_name }) => {
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
        <ActivityDetailOfUser company_id={company_id} />

        {/* Notes */}
        {/* <div className="tab-pane fade" id="notes">
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
              <h4 className="fw-semibold">Notes</h4>
              <div className="d-inline-flex align-items-center">
                <div className="form-sort me-3 mt-0">
                  <i className="ti ti-sort-ascending-2" />
                  <Select
                    className="select"
                    options={ascendingandDecending}
                    placeholder="Ascending"
                    classNamePrefix="react-select"
                  />
                </div>
                <Link
                  to="#"
                  data-bs-toggle="modal"
                  data-bs-target="#add_notes"
                  className="link-purple fw-medium"
                >
                  <i className="ti ti-circle-plus me-1" />
                  Add New
                </Link>
              </div>
            </div>
            <div className="card-body">
              <div className="notes-activity">
                <div className="card mb-3">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between pb-2">
                      <div className="d-inline-flex align-items-center mb-2">
                        <span className="avatar avatar-md me-2 flex-shrink-0">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-19.jpg"
                            alt="img"
                          />
                        </span>
                        <div>
                          <h6 className="fw-medium mb-1">Darlee Robertson</h6>
                          <p className="mb-0">15 Sep 2023, 12:10 pm</p>
                        </div>
                      </div>
                      <div className="mb-2">
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
                          </div>
                        </div>
                      </div>
                    </div>
                    <h5 className="fw-medium mb-1">Notes added by Antony</h5>
                    <p>
                      A project review evaluates the success of an initiative
                      and identifies areas for improvement. It can also evaluate
                      a current project to determine whether it's on the right
                      track. Or, it can determine the success of a completed
                      project.{" "}
                    </p>
                    <div className="d-inline-flex align-items-center flex-wrap">
                      <div className="note-download me-3">
                        <div className="note-info">
                          <span className="note-icon bg-secondary-success">
                            <i className="ti ti-file-spreadsheet" />
                          </span>
                          <div>
                            <h6 className="fw-medium mb-1">
                              Project Specs.xls
                            </h6>
                            <p>365 KB</p>
                          </div>
                        </div>
                        <Link to="#">
                          <i className="ti ti-arrow-down" />
                        </Link>
                      </div>
                      <div className="note-download">
                        <div className="note-info">
                          <span className="note-icon">
                            <ImageWithBasePath
                              src="assets/img/media/media-35.jpg"
                              alt="img"
                            />
                          </span>
                          <div>
                            <h6 className="fw-medium mb-1">090224.jpg</h6>
                            <p>365 KB</p>
                          </div>
                        </div>
                        <Link to="#">
                          <i className="ti ti-arrow-down" />
                        </Link>
                      </div>
                    </div>
                    <div className="notes-editor">
                      <div
                        className="note-edit-wrap"
                        style={{ display: isEditor ? "block" : "none" }}
                      >
                        <DefaultEditor className="summernote" />
                        <div className="text-end note-btns">
                          <Link
                            to="#"
                            className="btn btn-light add-cancel"
                            onClick={() => setIsEditor(!isEditor3)}
                          >
                            Cancel
                          </Link>
                          <Link to="#" className="btn btn-primary">
                            Save
                          </Link>
                        </div>
                      </div>
                      <div className="text-end">
                        <Link
                          to="#"
                          className="add-comment link-purple fw-medium"
                          onClick={() => setIsEditor(!isEditor)}
                        >
                          <i className="ti ti-square-plus me-1" />
                          Add Comment
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card mb-3">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between pb-2">
                      <div className="d-inline-flex align-items-center mb-2">
                        <span className="avatar avatar-md me-2 flex-shrink-0">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-20.jpg"
                            alt="img"
                          />
                        </span>
                        <div>
                          <h6 className="fw-medium mb-1">Sharon Roy</h6>
                          <p className="mb-0">18 Sep 2023, 09:52 am</p>
                        </div>
                      </div>
                      <div className="mb-2">
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
                          </div>
                        </div>
                      </div>
                    </div>
                    <h5 className="fw-medium mb-1">Notes added by Antony</h5>
                    <p>
                      A project plan typically contains a list of the essential
                      elements of a project, such as stakeholders, scope,
                      timelines, estimated cost and communication methods. The
                      project manager typically lists the information based on
                      the assignment.
                    </p>
                    <div className="d-inline-flex align-items-center flex-wrap">
                      <div className="note-download me-3">
                        <div className="note-info">
                          <span className="note-icon bg-secondary-success">
                            <i className="ti ti-file-text" />
                          </span>
                          <div>
                            <h6 className="fw-medium mb-1">Andrewpass.txt</h6>
                            <p>365 KB</p>
                          </div>
                        </div>
                        <Link to="#">
                          <i className="ti ti-arrow-down" />
                        </Link>
                      </div>
                    </div>
                    <div className="reply-box">
                      <p>
                        The best way to get a project done faster is to start
                        sooner. A goal without a timeline is just a dream.The
                        goal you set must be challenging. At the same time, it
                        should be realistic and attainable, not impossible to
                        reach.
                      </p>
                      <p>
                        Commented by <span className="text-purple">Aeron</span>{" "}
                        on 15 Sep 2023, 11:15 pm
                      </p>
                      <Link to="#" className="btn">
                        <i className="ti ti-arrow-back-up-double" />
                        Reply
                      </Link>
                    </div>
                    <div className="notes-editor">
                      <div
                        className="note-edit-wrap"
                        style={{
                          display: isEditor2 ? "block" : "none",
                        }}
                      >
                        <DefaultEditor className="summernote" />
                        <div className="text-end note-btns">
                          <Link
                            to="#"
                            className="btn btn-light add-cancel"
                            onClick={() => setIsEditor2(!isEditor3)}
                          >
                            Cancel
                          </Link>
                          <Link to="#" className="btn btn-primary">
                            Save
                          </Link>
                        </div>
                      </div>
                      <div className="text-end">
                        <Link
                          to="#"
                          className="add-comment link-purple fw-medium"
                          onClick={() => setIsEditor2(!isEditor2)}
                        >
                          <i className="ti ti-square-plus me-1" />
                          Add Comment
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card mb-0">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between pb-2">
                      <div className="d-inline-flex align-items-center mb-2">
                        <span className="avatar avatar-md me-2 flex-shrink-0">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-21.jpg"
                            alt="img"
                          />
                        </span>
                        <div>
                          <h6 className="fw-medium mb-1">Vaughan</h6>
                          <p className="mb-0">20 Sep 2023, 10:26 pm</p>
                        </div>
                      </div>
                      <div className="mb-2">
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
                          </div>
                        </div>
                      </div>
                    </div>
                    <p>
                      Projects play a crucial role in the success of
                      organizations, and their importance cannot be overstated.
                      Whether it's launching a new product, improving an
                      existing
                    </p>
                    <div className="notes-editor">
                      <div
                        className="note-edit-wrap"
                        style={{
                          display: isEditor3 ? "block" : "none",
                        }}
                      >
                        <DefaultEditor className="summernote" />
                        <div className="text-end note-btns">
                          <Link
                            to="#"
                            className="btn btn-light add-cancel"
                            onClick={() => setIsEditor3(!isEditor3)}
                          >
                            Cancel
                          </Link>
                          <Link to="#" className="btn btn-primary">
                            Save
                          </Link>
                        </div>
                      </div>
                      <div className="text-end">
                        <Link
                          to="#"
                          className="add-comment link-purple fw-medium"
                          onClick={() => setIsEditor3(!isEditor3)}
                        >
                          <i className="ti ti-square-plus me-1" />
                          Add Comment
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Calls */}
        <CallsDetailsOfUser />

        {/* Files */}
       <FilesDetails type={"Companies"} type_id={company_id} type_name={company_name} />

        {/* Email */}
        {/* <div className="tab-pane fade" id="email">
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
              <h4 className="fw-semibold">Email</h4>
              <div className="d-inline-flex align-items-center">
                <OverlayTrigger
                  placement="left"
                  overlay={
                    <Tooltip id="refresh-tooltip">
                      There are no email accounts configured, Please configured
                      your email account in order to Send/ Create EMails
                    </Tooltip>
                  }
                >
                  <Link to="#">
                    <i className="ti ti-circle-plus me-1" />
                    Create Email
                  </Link>
                </OverlayTrigger>
              </div>
            </div>
            <div className="card-body">
              <div className="card border mb-0">
                <div className="card-body pb-0">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <div className="mb-3">
                        <h4 className="fw-medium mb-1">Manage Emails</h4>
                        <p>
                          You can send and reply to emails directly via this
                          section.
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
        </div> */}
      </div>
      {/* /Tab Content */}
    </div>
  );
};

export default ComapanyActvities;
