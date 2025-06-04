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
import { deleteSalesInvoice, fetchSalesInvoice } from "../../redux/salesInvoice/index.js";
import DeleteAlert from "./alert/DeleteAlert.js";
import AddCaseModal from "./modal/AddCaseModal.js";
import PreviewPurchaseOrder from "./modal/PreviewInvoice.js";
import UserGrid from "./UsersGrid.js";
import { deletePurchaseInvoice, fetchPurchaseInvoice } from "../../redux/purchaseInvoice/index.js";
import { deleteCases, fetchCases } from "../../redux/cases/index.js";
import { Helmet } from "react-helmet-async";

const Cases = () => {
  const [view, setView] = useState("list"); 
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("ascending"); // Sorting
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().subtract(180, "days"),
    endDate: moment(),
  });
  const [isChange,setIsChange] = useState(false)
  const dispatch = useDispatch();
  const [paginationData , setPaginationData] = useState()
  const [selectedStatus, setSelectedStatus] = useState(null);
  const permissions =JSON?.parse(localStorage.getItem("permissions"))
  const allPermissions = permissions?.filter((i)=>i?.module_name === "Cases")?.[0]?.permissions
 const isAdmin = localStorage.getItem("role")?.includes("admin")
  const isView = isAdmin || allPermissions?.view
  const isCreate = isAdmin || allPermissions?.create
  const isUpdate = isAdmin || allPermissions?.update
  const isDelete = isAdmin || allPermissions?.delete


  const columns = [
    {
      title: " Name",
      dataIndex: "name",
      sorter: (a, b) => (a.code || "").localeCompare(b.code || ""), // Fixed sorter logic
    },
    {
      title: "CaseNumber",
      dataIndex: "case_number",
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""), // Fixed sorter logic
    },
    {
      title: "Owner",
      dataIndex: "cases_user_owner",
      render: (text) => (
        <span>{text?.full_name}</span> // Format the date as needed
      ),
      sorter: (a, b) => (a.full_name || "").localeCompare(b.name || ""), // Fixed sorter logic
    },
    {
      title: "Produst",
      dataIndex: "case_product",
      render: (text) => (
        <span>{text?.name}</span> // Format the date as needed
      ),
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""), // Fixed sorter logic
    },
    {
      title: "Type",
      dataIndex: "case_type",
      sorter: (a, b) => (a || "").localeCompare(b || ""), // Fixed sorter logic
    },
    {
      title: "Priority",
      dataIndex: "case_priority",
      sorter: (a, b) => (a || "").localeCompare(b || ""), // Fixed sorter logic
    },
    {
      title: "Status",
      dataIndex: "case_status",
      sorter: (a, b) => (a || "").localeCompare(b || ""), // Fixed sorter logic
    },
    {
      title: "Origin",
      dataIndex: "case_origin",
      sorter: (a, b) => (a || "").localeCompare(b || ""), // Fixed sorter logic
    },
  
    {
      title: "Reason",
      dataIndex: "case_reasons",
      render: (text) => (  <span>{text?.name  || " - "}</span> ),
      sorter: (a, b) => (a || "").localeCompare(b || ""), // Fixed sorter logic
    },
   
    {
      title: "Reported by",
      dataIndex: "reported_by",
      render: (text) => (  <span>{text  || " - "}</span> ),
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
              data-bs-target="#offcanvas_add_edit_case"
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
    dispatch(fetchCases({search:searchText,...(isChange &&  selectedDateRange )}))
  }, [dispatch,selectedDateRange, searchText]);

  const { cases , loading, error, success } = useSelector(
    (state) => state.cases,
  );
  useEffect(()=>{
    setPaginationData({
      currentPage:cases?.currentPage,
      totalPage:cases?.totalPages,
      totalCount:cases?.totalCount,
      pageSize : cases?.size
    })
  },[cases])
  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize
    }));
    dispatch(fetchCases({search: searchText , ...selectedDateRange ,page: currentPage, size: pageSize })); 
  };
  
  const handleSearch = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  // const filteredData = products
  const filteredData = useMemo(() => {
    let data = cases?.data || [];

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
  }, [selectedDateRange, cases, columns, sortOrder]);

  const exportToExcel = useCallback(() => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cases");
    XLSX.writeFile(workbook, "Case.xlsx");
  }, [filteredData]);

  const exportToPDF = useCallback(() => {
    const doc = new jsPDF();
    doc.text("Exported Case", 14, 10);
    doc.autoTable({
      head: [columns.map((col) => col.title !== "Actions" ?  col.title : "")],
      body: filteredData.map((row) =>
        columns.map((col) => {
          if (col.dataIndex === "case_product") {
            return row.case_product?.name || ""; 
          }
          if (col.dataIndex === "cases_user_owner") {
            return row.cases_user_owner?.full_name || ""; 
          }
          if (col.dataIndex === "case_reasons") {
            return row.case_reasons?.name || ""; 
          }
          if (col.dataIndex === "createdate") {
            return moment(row.createdate).format("DD-MM-YYYY") || ""; 
          }
          return row[col.dataIndex] || "";
        })
      ),
      startY: 20,
    });
    doc.save("Cases.pdf");
  }, [filteredData, columns]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteUser = (user) => {
    setSelectedOrder(user);
    setShowDeleteModal(true);
  };

  const deleteData = () => {
    if (selectedOrder) {
      dispatch(deleteCases(selectedOrder.id));
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="page-wrapper">
     <Helmet>
       <title>DCC CRMS - Cases</title>
       <meta name="Cases" content="This is Cases page of DCC CRMS." />
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
                   Cases
                    <span className="count-title">{cases?.data?.length || 0}</span>
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
                    label="Search Case"
                  />

                  <div className="col-sm-8">
                    <ExportData
                      exportToPDF={exportToPDF}
                      exportToExcel={exportToExcel}
                      label="Add Case"
                      isCreate={isCreate}
                      id="offcanvas_add_edit_case"
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
      <AddCaseModal cases={selectedOrder} setCases={setSelectedOrder} />
      {/* <PreviewPurchaseOrder order={selectedOrder} formatNumber={formatNumber} setOrder={setSelectedOrder}   /> */}

      {/* <AddFile data={null} setData={setSelectedOrder} type={"cases"} type_id={selectedOrder?.id} type_name={selectedOrder?.order_code} /> */}


      {/* <EditUserModal user={selectedOrder} /> */}
      <DeleteAlert
        label="Case"
        showModal={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={deleteData}
      />
    </div>
  );
};

export default Cases;
