import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap-daterangepicker/daterangepicker.css";
import Table from "../../components/common/dataTable/index";
import { useSelector, useDispatch } from "react-redux";
import CollapseHeader from "../../components/common/collapse-header";
import FlashMessage from "../../components/common/modals/FlashMessage";
import SortDropdown from "../../components/datatable/SortDropDown";
import SearchBar from "../../components/datatable/SearchBar";
import ViewIconsToggle from "../../components/datatable/ViewIconsToggle";
import DeleteAlert from "./alert/DeleteAlert";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import {
  fetchPipelines,
  deletePipeline,
  clearMessages,
} from "../../redux/pipelines";

import AddPipelineModal from "./modal/AddPipelineModal";
import EditPipelineModal from "./modal/EditPipelineModal";
import ExportData from "../../components/datatable/ExportData";
import FilterComponent from "./modal/FilterComponent";
import { Helmet } from "react-helmet-async";
import DateRangePickerComponent from "../../components/datatable/DateRangePickerComponent";
import moment from "moment";

const PipelineList = () => {
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("ascending"); // Sorting order
  const [selectedPipeline, setSelectedPipeline] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [paginationData , setPaginationData] = useState()
    const [selectedDateRange, setSelectedDateRange] = useState({
      startDate: moment().subtract(180, "days"),
      endDate: moment(),
    });
  const dispatch = useDispatch();

  const handleDeletePipeline = (pipeline) => {
    setSelectedPipeline(pipeline);
    setShowDeleteModal(true);
  };

  const deleteData = () => {
    if (selectedPipeline) {
      dispatch(deletePipeline(selectedPipeline.id)); // Dispatch the delete action

      setShowDeleteModal(false); // Close the modal
    }
  };

  const permissions =JSON?.parse(localStorage.getItem("permissions"))
  const allPermissions = permissions?.filter((i)=>i?.module_name === "Pipeline")?.[0]?.permissions
 const isAdmin = localStorage.getItem("role")?.includes("admin")
  const isView = isAdmin || allPermissions?.view
  const isCreate = isAdmin || allPermissions?.create
  const isUpdate = isAdmin || allPermissions?.update
  const isDelete = isAdmin || allPermissions?.delete

  const columns = [
    {
      title: "Pipeline Name",
      dataIndex: "name",
      render: (text, record) => (
        // <Link to={`/pipelines/${record.id}`}>{record.name}</Link>
        <div>{record?.name}</div>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Total Deal Value",
      dataIndex: "totalDealValue",
      render: (value) => 
        new Intl.NumberFormat("en-IN").format(value),
      sorter: (a, b) => a.totalDealvalue - b.totalDealvalue,
    },
    {
      title: "Total Deals",
      dataIndex: "totalDeals",
      sorter: (a, b) => a.totaldeal - b.totaldeal,
    },
    {
      title: "Status",
      dataIndex: "is_active",
      render: (text) => (
        <div>
          {text === "Y" ? (
            <span className="badge badge-pill badge-status bg-success">
              Active
            </span>
          ) : (
            <span className="badge badge-pill badge-status bg-danger">
              Inactive
            </span>
          )}
        </div>
      ),
      sorter: (a, b) => a.is_active.localeCompare(b.is_active),
    },
    ...((isUpdate || isDelete ) ? [{
      title: "Actions",
      dataIndex: "actions",
      render: (text, record, index) => (
        <div className="dropdown table-action" key={index}>
          <Link
            to="#"
            className="action-icon"
            data-bs-toggle="dropdown"
            aria-expanded="true"
          >
            <i className="fa fa-ellipsis-v"></i>
          </Link>
          <div
            className="dropdown-menu dropdown-menu-right"
            style={{
              position: "absolute",
              inset: "0px auto auto 0px",
              margin: "0px",
              transform: "translate3d(-99.3333px, 35.3333px, 0px)",
            }}
            data-popper-placement="bottom-start"
          >
           {isUpdate && <Link
              className="dropdown-item edit-popup"
              to="#"
              data-bs-toggle="offcanvas"
              data-bs-target="#edit_offcanvas_pipeline"
              onClick={() => setSelectedPipeline(record)} // Set selected pipeline
            >
              <i className="ti ti-edit text-blue"></i> Edit
            </Link>}
          {isDelete &&  <Link
              className="dropdown-item"
              to="#"
              // data-bs-toggle="modal"
              // data-bs-target="#delete_contact"
              onClick={() => handleDeletePipeline(record)}
            >
              <i className="ti ti-trash text-danger"></i> Delete
            </Link>}
          </div>
        </div>
      ),
    }]:[])
  ];
  // Get pipelines data from Redux store
  const { pipelines, loading, error, success } = useSelector(
    (state) => state.pipelines,
  );
    React.useEffect(() => {
      dispatch(fetchPipelines({search:searchText ,status:selectedStatus, ...selectedDateRange}));
    }, [dispatch,searchText ,selectedStatus, selectedDateRange]);
  
  React.useEffect(()=>{
      setPaginationData({
        currentPage:pipelines?.currentPage,
        totalPage:pipelines?.totalPages,
        totalCount:pipelines?.totalCount,
        pageSize : pipelines?.size
      })
    },[pipelines])
  
    const handlePageChange = ({ currentPage, pageSize }) => {
      setPaginationData((prev) => ({
        ...prev,
        currentPage,
        pageSize
      }));
      dispatch(fetchPipelines({search:searchText ,status: selectedStatus, ...selectedDateRange, page: currentPage, size: pageSize })); 
    };
  // Memoized filtered data
  const filteredData = useMemo(() => {
    let data = pipelines?.data || [];
    
    if (sortOrder === "ascending") {
      data = [...data].sort(
        (a, b) => new Date(a.createdDate) - new Date(b.createdDate),
      );
    } else if (sortOrder === "descending") {
      data = [...data].sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate),
      );
    }
    return data;
  }, [searchText, sortOrder, pipelines, columns]);
  // Export to Excel
  const exportToExcel = useCallback(() => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "contacts.xlsx");
  }, [filteredData]);

  // Export to PDF
  const exportToPDF = useCallback(() => {
    const doc = new jsPDF();

    // Add Title
    doc.text("Exported Pipelines", 14, 10);

    // Generate table using autoTable
    doc.autoTable({
      head: [columns.map((col) =>col.title !== "Actions" ?  col.title : "")], // Extract column headers
      body: filteredData.map((row) =>
        columns.map((col) => row[col.dataIndex] || ""),
      ), // Extract row data
      startY: 20,
    });

    doc.save("Pipelines.pdf");
  }, [filteredData, columns]);

  const handleSearch = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>DCC CRMS - Pinplines</title>
        <meta name="Pinplines" content="This is Pinplines page of DCC CRMS." />
      </Helmet>
      <div className="content">
        {error && (
          <FlashMessage
            type="error"
            message={error}
            onClose={() => dispatch(clearMessages())}
          />
        )}
        {success && (
          <FlashMessage
            type="success"
            message={success}
            onClose={() => dispatch(clearMessages())}
          />
        )}
        <div className="row">
          <div className="col-md-12">
            {/* Page Header */}
            <div className="page-header">
              <div className="row align-items-center">
                <div className="col-8">
                  <h4 className="page-title">
                    Pipeline
                    <span className="count-title">
                      {pipelines?.data?.length || 0}
                    </span>
                  </h4>
                </div>
                <div className="col-4 text-end">
                  <div className="head-icons">
                    <CollapseHeader />
                  </div>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            <div className="card ">
              <div className="card-header">
                {/* Search */}
                <div className="row align-items-center">
                  <SearchBar
                    searchText={searchText}
                    handleSearch={handleSearch}
                    label="Search Pipeline"
                  />

                  <div className="col-sm-8">
                    {/* Export Start & Add Button */}
                    <ExportData
                      exportToPDF={exportToPDF}
                      exportToExcel={exportToExcel}
                      label="Add Pipeline"
                      id="add_offcanvas_pipeline"
                      isCreate={isCreate}
                    />
                    {/* Export End & Add Button  */}
                  </div>
                </div>
                {/* /Search */}
              </div>

              <div className="card-body">
                {/* Filter */}
                <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-2 mb-4">
                  <div className="d-flex align-items-center flex-wrap row-gap-2">
                    <SortDropdown
                      sortOrder={sortOrder}
                      setSortOrder={setSortOrder}
                    />
                    <DateRangePickerComponent
                      selectedDateRange={selectedDateRange}
                      setSelectedDateRange={setSelectedDateRange}
                    />
                  </div>
                  <div className="d-flex align-items-center flex-wrap row-gap-2">
                    {/* <ManageColumnsDropdown /> */}
                    <FilterComponent
                      applyFilters={({ status }) => {
                        setSelectedStatus(status); // Set the selected status
                      }}
                    />
                  </div>
                </div>

                {/* /Filter */}
                {/* Pipline List */}

                <div className="table-responsive custom-table">
                  <Table
                    dataSource={filteredData}
                    columns={columns}
                    loading={loading}
                    isView={isView}
                    paginationData={paginationData}
                    onPageChange={handlePageChange} 
                  />
                </div>
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <div className="datatable-length" />
                  </div>
                  <div className="col-md-6">
                    <div className="datatable-paginate" />
                  </div>
                </div>
                {/* /Pipline List */}
              </div>
              <AddPipelineModal />
              <EditPipelineModal pipeline={selectedPipeline} />
              {/* Include the Delete deal Modal */}
              <DeleteAlert
                showModal={showDeleteModal}
                setShowModal={setShowDeleteModal}
                onDelete={deleteData}
                label="Pipeline"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PipelineList;
