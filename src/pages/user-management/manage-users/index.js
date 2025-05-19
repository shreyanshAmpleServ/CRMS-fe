import "bootstrap-daterangepicker/daterangepicker.css";
import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Table from "../../../components/common/dataTable/index";

import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import * as XLSX from "xlsx";
import CollapseHeader from "../../../components/common/collapse-header";
import FlashMessage from "../../../components/common/modals/FlashMessage";
import UnauthorizedImage from "../../../components/common/UnAuthorized.js";
import DateRangePickerComponent from "../../../components/datatable/DateRangePickerComponent";
import ExportData from "../../../components/datatable/ExportData";
import SearchBar from "../../../components/datatable/SearchBar";
import SortDropdown from "../../../components/datatable/SortDropDown";
import ViewIconsToggle from "../../../components/datatable/ViewIconsToggle";
import {
  clearMessages,
  deleteUser,
  fetchUsers,
} from "../../../redux/manage-user";
import DeleteAlert from "./alert/DeleteAlert";
import AddUserModal from "./modal/AddUserModal";
import EditUserModal from "./modal/EditUserModal";
import FilterComponent from "./modal/FilterComponent";
import UserGrid from "./UsersGrid";
import { Helmet } from "react-helmet-async";

const ManageUsers = () => {
  const [view, setView] = useState("list"); 
  const dispatch = useDispatch();
  const [paginationData , setPaginationData] = useState()
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("ascending"); // Sorting
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().subtract(180, "days"),
    endDate: moment(),
  });
  const permissions =JSON?.parse(localStorage.getItem("permissions"))
  const allPermissions = permissions?.filter((i)=>i?.module_name === "Manage Users")?.[0]?.permissions
  const isAdmin = localStorage.getItem("role")=== "Admin"
  const isView =  isAdmin  ? true :  allPermissions?.view
  const isCreate = isAdmin ? true : allPermissions?.create
  const isUpdate = isAdmin ? true : allPermissions?.update
  const isDelete = isAdmin ? true : allPermissions?.delete

  const columns = [
    {
      title: "User Name",
      dataIndex: "full_name",
      render: (text, record) => (
        <Link to={`/manage-users/${record.id}`}>{record.full_name}</Link>
      ),
      sorter: (a, b) => (a.full_name || "").localeCompare(b.full_name || ""), // Fixed sorter logic
    },
    {
      title: "Email/Username",
      dataIndex: "email",
      sorter: (a, b) => (a.email || "").localeCompare(b.email || ""), // Fixed sorter logic
    },
    {
      title: "Role",
      dataIndex: "crms_d_user_role",
      render: (text) => (
        <span>{text?.[0]?.crms_m_role?.role_name}</span> // Format the date as needed
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
    ...((isUpdate || isDelete ) ?[{
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
              data-bs-target="#offcanvas_edit_user"
              onClick={() => setSelectedUser(record)}
            >
              <i className="ti ti-edit text-blue"></i> Edit
            </Link>}
         {isDelete &&   <Link
              className="dropdown-item"
              to="#"
              onClick={() => handleDeleteUser(record)}
            >
              <i className="ti ti-trash text-danger"></i> Delete
            </Link>}
          </div>
        </div>
      ),
    }] : [])
  ];

  const { users, loading, error, success } = useSelector(
    (state) => state.users,
  );

  React.useEffect(() => {
    dispatch(fetchUsers({search:searchText, ...selectedDateRange}));
  }, [dispatch,searchText, selectedDateRange]);

  React.useEffect(()=>{
    setPaginationData({
      currentPage:users?.currentPage,
      totalPage:users?.totalPages,
      totalCount:users?.totalCount,
      pageSize : users?.size
    })
  },[users])

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize
    }));
    dispatch(fetchUsers({search:searchText, ...selectedDateRange , page: currentPage, size: pageSize })); 
  };
  
  const handleSearch = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  const filteredData = useMemo(() => {
    let data = users?.data || [];
    // if (searchText) {
    //   data = data.filter((item) =>
    //     columns.some((col) =>
    //       item[col.dataIndex]
    //         ?.toString()
    //         .toLowerCase()
    //         .includes(searchText.toLowerCase()),
    //     ),
    //   );
    // }

    if (selectedDateRange) {
      const { startDate, endDate } = selectedDateRange;
      const startMoment = moment(startDate);
      const endMoment = moment(endDate);
      data = data.filter((item) => {
        const dateField = item.createdDate;
        const itemDate = moment(dateField);
        return itemDate.isBetween(startMoment, endMoment, "day", "[]");
      });
    }
    if (selectedStatus !== null) {
      data = data.filter((item) => item.is_active === selectedStatus);
    }
    if (sortOrder === "ascending") {
      data = [...data].sort((a, b) => {
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
  }, [searchText, selectedDateRange, users, columns, sortOrder]);

  const exportToExcel = useCallback(() => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "users.xlsx");
  }, [filteredData]);

  const exportToPDF = useCallback(() => {
    const doc = new jsPDF();
    doc.text("Exported Users", 14, 10);
    doc.autoTable({
      head: [columns.map((col) => col.title !== "Actions" ?  col.title : "")],
      body: filteredData.map((row) =>
        columns.map((col) => row[col.dataIndex] || ""),
      ),
      startY: 20,
    });
    doc.save("users.pdf");
  }, [filteredData, columns]);

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const deleteData = () => {
    if (selectedUser) {
      dispatch(deleteUser(selectedUser.id));
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>DCC CRMS - User</title>
        <meta name="User" content="This is User page of DCC CRMS." />
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
                    Users
                    <span className="count-title">{users?.totalCount || 0}</span>
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
                    label="Search Users"
                  />

                  <div className="col-sm-8">
                    <ExportData
                      exportToPDF={exportToPDF}
                      exportToExcel={exportToExcel}
                      label="Add Users"
                      isCreate= {isCreate}
                      id="offcanvas_add_user"
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
                    />
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

              {isView ?   <div className="table-responsive custom-table">
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
                </div> : <UnauthorizedImage />}
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddUserModal />
      <EditUserModal user={selectedUser} />
      <DeleteAlert
        label="User"
        showModal={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={deleteData}
      />
    </div>
  );
};

export default ManageUsers;
