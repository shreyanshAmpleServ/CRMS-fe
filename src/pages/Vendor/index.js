import "bootstrap-daterangepicker/daterangepicker.css";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Table from "../../components/common/dataTable/index";

import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import * as XLSX from "xlsx";
import CollapseHeader from "../../components/common/collapse-header";
import FlashMessage from "../../components/common/modals/FlashMessage";
import DateRangePickerComponent from "../../components/datatable/DateRangePickerComponent";
import ExportData from "../../components/datatable/ExportData";
import SearchBar from "../../components/datatable/SearchBar";
import SortDropdown from "../../components/datatable/SortDropDown";
import ViewIconsToggle from "../../components/datatable/ViewIconsToggle";
import {
  clearMessages
} from "../../redux/manage-user";
import { deleteVenor, fetchVendors } from "../../redux/vendor";
import DeleteAlert from "./alert/DeleteAlert";
import FilterComponent from "./modal/FilterComponent";
import UserGrid from "./UsersGrid";
import UnauthorizedImage from "../../components/common/UnAuthorized.js";
import AddVendorModal from "./modal/AddVendorModal.js";
import { Helmet } from "react-helmet-async";

const Vendor = () => {
  const [view, setView] = useState("list"); 
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("ascending"); // Sorting
  const [selectedDateRange, setSelectedDateRange] = useState({
    // startDate: moment().subtract(180, "days"),
    // endDate: moment(),
  });

  const dispatch = useDispatch();
    const [paginationData , setPaginationData] = useState()
      const [isChange,setIsChange] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState(null);
  const permissions =JSON?.parse(localStorage.getItem("permissions"))
  const allPermissions = permissions?.filter((i)=>i?.module_name === "Vendor")?.[0]?.permissions
 const isAdmin = localStorage.getItem("role")?.includes("admin")
  const isView = isAdmin || allPermissions?.view
  const isCreate = isAdmin || allPermissions?.create
  const isUpdate = isAdmin || allPermissions?.update
  const isDelete = isAdmin || allPermissions?.delete

  const columns = [
    {
      title: "Vendor Name",
      dataIndex: "name",
      render: (text, record) => (
        <Link to={`/vendor/${record.id}`}>{record.name}</Link>
      ),
      sorter: (a, b) => (a.full_name || "").localeCompare(b.full_name || ""), // Fixed sorter logic
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => (a.email || "").localeCompare(b.email || ""), // Fixed sorter logic
    },
    {
      title: "Phone",
      dataIndex: "phone",
      // render: (text) => (
      //   <span>{text?.full_name}</span> // Format the date as needed
      // ),
      sorter: (a, b) => (a.role || "").localeCompare(b.role || ""), // Fixed sorter logic
    },
    {
      title: "Owner",
      dataIndex: "crms_m_user",
      render: (text) => (
        <span>{text?.full_name}</span> // Format the date as needed
      ),
      sorter: (a, b) => (a.role || "").localeCompare(b.role || ""), // Fixed sorter logic
    },
    {
      title: "Created Date",
      dataIndex: "createdate",
      render: (text) => (
        <span>{moment(text).format("DD MMM YYYY, hh:mm a")}</span> // Format the date as needed
      ),
      sorter: (a, b) => new Date(a.createdDate) - new Date(b.createdDate), // Sort by date
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
      sorter: (a, b) => (a.is_active || "").localeCompare(b.is_active || ""), // Fixed sorter logic
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
              data-bs-target="#offcanvas_add_vendor"
              onClick={() => setSelectedVendor(record)}
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
          </div>
        </div>
      ),
    }]
  : []),
  ];

 

  React.useEffect(() => {
    dispatch(fetchVendors({search:searchText ,...(isChange &&  selectedDateRange ) }));
  }, [dispatch,searchText , selectedDateRange]);
  
  const { vendor, loading, error, success } = useSelector(
    (state) => state.vendor,
  );
  useEffect(()=>{
    setPaginationData({
      currentPage:vendor?.currentPage,
      totalPage:vendor?.totalPages,
      totalCount:vendor?.totalCount,
      pageSize : vendor?.size
    })
  },[vendor])

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize
    }));
    dispatch(fetchVendors({search:searchText , ...selectedDateRange, page: currentPage, size: pageSize })); 
  };
  const handleSearch = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  const filteredData = useMemo(() => {
    let data = vendor?.data || [];

    if (selectedStatus !== null) {
      data = data?.filter((item) => item.is_active === selectedStatus);
    }
    if (sortOrder === "ascending") {
      data = [...data]?.sort((a, b) => {
        const dateA = moment(a.createdDate);
        const dateB = moment(b.createdDate);
        return dateA.isBefore(dateB) ? -1 : 1;
      });
    } else if (sortOrder === "descending") {
      data = [...data]?.sort((a, b) => {
        const dateA = moment(a.createdDate);
        const dateB = moment(b.createdDate);
        return dateA.isBefore(dateB) ? 1 : -1;
      });
    }
    return data;
  }, [searchText, selectedDateRange, vendor, columns, sortOrder]);

  const exportToExcel = useCallback(() => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "vendor");
    XLSX.writeFile(workbook, "vendor.xlsx");
  }, [filteredData]);

  const exportToPDF = useCallback(() => {
    const doc = new jsPDF();
    doc.text("Exported vendor", 14, 10);
    doc.autoTable({
      head: [columns.map((col) => col.title !== "Actions" ?  col.title : "")],
      body: filteredData?.map((row) =>
        columns.map((col) => {
          if (col.dataIndex === "crms_m_user") {
            return row.crms_m_user?.full_name || ""; 
          }
          if (col.dataIndex === "createdate") {
            return moment(row.createdate).format("DD-MM-YYYY") || ""; 
          }
          return row[col.dataIndex] || "";
        })
      ),
      startY: 20,
    });
    doc.save("vendor.pdf");
  }, [filteredData, columns]);

  const handleDeleteUser = (user) => {
    setSelectedVendor(user);
    setShowDeleteModal(true);
  };

  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const deleteData = () => {
    if (selectedVendor) {
      dispatch(deleteVenor(selectedVendor.id));
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>DCC CRMS - Vendors</title>
        <meta name="Vendors" content="This is Vendors page of DCC CRMS." />
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
                    Vendor
                    <span className="count-title">{vendor?.data?.length || 0}</span>
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
                    label="Search Vendor"
                  />

                  <div className="col-sm-8">
                    <ExportData
                      exportToPDF={exportToPDF}
                      exportToExcel={exportToExcel}
                      label="Add Vendor"
                      isCreate={isCreate}
                      id="offcanvas_add_vendor"
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
                    {/* <DateRangePickerComponent
                      selectedDateRange={selectedDateRange}
                      setSelectedDateRange={setSelectedDateRange}
                    /> */}
                  </div>
                  <div className="d-flex align-items-center flex-wrap row-gap-2">
                    <FilterComponent
                      applyFilters={({ status }) => {
                        setSelectedStatus(status);
                      }}
                    />
                    <ViewIconsToggle view={view} setView={setView} />
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
      <AddVendorModal vendor={selectedVendor} setVendor={setSelectedVendor} />

      {/* <EditUserModal user={selectedVendor} /> */}
      <DeleteAlert
        label="Vendor"
        showModal={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={deleteData}
      />
    </div>
  );
};

export default Vendor;
