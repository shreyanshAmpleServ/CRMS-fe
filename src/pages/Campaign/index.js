import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   setCampaignTogglePopup,
//   setCampaignTogglePopupTwo,
// } from "../../core/data/redux/commonSlice";
import { Table } from "antd";
import moment from "moment";
import CollapseHeader from "../../components/common/collapse-header.js";
import { fetchActivities, fetchActivityTypes } from "../../redux/Activities/index.js";
import { all_routes } from "../../routes/all_routes.js";
import ActivitiesModal from "./modal/manageCampaignModal.js";
import ViewIconsToggle from "../../components/datatable/ViewIconsToggle.js";
import ActivitiesGrid from "./ActivitiesGrid.js";
import UnauthorizedImage from "../../components/common/UnAuthorized.js/index.js";
import { StatusOptions } from "../../components/common/selectoption/selectoption.js";
import ActivitiesKanban from "./ActivitiessKanban.js";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import DateRangePickerComponent from "../../components/datatable/DateRangePickerComponent.js";
import { fetchCampaign } from "../../redux/campaign/index.js";
import DeleteAlert from "./alert/DeleteAlert.js";

const CampaignsList = () => {
  // const data = activities_data;
  const {name} = useParams()
    const [isChange,setIsChange] = useState(false)
  const [view, setView] = useState("list");
  const [filter, setFilter] = useState("");
  const [newFilter,setNewFilter] = useState(name)
  const [isLoading,setIsLoading] = useState(false)
  const [searchValue, setSearchValue] = useState("");
  const [campaign, setCampaign] = useState();
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paginationData , setPaginationData] = useState()
  const [selectedDateRange, setSelectedDateRange] = useState({
      startDate: moment().subtract(180, "days"),
      endDate: moment(),
    });
  const dispatch = useDispatch();

  const { campaigns, loading, error, success } = useSelector(
    (state) => state.campaigns || {}
  );
  React.useEffect(()=>{
    dispatch(fetchActivityTypes());
},[dispatch])

 React.useEffect(() => {
   dispatch(fetchCampaign({ search: searchValue , ...(isChange &&  selectedDateRange ), filter: filter,filter2:newFilter }));
 }, [dispatch, searchValue,selectedDateRange, filter,newFilter]);

 React.useEffect(()=>{
       setPaginationData({
         currentPage:campaigns?.currentPage,
         totalPage:campaigns?.totalPages,
         totalCount:campaigns?.totalCount,
         pageSize : campaigns?.size

      })
   },[campaigns])

    const handlePageChange = ({ currentPage, pageSize }) => {
       setPaginationData((prev) => ({
         ...prev,
         currentPage,
         pageSize

      }));
      dispatch(fetchCampaign({search:searchValue , ...selectedDateRange, filter: filter,filter2:newFilter, page: currentPage, size: pageSize })); 
   };


  const data = campaigns?.data?.map((i) => ({
    ...i,
    start_date: i?.start_date.slice(0, 10),
    end_date: i?.end_date.slice(0, 10),
    created_date: i?.createddate || new Date(),
  }));

  const permissions =JSON?.parse(localStorage.getItem("permissions"))
  const allPermissions = permissions?.filter((i)=>i?.module_name === "Campaigns")?.[0]?.permissions
  const isAdmin = localStorage.getItem("role")?.includes("admin")
  const isView = isAdmin || allPermissions?.view
  const isCreate = isAdmin || allPermissions?.create
  const isUpdate = isAdmin || allPermissions?.update
  const isDelete = isAdmin || allPermissions?.delete

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.title.length - b.title.length,
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      sorter: (a, b) => a.start_date.length - b.start_date.length,
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      sorter: (a, b) => a.end_date.length - b.end_date.length,
    },
    {
      title: "Exp Revenue",
      dataIndex: "exp_revenue",
      sorter: (a, b) => a.exp_revenue - b.exp_revenue,
    },
    {
      title: "Cost",
      dataIndex: "camp_cost",
      sorter: (a, b) => a.camp_cost - b.camp_cost,
    },
    {
      title: "Owner",
      dataIndex: "campaign_user",
      render: (text) => <div>{text.full_name}</div>,
      sorter: (a, b) => a.owner.length - b.owner.length,
    },    
    {
      title: "Type",
      dataIndex: "type",
      // render: (text, record, a) => (
      //   <>
      //     {text?.id ? (
      //       <span
      //         className={`badge activity-badge ${text?.name === "Calls" ? "bg-success" : text?.name === "Emails" ? "bg-purple" : text?.name === "Task" ? "bg-blue" : text?.name === "Task" ? "bg-red" : "bg-warning"}`}
      //       >
      //         {/* <i className={record?.icon} /> */}

      //         {text?.name || " "}
      //       </span>
      //     ) : (
      //       " -- "
      //     )}
      //   </>
      // ),
      sorter: (a, b) => a.activity_type.length - b.activity_type.length,
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
      render: (text) => <div>{moment(text).format("DD-MM-YYYY")}</div>,
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
              onClick={() => setCampaign(a)}
            >
              <i className="ti ti-edit text-blue" /> Edit
            </Link>}

          {isDelete &&  <Link
              className="dropdown-item"
              to="#"
              onClick={() => handleDeleteCampaign(a.id)}
            >
              <i className="ti ti-trash text-danger" /> Delete
            </Link>}
          </div>
        </div>
      ),
    }]:[])
  ];
  const handleDeleteCampaign = (id) => {
    setSelectedCampaign(id);
    setShowDeleteModal(true);
  };

  return (
    <div>
      <Helmet>
        <title>DCC CRMS - Campaigns</title>
        <meta name="campaign" content="This is campaign page of DCC CRMS." />
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
                      Campaigns<span className="count-title">{campaigns?.totalCount}</span>
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
                          Add New Campaign
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
                          <h4 className="mb-0 me-3">All Campaigns</h4>
                          <div className="active-list">
                          {/* <ul className="mb-0">
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
                            </ul> */}
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center flex-wrap row-gap-2">
                        <div className="mx-2">
                      <DateRangePickerComponent
                      selectedDateRange={selectedDateRange}
                      setSelectedDateRange={setSelectedDateRange}
                      setWhoChange={setIsChange}
                      ChangeName={true}
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
                            </ul>
                          </div>
                        </div>
                       
                      <ViewIconsToggle view={view} isActivity={true} setView={setView} />
                      </div>
                    </div>
                  </>

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
                    <ActivitiesGrid data={campaigns?.data} />
                   
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
                </div>
              </div>
            </div>
          </div>
        </div>
        <ActivitiesModal setCampaign={setCampaign} campaign={campaign} />
      </div>
      <DeleteAlert
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        selectedCampaign={selectedCampaign}
      />
      {/* /Page Wrapper */}
    </div>
  );
};

export default CampaignsList;
