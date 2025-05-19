import "bootstrap-daterangepicker/daterangepicker.css";
import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Table from "../../../components/common/dataTable/index";

import "jspdf-autotable";
import moment from "moment";
import CollapseHeader from "../../../components/common/collapse-header";
import FlashMessage from "../../../components/common/modals/FlashMessage";
import AddButton from "../../../components/datatable/AddButton";
import SearchBar from "../../../components/datatable/SearchBar";
import SortDropdown from "../../../components/datatable/SortDropDown";
import { clearMessages, deleteRole, fetchRoles } from "../../../redux/roles";
import DeleteAlert from "./alert/DeleteAlert";
import AddEditModal from "./modal/AddEditModal";
import { PermissionModal  } from "./modal/PermissionModal";
import { fetchPermissions , clearMessages as clearMessagesPermission } from "../../../redux/permissions";
import { Helmet } from "react-helmet-async";

const RolesPermissions = () => {
  const [mode, setMode] = useState("add"); 
  const [permissionModal,setPermissionModal] = useState(false)
  const [moduleId,setModuleId] = useState()
  const dispatch = useDispatch();

  const permissions =JSON?.parse(localStorage.getItem("permissions"))
  const allPermissions = permissions?.filter((i)=>i?.module_name === "Roles & Permission")?.[0]?.permissions
  const isAdmin = localStorage.getItem("role")=== "Admin"
  const isView =  isAdmin  ? true :  allPermissions?.view
  const isCreate = isAdmin ? true : allPermissions?.create
  const isUpdate = isAdmin ? true : allPermissions?.update
  const isDelete = isAdmin ? true : allPermissions?.delete
  
  const columns = [
    {
      title: "Role Name",
      dataIndex: "role_name",
      render: (text, record) => (
        <Link  style={{cursor:"pointer"}} className="text-decoration-underline"
         onClick={()=>{setPermissionModal(true);setModuleId({id:record?.id,name:record?.role_name})}}>{record.role_name}
         </Link>
      ),
      sorter: (a, b) => a.role_name.localeCompare(b.role_name),
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
      sorter: (a, b) => a.is_active.localeCompare(b.is_active),
    },
    ...((isUpdate || isDelete) ? [{
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
              data-bs-toggle="modal"
              data-bs-target="#add_edit_role_modal"
              onClick={() => {
                setSelectedRole(record);
                setMode("edit");
              }}
            >
              <i className="ti ti-edit text-blue"></i> Edit
            </Link>}
         {isDelete &&   <Link
              className="dropdown-item"
              to="#"
              onClick={() => handleDeleteRole(record)}
            >
              <i className="ti ti-trash text-danger"></i> Delete
            </Link>}
          </div>
        </div>
      ),
    }]:[])
  ];

  const { roles, loading, error, success } = useSelector(
    (state) => state.roles,
  );
  const {  error:errorPermission, success:successPermission } = useSelector(
    (state) => state.permissions,
  );

  React.useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [error ,errorPermission, successPermission, success]);

  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("ascending"); // Sorting

  const handleSearch = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  const filteredData = useMemo(() => {
    let data = roles;
    if (searchText) {
      data = data.filter((item) =>
        columns.some((col) =>
          item[col.dataIndex]
            ?.toString()
            .toLowerCase()
            .includes(searchText.toLowerCase()),
        ),
      );
    }
    if (sortOrder === "ascending") {
      data = [...data].sort((a, b) =>
        moment(a.createdDate).isBefore(moment(b.createdDate)) ? -1 : 1,
      );
    } else if (sortOrder === "descending") {
      data = [...data].sort((a, b) =>
        moment(a.createdDate).isBefore(moment(b.createdDate)) ? 1 : -1,
      );
    }
    return data;
  }, [searchText, roles, columns, sortOrder]);

  const handleDeleteRole = (role) => {
    setSelectedRole(role);
    setShowDeleteModal(true);
  };

  const [selectedRole, setSelectedRole] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const deleteData = () => {
    if (selectedRole) {
      dispatch(deleteRole(selectedRole.id));
      setShowDeleteModal(false);
    }
  };
 return (
    <div className="page-wrapper">
      <Helmet>
        <title>DCC CRMS - Roles & Permissions</title>
        <meta name="Roles_&_Permissions" content="This is Roles_&_Permissions page of DCC CRMS." />
      </Helmet>
      <div className="content">
        {(errorPermission || error) && (
          <FlashMessage
            type="error"
            message={errorPermission ? errorPermission : error }
            onClose={() => dispatch(error ? clearMessages() : clearMessagesPermission())}
          />
        )} 
        {( success ||  successPermission) && (
          <FlashMessage
            type="success"
            message={success ? success : successPermission}
            onClose={() => dispatch(success ? clearMessages() : clearMessagesPermission())}
          />
        )}

        <div className="row">
          <div className="col-md-12">
            <div className="page-header">
              <div className="row align-items-center">
                <div className="col-8">
                  <h4 className="page-title">
                    Roles
                    <span className="count-title">{roles?.length || 0}</span>
                  </h4>
                </div>
                <div className="col-4 text-end">
                  <div className="head-icons">
                    <CollapseHeader />
                  </div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <div className="row align-items-center">
                  <SearchBar
                    searchText={searchText}
                    handleSearch={handleSearch}
                    label="Search Roles"
                  />
                 {isCreate && <div className="col-sm-8">
                    <AddButton
                      label="Add Role"
                      id="add_edit_role_modal"
                      setMode={() => setMode("add")}
                    />
                  </div>}
                </div>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-2 mb-4">
                  <div className="d-flex align-items-center flex-wrap row-gap-2">
                    <SortDropdown
                      sortOrder={sortOrder}
                      setSortOrder={setSortOrder}
                    />
                  </div>
                </div>

                <div className="table-responsive custom-table">
                  <Table
                    dataSource={filteredData}
                    columns={columns}
                    loading={loading}
                    isView={isView}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddEditModal mode={mode} initialData={selectedRole} />
      <DeleteAlert
        label="Role"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        selectedSource={selectedRole}
        onDelete={deleteData}
      />
      <PermissionModal 
        permissionModal={permissionModal}
        setPermissionModal={setPermissionModal}
        moduleId={moduleId}
      />
    </div>
  );
};

export default RolesPermissions;
