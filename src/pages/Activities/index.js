import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   setActivityTogglePopup,
//   setActivityTogglePopupTwo,
// } from "../../core/data/redux/commonSlice";
import { Table } from "antd";
import moment from "moment";
import CollapseHeader from "../../components/common/collapse-header";
import { fetchActivities, fetchActivityTypes } from "../../redux/Activities";
import { all_routes } from "../../routes/all_routes";
import ActivitiesModal from "./modal/ActivitiesModal";
import ViewIconsToggle from "../../components/datatable/ViewIconsToggle";
import ActivitiesGrid from "./ActivitiesGrid";
import UnauthorizedImage from "../../components/common/UnAuthorized.js";
import { StatusOptions } from "../../components/common/selectoption/selectoption.js";
import ActivitiesKanban from "./ActivitiessKanban.js";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import DateRangePickerComponent from "../../components/datatable/DateRangePickerComponent.js";

const Activities = () => {
  // const data = activities_data;
  const {name} = useParams()
  const [view, setView] = useState("list");
  const [filter, setFilter] = useState("");
  const [newFilter,setNewFilter] = useState(name)
  const [isLoading,setIsLoading] = useState(false)
  const [searchValue, setSearchValue] = useState("");
  const [activity, setActivity] = useState();
  const [paginationData , setPaginationData] = useState()
  const [selectedDateRange, setSelectedDateRange] = useState({
      startDate: moment().subtract(180, "days"),
      endDate: moment(),
    });
  const dispatch = useDispatch();

  const { activities, loading, error, success } = useSelector(
    (state) => state.activities || {}
  );
  React.useEffect(()=>{
    dispatch(fetchActivityTypes());
},[dispatch])

 React.useEffect(() => {
   dispatch(fetchActivities({ search: searchValue , ...selectedDateRange, filter: filter,filter2:newFilter }));
 }, [dispatch, searchValue,selectedDateRange, filter,newFilter]);

 React.useEffect(()=>{
       setPaginationData({
         currentPage:activities?.currentPage,
         totalPage:activities?.totalPages,
         totalCount:activities?.totalCount,
         pageSize : activities?.size

      })
   },[activities])

    const handlePageChange = ({ currentPage, pageSize }) => {
       setPaginationData((prev) => ({
         ...prev,
         currentPage,
         pageSize

      }));
      dispatch(fetchActivities({search:searchValue , ...selectedDateRange, filter: filter,filter2:newFilter, page: currentPage, size: pageSize })); 
   };


  const data = activities?.data?.map((i) => ({
    ...i,
    due_date: i?.due_date.slice(0, 10),
    owner: i?.owner,
    activity_type: i?.activity_type,
    created_date: i?.createddate || new Date(),
  }));


const activityTypes = useSelector((state) => state.activities.activityTypes);

  const permissions =JSON?.parse(localStorage.getItem("permissions"))
  const allPermissions = permissions?.filter((i)=>i?.module_name === "Activities")?.[0]?.permissions
  const isAdmin = localStorage.getItem("role")?.includes("admin")
  const isView = isAdmin || allPermissions?.view
  const isCreate = isAdmin || allPermissions?.create
  const isUpdate = isAdmin || allPermissions?.update
  const isDelete = isAdmin || allPermissions?.delete

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      sorter: (a, b) => a.title.length - b.title.length,
    },
    {
      title: "Activity Type",
      dataIndex: "activity_type",
      render: (text, record, a) => (
        <>
          {text?.id ? (
            <span
              className={`badge activity-badge ${text?.name === "Calls" ? "bg-success" : text?.name === "Emails" ? "bg-purple" : text?.name === "Task" ? "bg-blue" : text?.name === "Task" ? "bg-red" : "bg-warning"}`}
            >
              {/* <i className={record?.icon} /> */}

              {text?.name || " "}
            </span>
          ) : (
            " -- "
          )}
        </>
      ),
      sorter: (a, b) => a.activity_type.length - b.activity_type.length,
    },

    {
      title: "Due Date",
      dataIndex: "due_date",
      sorter: (a, b) => a.due_date.length - b.due_date.length,
    },
    {
      title: "Owner",
      dataIndex: "owner",
      render: (text) => <div>{text.full_name}</div>,
      sorter: (a, b) => a.owner.length - b.owner.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) =>     <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: text === "In Progress" ? "blue" :  text === "Completed" ? "green" : text === "Canceled" ? "red"  : text === "Waiting for someone else" ? "orange"  :  "black", // Use color property from options
          display: "inline-block",
        }}
      />
      {text}
    </div>,
      sorter: (a, b) => a.owner.length - b.owner.length,
    },
    {
      title: "Created At",
      dataIndex: "created_date",
      render: (text) => <div>{moment(text).format("DD-MM-YYYY HH:mm A")}</div>,
      sorter: (a, b) => a.created_date.length - b.created_date.length,
    },
   ...((isDelete || isUpdate) ? [ {
      title: "Action",
      render: (text, a) => (
        <div className="dropdown table-action">
          <Link
            to="#"
            className="action-icon "
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa fa-ellipsis-v"></i>
          </Link>
          <div className="dropdown-menu dropdown-menu-right">
       {isUpdate && <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvas_add"
              onClick={() => setActivity(a)}
            >
              <i className="ti ti-edit text-blue" /> Edit
            </Link>}

          {isDelete &&  <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_activity"
              onClick={() => setActivity(a.id)}
            >
              <i className="ti ti-trash text-danger" /> Delete
            </Link>}
          </div>
        </div>
      ),
    }]:[])
  ];

  return (
    <>
      <Helmet>
        <title>DCC CRMS - Activities</title>
        <meta name="activities" content="This is activities page of DCC CRMS." />
      </Helmet>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              {/* Page Header */}
              <div className="page-header">
                <div className="row align-items-center">
                  <div className="col-4">
                    <h4 className="page-title">
                      Activities<span className="count-title">{activities?.data?.length}</span>
                    </h4>
                  </div>
                  <div className="col-8 text-end">
                    <div className="head-icons">
                      <CollapseHeader />
                    </div>
                  </div>
                </div>
              </div>
              {/* /Page Header */}
              <div className="card">
                <div className="card-header">
                  {/* Search */}
                  <div className="row align-items-center">
                    <div className="col-sm-4">
                      <div className="icon-form mb-3 mb-sm-0">
                        <span className="form-icon">
                          <i className="ti ti-search" />
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search Activities"
                          onChange={(e) => setSearchValue(e.target.value)}
                        />
                      </div>
                    </div>
                  {isCreate &&  <div className="col-sm-8">
                      <div className="text-sm-end">
                        <Link
                          to="#"
                          className="btn btn-primary"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#offcanvas_add"
                        >
                          <i className="ti ti-square-rounded-plus me-2" />
                          Add New Activity
                        </Link>
                      </div>
                    </div>}
                  </div>
                  {/* /Search */}
                </div>

                <div className="card-body">
                  <>
                    {/* Filter */}
                    <div className="d-flex align-items-center justify-content-between flex-wrap mb-4 row-gap-2">
                      <div className="d-flex align-items-center flex-wrap row-gap-2">
                        <div className="d-flex align-items-center flex-wrap row-gap-2">
                          <h4 className="mb-0 me-3">All Activity</h4>
                          <div className="active-list">
                          <ul className="mb-0">
                            {activityTypes?.map((item)=><>
                              {item?.name === "Calls" && <li>
                                <Link
                                  // to={route.activityCalls}
                                  to="#"
                                  onClick={()=>{newFilter === "Calls" ? setNewFilter("") : setNewFilter("Calls")}}
                                  data-bs-toggle="tooltip"
                                  data-bs-placement="top"
                                  data-bs-original-title="Calls"
                                  className={`custom-link ${newFilter === "Calls" ? "active-link bg-info" : ""}`}
                                >
                                  <i className="ti ti-phone" />
                                </Link>
                              </li>}
                              {item?.name === "Emails" && <li>
                                <Link
                                  // to={route.activityMail}
                                  to="#"
                                  onClick={()=>{newFilter === "Emails" ? setNewFilter("") : setNewFilter("Emails")}}
                                  data-bs-toggle="tooltip"
                                  data-bs-placement="top"
                                  data-bs-original-title="Emails"
                                  className={`custom-link ${newFilter === "Emails" ? "active-link bg-info" : ""}`}
                                >
                                  <i className="ti ti-mail" />
                                </Link>
                              </li>}
                             {item?.name === "Task" &&  <li>
                                <Link
                                  // to={route.activityTask}
                                  to="#"
                                  onClick={()=>{newFilter === "Task" ? setNewFilter("") : setNewFilter("Task")}}
                                  data-bs-toggle="tooltip"
                                  data-bs-placement="top"
                                  data-bs-original-title="Task"
                                  className={`custom-link ${newFilter === "Task" ? "active-link bg-info" : ""}`}
                                >
                                  <i className="ti ti-subtask" />
                                </Link>
                              </li>}
                             {item?.name === "Meeting" &&<li>
                                <Link
                                  // to={route.activityMeeting}
                                  to="#"
                                  onClick={()=>{newFilter === "Meeting" ? setNewFilter("") : setNewFilter("Meeting")}}
                                  data-bs-toggle="tooltip"
                                  data-bs-placement="top"
                                  data-bs-original-title="Meeting"
                                  className={`custom-link ${newFilter === "Meeting" ? "active-link bg-info" : ""}`}
                                >
                                  <i className="ti ti-user-share" />
                                </Link>
                              </li>}
                            </>)}
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center flex-wrap row-gap-2">
                        <div className="mx-2">
                      <DateRangePickerComponent
                      selectedDateRange={selectedDateRange}
                      setSelectedDateRange={setSelectedDateRange}
                    />
                    </div>
                        <div className="dropdown me-2">
                          <Link
                            to="#"
                            className="dropdown-toggle"
                            data-bs-toggle="dropdown"
                          >
                            <i className="ti ti-sort-ascending-2 me-2" />
                            {filter
                              ? filter === "asc"
                                ? "Ascending"
                                : filter === "desc"
                                  ? " Descending"
                                  : " Recently Added"
                              : "Sort"}{" "}
                           {loading && isLoading && <div
                              style={{
                                height: "15px",
                                width: "15px",
                              }}
                              className="spinner-border ml-3 text-success"
                              role="status"
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>}
                          </Link>
                          <div className="dropdown-menu  dropdown-menu-start">
                            <ul>
                              <li>
                                <Link
                                  to="#"
                                  className="dropdown-item"
                                  onClick={() => {setFilter("asc");setIsLoading(true)}}
                                >
                                  <i className="ti ti-circle-chevron-right me-1" />
                                  Ascending
                                </Link>
                              </li>
                              <li>
                                <Link
                                  to="#"
                                  className="dropdown-item"
                                  onClick={() =>{ setFilter("desc");setIsLoading(true)}}
                                >
                                  <i className="ti ti-circle-chevron-right me-1" />
                                  Descending
                                </Link>
                              </li>
                              {/* <li>
                                                                <Link
                                                                    to="#"
                                                                    className="dropdown-item"
                                                                >
                                                                    <i className="ti ti-circle-chevron-right me-1" />
                                                                    Recently Viewed
                                                                </Link>
                                                            </li> */}
                              {/* <li>
                                <Link
                                  to="#"
                                  className="dropdown-item"
                                  onClick={() => {setFilter("added");setIsLoading(true)}}
                                >
                                  <i className="ti ti-circle-chevron-right me-1" />
                                  Recently Added
                                </Link>
                              </li> */}
                            </ul>
                          </div>
                        </div>
                        {/* <div className="dropdown me-2">
                          <Link
                            to="#"
                            className="btn bg-soft-purple text-purple"
                            data-bs-toggle="dropdown"
                            data-bs-auto-close="outside"
                          >
                            <i className="ti ti-columns-3 me-2" />
                            Manage Columns
                          </Link>
                          <div className="dropdown-menu  dropdown-menu-md-end dropdown-md p-3">
                            <h4 className="mb-2 fw-semibold">
                              Want to manage datatables?
                            </h4>
                            <p className="mb-3">
                              Please drag and drop your column to reorder your
                              table and enable see option as you want.
                            </p>
                            <div className="border-top pt-3">
                              <div className="d-flex align-items-center justify-content-between mb-3">
                                <p className="mb-0 d-flex align-items-center">
                                  <i className="ti ti-grip-vertical me-2" />
                                  Title
                                </p>
                                <div className="status-toggle">
                                  <input
                                    type="checkbox"
                                    id="col-name"
                                    className="check"
                                  />
                                  <label
                                    htmlFor="col-name"
                                    className="checktoggle"
                                  />
                                </div>
                              </div>
                              <div className="d-flex align-items-center justify-content-between mb-3">
                                <p className="mb-0 d-flex align-items-center">
                                  <i className="ti ti-grip-vertical me-2" />
                                  Activity Type
                                </p>
                                <div className="status-toggle">
                                  <input
                                    type="checkbox"
                                    id="col-phone"
                                    className="check"
                                  />
                                  <label
                                    htmlFor="col-phone"
                                    className="checktoggle"
                                  />
                                </div>
                              </div>
                              <div className="d-flex align-items-center justify-content-between mb-3">
                                <p className="mb-0 d-flex align-items-center">
                                  <i className="ti ti-grip-vertical me-2" />
                                  Due Date
                                </p>
                                <div className="status-toggle">
                                  <input
                                    type="checkbox"
                                    id="col-email"
                                    className="check"
                                  />
                                  <label
                                    htmlFor="col-email"
                                    className="checktoggle"
                                  />
                                </div>
                              </div>
                              <div className="d-flex align-items-center justify-content-between mb-3">
                                <p className="mb-0 d-flex align-items-center">
                                  <i className="ti ti-grip-vertical me-2" />
                                  Owner
                                </p>
                                <div className="status-toggle">
                                  <input
                                    type="checkbox"
                                    id="col-tag"
                                    className="check"
                                  />
                                  <label
                                    htmlFor="col-tag"
                                    className="checktoggle"
                                  />
                                </div>
                              </div>
                              <div className="d-flex align-items-center justify-content-between mb-3">
                                <p className="mb-0 d-flex align-items-center">
                                  <i className="ti ti-grip-vertical me-2" />
                                  Created at
                                </p>
                                <div className="status-toggle">
                                  <input
                                    type="checkbox"
                                    id="col-loc"
                                    className="check"
                                  />
                                  <label
                                    htmlFor="col-loc"
                                    className="checktoggle"
                                  />
                                </div>
                              </div>
                              <div className="d-flex align-items-center justify-content-between">
                                <p className="mb-0 d-flex align-items-center">
                                  <i className="ti ti-grip-vertical me-2" />
                                  Action
                                </p>
                                <div className="status-toggle">
                                  <input
                                    type="checkbox"
                                    id="col-action"
                                    className="check"
                                  />
                                  <label
                                    htmlFor="col-action"
                                    className="checktoggle"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div> */}
                        {/* <div className="form-sorts dropdown">
                          <Link
                            to="#"
                            data-bs-toggle="dropdown"
                            data-bs-auto-close="outside"
                          >
                            <i className="ti ti-filter-share" />
                            Filter
                          </Link>
                          <div className="filter-dropdown-menu dropdown-menu  dropdown-menu-md-end p-4">
                            <div className="filter-set-view">
                              <div className="filter-set-head">
                                <h4>
                                  <i className="ti ti-filter-share" />
                                  Filter
                                </h4>
                              </div>
                              <div className="accordion" id="accordionExample">
                                <div className="filter-set-content">
                                  <div className="filter-set-content-head">
                                    <Link
                                      to="#"
                                      data-bs-toggle="collapse"
                                      data-bs-target="#collapse"
                                      aria-expanded="true"
                                      aria-controls="collapse"
                                    >
                                      Title
                                    </Link>
                                  </div>
                                  <div
                                    className="filter-set-contents accordion-collapse collapse show"
                                    id="collapse"
                                    data-bs-parent="#accordionExample"
                                  >
                                    <div className="filter-content-list">
                                      <div className="mb-2 icon-form">
                                        <span className="form-icon">
                                          <i className="ti ti-search" />
                                        </span>
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder="Search Name"
                                        />
                                      </div>
                                      <ul>
                                        <li>
                                          <div className="filter-checks">
                                            <label className="checkboxs">
                                              <input
                                                type="checkbox"
                                                defaultChecked
                                              />
                                              <span className="checkmarks" />
                                              We scheduled a meeting
                                            </label>
                                          </div>
                                        </li>
                                        <li>
                                          <div className="filter-checks">
                                            <label className="checkboxs">
                                              <input type="checkbox" />
                                              <span className="checkmarks" />
                                              Store and manage contact
                                            </label>
                                          </div>
                                        </li>
                                        <li>
                                          <div className="filter-checks">
                                            <label className="checkboxs">
                                              <input type="checkbox" />
                                              <span className="checkmarks" />
                                              Built landing pages
                                            </label>
                                          </div>
                                        </li>
                                        <li>
                                          <div className="filter-checks">
                                            <label className="checkboxs">
                                              <input type="checkbox" />
                                              <span className="checkmarks" />
                                              Discussed budget proposal
                                            </label>
                                          </div>
                                        </li>
                                        <li>
                                          <div className="filter-checks">
                                            <label className="checkboxs">
                                              <input type="checkbox" />
                                              <span className="checkmarks" />
                                              Discussed about team
                                            </label>
                                          </div>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                                <div className="filter-set-content">
                                  <div className="filter-set-content-head">
                                    <Link
                                      to="#"
                                      className="collapsed"
                                      data-bs-toggle="collapse"
                                      data-bs-target="#collapseThree"
                                      aria-expanded="false"
                                      aria-controls="collapseThree"
                                    >
                                      Activity Type
                                    </Link>
                                  </div>
                                  <div
                                    className="filter-set-contents accordion-collapse collapse"
                                    id="collapseThree"
                                    data-bs-parent="#accordionExample"
                                  >
                                    <div className="filter-content-list">
                                      <ul>
                                        <li>
                                          <div className="filter-checks">
                                            <label className="checkboxs">
                                              <input
                                                type="checkbox"
                                                defaultChecked
                                              />
                                              <span className="checkmarks" />
                                              Meeting
                                            </label>
                                          </div>
                                        </li>
                                        <li>
                                          <div className="filter-checks">
                                            <label className="checkboxs">
                                              <input type="checkbox" />
                                              <span className="checkmarks" />
                                              Calls
                                            </label>
                                          </div>
                                        </li>
                                        <li>
                                          <div className="filter-checks">
                                            <label className="checkboxs">
                                              <input type="checkbox" />
                                              <span className="checkmarks" />
                                              Task
                                            </label>
                                          </div>
                                        </li>
                                        <li>
                                          <div className="filter-checks">
                                            <label className="checkboxs">
                                              <input type="checkbox" />
                                              <span className="checkmarks" />
                                              Email
                                            </label>
                                          </div>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                                <div className="filter-set-content">
                                  <div className="filter-set-content-head">
                                    <Link
                                      to="#"
                                      className="collapsed"
                                      data-bs-toggle="collapse"
                                      data-bs-target="#collapseone"
                                      aria-expanded="false"
                                      aria-controls="collapseone"
                                    >
                                      Due Date
                                    </Link>
                                  </div>
                                  <div
                                    className="filter-set-contents accordion-collapse collapse"
                                    id="collapseone"
                                    data-bs-parent="#accordionExample"
                                  >
                                    <div className="filter-content-list">
                                      <ul>
                                        <li>
                                          <div className="filter-checks">
                                            <label className="checkboxs">
                                              <input
                                                type="checkbox"
                                                defaultChecked
                                              />
                                              <span className="checkmarks" />
                                              25 Sep 2023, 12:12 pm
                                            </label>
                                          </div>
                                        </li>
                                        <li>
                                          <div className="filter-checks">
                                            <label className="checkboxs">
                                              <input type="checkbox" />
                                              <span className="checkmarks" />
                                              29 Sep 2023, 04:12 pm
                                            </label>
                                          </div>
                                        </li>
                                        <li>
                                          <div className="filter-checks">
                                            <label className="checkboxs">
                                              <input type="checkbox" />
                                              <span className="checkmarks" />
                                              11 Oct 2023, 05:00 pm
                                            </label>
                                          </div>
                                        </li>
                                        <li>
                                          <div className="filter-checks">
                                            <label className="checkboxs">
                                              <input type="checkbox" />
                                              <span className="checkmarks" />
                                              19 Oct 2023, 02:35 pm
                                            </label>
                                          </div>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                                <div className="filter-set-content">
                                  <div className="filter-set-content-head">
                                    <Link
                                      to="#"
                                      className="collapsed"
                                      data-bs-toggle="collapse"
                                      data-bs-target="#owner"
                                      aria-expanded="false"
                                      aria-controls="owner"
                                    >
                                      Owner
                                    </Link>
                                  </div>
                                  <div
                                    className="filter-set-contents accordion-collapse collapse"
                                    id="owner"
                                    data-bs-parent="#accordionExample"
                                  >
                                    <div className="filter-content-list">
                                      <ul>
                                        <li>
                                          <div className="filter-checks">
                                            <label className="checkboxs">
                                              <input
                                                type="checkbox"
                                                defaultChecked
                                              />
                                              <span className="checkmarks" />
                                              Hendry
                                            </label>
                                          </div>
                                        </li>
                                        <li>
                                          <div className="filter-checks">
                                            <label className="checkboxs">
                                              <input type="checkbox" />
                                              <span className="checkmarks" />
                                              Monty Beer
                                            </label>
                                          </div>
                                        </li>
                                        <li>
                                          <div className="filter-checks">
                                            <label className="checkboxs">
                                              <input type="checkbox" />
                                              <span className="checkmarks" />
                                              Bradtke
                                            </label>
                                          </div>
                                        </li>
                                        <li>
                                          <div className="filter-checks">
                                            <label className="checkboxs">
                                              <input type="checkbox" />
                                              <span className="checkmarks" />
                                              Swaniawski
                                            </label>
                                          </div>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                                <div className="filter-set-content">
                                  <div className="filter-set-content-head">
                                    <Link
                                      to="#"
                                      className="collapsed"
                                      data-bs-toggle="collapse"
                                      data-bs-target="#collapsethree"
                                      aria-expanded="false"
                                      aria-controls="collapsethree"
                                    >
                                      Created Date
                                    </Link>
                                  </div>
                                  <div
                                    className="filter-set-contents accordion-collapse collapse"
                                    id="collapsethree"
                                    data-bs-parent="#accordionExample"
                                  >
                                    <div className="filter-content-list">
                                      <ul>
                                        <li>
                                          <div className="filter-checks">
                                            <label className="checkboxs">
                                              <input
                                                type="checkbox"
                                                defaultChecked
                                              />
                                              <span className="checkmarks" />
                                              22 Sep 2023, 10:14 am
                                            </label>
                                          </div>
                                        </li>
                                        <li>
                                          <div className="filter-checks">
                                            <label className="checkboxs">
                                              <input type="checkbox" />
                                              <span className="checkmarks" />
                                              27 Sep 2023, 03:26 pm
                                            </label>
                                          </div>
                                        </li>
                                        <li>
                                          <div className="filter-checks">
                                            <label className="checkboxs">
                                              <input type="checkbox" />
                                              <span className="checkmarks" />
                                              03 Oct 2023, 03:53 pm
                                            </label>
                                          </div>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="filter-reset-btns">
                                <div className="row">
                                  <div className="col-6">
                                    <Link to="#" className="btn btn-light">
                                      Reset
                                    </Link>
                                  </div>
                                  <div className="col-6">
                                    <Link
                                      to={route.activities}
                                      className="btn btn-primary"
                                    >
                                      Filter
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div> */}
                      <ViewIconsToggle view={view} isActivity={true} setView={setView} />
                      </div>
                    </div>
                    {/* /Filter */}
                  </>

                  {/* Activity List */}
                  {isView ? <div className="table-responsive custom-table">
                  {view === "list" ? ( 
                    <Table
                      columns={columns}
                      dataSource={data}
                      loading={loading}
                      paginationData={paginationData}
                      onPageChange={handlePageChange} 
                    />
                  ) : (
                    <ActivitiesGrid data={activities?.data} />
                   
                  )} 
                  </div>: <UnauthorizedImage />}
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <div className="datatable-length" />
                    </div>
                    <div className="col-md-6">
                      <div className="datatable-paginate" />
                    </div>
                  </div>
                  {/* /Activity List */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <ActivitiesModal setActivity={setActivity} activity={activity} />
      </div>
      {/* /Page Wrapper */}
    </>
  );
};

export default Activities;
