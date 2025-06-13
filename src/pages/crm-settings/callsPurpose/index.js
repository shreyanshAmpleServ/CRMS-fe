import "bootstrap-daterangepicker/daterangepicker.css";
import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../../components/common/collapse-header";
import Table from "../../../components/common/dataTable/index";
import FlashMessage from "../../../components/common/modals/FlashMessage";
import {
  clearMessages
} from "../../../redux/calls"; // Redux actions and reducers for call statuses
import { all_routes } from "../../../routes/all_routes";
import DeleteAlert from "./alert/DeleteAlert";
import AddEditModal from "./modal/AddEditModal";

import moment from "moment";

import { useNavigate } from "react-router-dom";
import AddButton from "../../../components/datatable/AddButton";
import SearchBar from "../../../components/datatable/SearchBar";
import SortDropdown from "../../../components/datatable/SortDropDown";
import { deleteCallPurpose, fetchCallPurposes } from "../../../redux/callPurpose";
import { Helmet } from "react-helmet-async";

const CallPurposeList = () => {
  const [mode, setMode] = useState("add"); // 'add' or 'edit'
  const route = all_routes;

  const permissions =JSON?.parse(localStorage.getItem("permissions"))
  const allPermissions = permissions?.filter((i)=>i?.module_name === "Call Purpose")?.[0]?.permissions
const isAdmin = localStorage.getItem("role")=== "admin"
const isView =  isAdmin  ? true :  allPermissions?.view
const isCreate = isAdmin ? true : allPermissions?.create
const isUpdate = isAdmin ? true : allPermissions?.update
const isDelete = isAdmin ? true : allPermissions?.delete

  const dispatch = useDispatch();
  const columns = [
    {
      title: "Call Purpose Name",
      dataIndex: "name",
      render: (text, record) => (
        <div>{record.name}</div>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text, record) => (
        <div className="text-wrap">{record.description}</div>
      ),
      sorter: (a, b) => a.description.localeCompare(b.description),
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
              data-bs-target="#add_edit_call_status_modal"
              onClick={() => {
                setSelectedCallPurpose(record);
                setMode("edit");
              }}
            >
              <i className="ti ti-edit text-blue"></i> Edit
            </Link>}
          {isDelete &&  <Link
              className="dropdown-item"
              to="#"
              onClick={() => handleDeleteCallStatus(record)}
            >
              <i className="ti ti-trash text-danger"></i> Delete
            </Link>}
          </div>
        </div>
      ),
    }] : [])
  ];

  const navigate = useNavigate();
  const { callPurposes, loading, error, success } = useSelector(
    (state) => state.callPurposes,
  );

  React.useEffect(() => {
    dispatch(fetchCallPurposes());
  }, [dispatch]);

  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("ascending"); // Sorting

  const handleSearch = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  const filteredData = useMemo(() => {
    let data = callPurposes;
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
  }, [searchText, callPurposes, columns, sortOrder]);

  const handleDeleteCallStatus = (callpurpose) => {
    setSelectedCallPurpose(callpurpose);
    setShowDeleteModal(true);
  };

  const [selectedCallPurpose, setSelectedCallPurpose] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const deleteData = () => {
    if (selectedCallPurpose) {
      dispatch(deleteCallPurpose(selectedCallPurpose.id));
      // navigate(`/call-purposes`);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>DCC CRMS - Call Purpose</title>
        <meta name="Call-Purpose" content="This is Call-Purpose page of DCC CRMS." />
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
                    Call Purpose
                    <span className="count-title">{callPurposes?.length || 0}</span>
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
                    label="Search Call purposes"
                  />
                  {isCreate && <div className="col-sm-8">
                    <AddButton
                      label="Add Call Purpose"
                      id="add_edit_call_status_modal"
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
                    isView = {isView}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddEditModal mode={mode} initialData={selectedCallPurpose} />
      <DeleteAlert
        label="Call Purpose"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        selectedSource={selectedCallPurpose}
        onDelete={deleteData}
      />
    </div>
  );
};

export default CallPurposeList;
