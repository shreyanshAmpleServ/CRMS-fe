import "bootstrap-daterangepicker/daterangepicker.css";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Table from "../../components/common/dataTableNew/index";

import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import * as XLSX from "xlsx";
import CollapseHeader from "../../components/common/collapse-header.js";
import FlashMessage from "../../components/common/modals/FlashMessage.js";
import UnauthorizedImage from "../../components/common/UnAuthorized.js/index.js";
import DateRangePickerComponent from "../../components/datatable/DateRangePickerComponent.js";
import ExportData from "../../components/datatable/ExportData.js";
import SearchBar from "../../components/datatable/SearchBar.js";
import SortDropdown from "../../components/datatable/SortDropDown.js";
import {
  clearMessages
} from "../../redux/manage-user/index.js";
import { deleteSolutions, fetchSolutions } from "../../redux/solutions/index.js";
import DeleteAlert from "./alert/DeleteAlert.js";
import AddSolutionModal from "./modal/AddSolutionModal.js";
import UserGrid from "./UsersGrid.js";
import { Helmet } from "react-helmet-async";

const Solutions = () => {
  const [view, setView] = useState("list"); 
  const [isChange,setIsChange] = useState(false)
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("ascending"); // Sorting
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().subtract(180, "days"),
    endDate: moment(),
  });
  const dispatch = useDispatch();
  const [paginationData , setPaginationData] = useState()
  const [selectedStatus, setSelectedStatus] = useState(null);
  const permissions =JSON?.parse(localStorage.getItem("permissions"))
  const allPermissions = permissions?.filter((i)=>i?.module_name === "Solutions")?.[0]?.permissions
 const isAdmin = localStorage.getItem("role")?.includes("admin")
  const isView = isAdmin || allPermissions?.view
  const isCreate = isAdmin || allPermissions?.create
  const isUpdate = isAdmin || allPermissions?.update
  const isDelete = isAdmin || allPermissions?.delete


  const columns = [
    {
      title: " Title",
      dataIndex: "title",
      sorter: (a, b) => (a.code || "").localeCompare(b.code || ""), // Fixed sorter logic
    },

    {
      title: "Owner",
      dataIndex: "solution_user_owner",
      render: (text) => (
        <span>{text?.full_name}</span> // Format the date as needed
      ),
      sorter: (a, b) => (a.full_name || "").localeCompare(b.name || ""), // Fixed sorter logic
    },
    {
      title: "Produst",
      dataIndex: "solution_product",
      render: (text) => (
        <span>{text?.name}</span> // Format the date as needed
      ),
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""), // Fixed sorter logic
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (   <span className={`badge badge-pill badge-status ${text === "O" ? "bg-secondary" : text=== "L" ? "bg-success" : text === "C" ? "bg-danger" : text==="P" ? "bg-purple" : "  "}`}>
        {text === "O" ? "Open"  :text=== "L" ? "Closed" : text === "C" ? "Canceled" : text==="P" ? "Pending" : " -- "  || " - "}</span> ),
      sorter: (a, b) => (a || "").localeCompare(b || ""),// Sort by date
    },
    {
      title: "Created Date",
      dataIndex: "createdate",
      render: (text) => (
        <span>{moment(text).format("DD-MM-YYYY")}</span> // Format the date as needed
      ),
      sorter: (a, b) => new Date(a.createdDate) - new Date(b.createdDate), // Sort by date
    },
    ...((isUpdate || isDelete) ?
      [ {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="dropdown table-action">
          <Link
            to="#"
            className="action-icon"
            data-bs-toggle="dropdown"
            aria-expanded="true"
          >
            <i className="fa fa-ellipsis-v"></i>
          </Link>
          <div className="dropdown-menu dropdown-menu-right">
            {isUpdate && <Link
              className="dropdown-item edit-popup"
              to="#"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvas_add_edit_solution"
              onClick={() => setSelectedOrder(record)}
            >
              <i className="ti ti-edit text-blue"></i> Edit
            </Link>}
           {isDelete && <Link
              className="dropdown-item"
              to="#"
              onClick={() => handleDeleteUser(record)}
            >
              <i className="ti ti-trash text-danger"></i> Delete
            </Link>}
             {/* <Link
              className="dropdown-item edit-popup"
              to="#"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvas_preview_purchase_invoice"
              onClick={() => setSelectedOrder(record)}
            >
              <i className="ti ti-eye text-secondary"></i> Preview
            </Link> */}
            {/* <Link
               to="#"
                className="dropdown-item"
               data-bs-toggle="modal"
               data-bs-target="#new_file"
               onClick={() => setSelectedOrder(record)}
              >
             <i className="ti ti-upload text-success"></i>Upload File
            </Link> */}
          </div>
        </div>
      ),
    }]
  : []),
  ];

 

  React.useEffect(() => {
    dispatch(fetchSolutions({search:searchText ,  ...(isChange &&  selectedDateRange ) }))
  }, [dispatch,selectedDateRange, searchText]);

  const { solutions , loading, error, success } = useSelector(
    (state) => state.solutions,
  );
  useEffect(()=>{
    setPaginationData({
      currentPage:solutions?.currentPage,
      totalPage:solutions?.totalPages,
      totalCount:solutions?.totalCount,
      pageSize : solutions?.size
    })
  },[solutions])
  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize
    }));
    dispatch(fetchSolutions({search: searchText ,...selectedDateRange,page: currentPage, size: pageSize })); 
  };
  
  const handleSearch = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  // const filteredData = products
  const filteredData = useMemo(() => {
    let data = solutions?.data || [];

    if (selectedStatus !== null) {
      data = data.filter((item) => item.is_active === selectedStatus);
    }
    if (sortOrder === "ascending") {
      data = [...data]?.sort((a, b) => {
        const dateA = moment(a.createdDate);
        const dateB = moment(b.createdDate);
        return dateA.isBefore(dateB) ? -1 : 1;
      });
    } else if (sortOrder === "descending") {
      data = [...data].sort((a, b) => {
        const dateA = moment(a.createdDate);
        const dateB = moment(b.createdDate);
        return dateA.isBefore(dateB) ? 1 : -1;
      });
    }
    return data;
  }, [selectedDateRange, solutions, columns, sortOrder]);

  const exportToExcel = useCallback(() => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Solutions");
    XLSX.writeFile(workbook, "Solutions.xlsx");
  }, [filteredData]);

  const exportToPDF = useCallback(() => {
    const doc = new jsPDF();
    doc.text("Exported Solution", 14, 10);
    doc.autoTable({
      head: [columns.map((col) => col.title !== "Actions" ?  col.title : "")],
      body: filteredData.map((row) =>
        columns.map((col) => {
          if (col.dataIndex === "solution_product") {
            return row.case_product?.name || ""; 
          }
          if (col.dataIndex === "solution_user_owner") {
            return row.cases_user_owner?.full_name || ""; 
          }
          if (col.dataIndex === "createdate") {
            return moment(row.createdate).format("DD-MM-YYYY") || ""; 
          }
          return row[col.dataIndex] || "";
        })
      ),
      startY: 20,
    });
    doc.save("Solutions.pdf");
  }, [filteredData, columns]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteUser = (user) => {
    setSelectedOrder(user);
    setShowDeleteModal(true);
  };

  const deleteData = () => {
    if (selectedOrder) {
      dispatch(deleteSolutions(selectedOrder.id));
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>DCC CRMS - Solutions</title>
        <meta name="Solutions" content="This is Solutions page of DCC CRMS." />
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
            <div className="page-header">
              <div className="row align-items-center">
                <div className="col-8">
                  <h4 className="page-title">
                   Solutions
                    <span className="count-title">{solutions?.data?.length || 0}</span>
                  </h4>
                </div>
                <div className="col-4 text-end">
                  <div className="head-icons">
                    <CollapseHeader />
                  </div>
                </div>
              </div>
            </div>
            <div className="card ">
              <div className="card-header">
                <div className="row align-items-center">
                  <SearchBar
                    searchText={searchText}
                    handleSearch={handleSearch}
                    label="Search Solution"
                  />

                  <div className="col-sm-8">
                    <ExportData
                      exportToPDF={exportToPDF}
                      exportToExcel={exportToExcel}
                      label="Add Solution"
                      isCreate={isCreate}
                      id="offcanvas_add_edit_solution"
                    />
                  </div>
                </div>
              </div>

              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-2 mb-4">
                  <div className="d-flex align-items-center flex-wrap row-gap-2">
                    <SortDropdown
                      sortOrder={sortOrder}
                      setSortOrder={setSortOrder}
                    />
                    <DateRangePickerComponent
                      selectedDateRange={selectedDateRange}
                      setSelectedDateRange={setSelectedDateRange}
                      setWhoChange={setIsChange}
                      ChangeName={true}
                    />
                  </div>
                  <div className="d-flex align-items-center flex-wrap row-gap-2">
                    {/* <FilterComponent
                      applyFilters={({ status }) => {
                        setSelectedStatus(status);
                      }}
                    />
                    <ViewIconsToggle view={view} setView={setView} /> */}
                  </div>
                </div>

              {isView ?  <div className="table-responsive custom-table">
                  {view === "list" ? (
                    <Table
                      dataSource={filteredData}
                      columns={columns}
                      loading={loading}
                      paginationData={paginationData}
                      onPageChange={handlePageChange}  
                    />
                  ) : (
                    <UserGrid data={filteredData} />
                  )}
                </div>: <UnauthorizedImage />}
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddSolutionModal solution={selectedOrder} setSolution={setSelectedOrder} />
      {/* <PreviewPurchaseOrder order={selectedOrder} formatNumber={formatNumber} setOrder={setSelectedOrder}   /> */}

      {/* <AddFile data={null} setData={setSelectedOrder} type={"cases"} type_id={selectedOrder?.id} type_name={selectedOrder?.order_code} /> */}


      {/* <EditUserModal user={selectedOrder} /> */}
      <DeleteAlert
        label="Solution"
        showModal={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={deleteData}
      />
    </div>
  );
};

export default Solutions;
