import "bootstrap-daterangepicker/daterangepicker.css";
import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../../components/common/collapse-header";
import Table from "../../../components/common/dataTable/index";
import FlashMessage from "../../../components/common/modals/FlashMessage";
import DeleteAlert from "./alert/DeleteAlert";

import moment from "moment";

import SearchBar from "../../../components/datatable/SearchBar";
import SortDropdown from "../../../components/datatable/SortDropDown";
import { clearMessages, fetchManufacturer } from "../../../redux/manufacturer";
import { deleteTaxSetup, fetchTaxSetup } from "../../../redux/taxSetUp";
import ManageTaxModal from "./modal/ManageTaxModal";
import { Helmet } from "react-helmet-async";

const TaxSetUpList = () => {
  const [mode, setMode] = useState("add"); // 'add' or 'edit'
 
  const permissions =JSON?.parse(localStorage.getItem("permissions"))
  const allPermissions = permissions?.filter((i)=>i?.module_name === "Tax Setup")?.[0]?.permissions
 const isAdmin = localStorage.getItem("role")?.includes("admin")
  const isView = isAdmin || allPermissions?.view
  const isCreate = isAdmin || allPermissions?.create
  const isUpdate = isAdmin || allPermissions?.update
  const isDelete = isAdmin || allPermissions?.delete

  const dispatch = useDispatch();
  const columns = [
    {
      title: "Tax Name",
      dataIndex: "name",
      render: (text, record) => (
        <Link to={`#`}>{record.name}</Link>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Category",
      dataIndex: "category",
      // render: (text, record) => (
      //   <Link to={`#`}>{record.name}</Link>
      // ),
      sorter: (a, b) => a.category.localeCompare(b.category),
    },
    {
      title: "Rate",
      dataIndex: "rate",
      sorter: (a, b) =>  a.rate - b.rate,
    },
    // {
    //   title: "Account",
    //   dataIndex: "account_name",
    //   sorter: (a, b) => a.account_name.localeCompare(b.account_name),
    // },
    {
      title: "Valid From",
      dataIndex: "validFrom",
      render: (text) => (
        <span>{moment(text).format("DD-MM-YYYY")}</span> // Format the date as needed
      ),
      sorter: (a, b) =>  new Date(a.validFrom) - new Date(b.validFrom),
    },
    {
      title: "Valid To",
      dataIndex: "validTo",
      render: (text) => (
        <span>{moment(text).format("DD-MM-YYYY")}</span> // Format the date as needed
      ),
      sorter: (a, b) =>  new Date(a.validTo) - new Date(b.validTo),
    },

    {
      title: "Created Date",
      dataIndex: "createdate",
      render: (text) => (
        <span>{moment(text).format("DD-MM-YYYY")}</span> // Format the date as needed
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
   ...((isUpdate || isDelete) ?[ {
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
             data-bs-target="#offcanvas_add_edit_tax_setup"
              onClick={() => {
                setSelectedTax(record);
                setMode("edit");
              }}
            >
              <i className="ti ti-edit text-blue"></i> Edit
            </Link>}
           {isDelete && <Link
              className="dropdown-item"
              to="#"
              onClick={() => handleDeleteTax(record)}
            >
              <i className="ti ti-trash text-danger"></i> Delete
            </Link>}
          </div>
        </div>
      ),
    }]:[])
  ];

  const { taxs, loading, error, success } = useSelector(
    (state) => state.taxs
  );

  React.useEffect(() => {
    dispatch(fetchTaxSetup());
  }, [dispatch]);

  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("ascending"); // Sorting

  const handleSearch = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  const filteredData = useMemo(() => {
    let data = taxs;
    if (searchText) {
      data = data.filter((item) =>
        columns.some((col) =>
          item[col.dataIndex]
            ?.toString()
            .toLowerCase()
            .includes(searchText.toLowerCase())
        )
      );
    }
    if (sortOrder === "ascending") {
      data = [...data].sort((a, b) =>
        moment(a.createdDate).isBefore(moment(b.createdDate)) ? -1 : 1
      );
    } else if (sortOrder === "descending") {
      data = [...data].sort((a, b) =>
        moment(a.createdDate).isBefore(moment(b.createdDate)) ? 1 : -1
      );
    }
    return data;
  }, [searchText, taxs, columns, sortOrder]);

  const handleDeleteTax = (tax) => {
    setSelectedTax(tax);
    setShowDeleteModal(true);
  };

  const [selectedTax, setSelectedTax] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const deleteData = () => {
    if (selectedTax) {
      dispatch(deleteTaxSetup(selectedTax.id));
      // navigate(`/taxs`);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>DCC CRMS - Tax Setup</title>
        <meta name="Tax Setup" content="This is Tax Setup page of DCC CRMS." />
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
                    Tax Setup
                    <span className="count-title">
                      {taxs?.length || 0}
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
            <div className="card ">
              <div className="card-header">
                <div className="row align-items-center">
                  <SearchBar
                    searchText={searchText}
                    handleSearch={handleSearch}
                    label="Search Tax"
                  />
                   {isCreate &&
                    <div className="col-8">
                       <div className="d-flex align-items-center flex-wrap row-gap-2 justify-content-sm-end"><Link
                          to="#"
                          className="btn btn-primary"
                          data-bs-toggle="offcanvas"
                          data-bs-target={`#offcanvas_add_edit_tax_setup`}
                        >
                          <i className="ti ti-square-rounded-plus me-2" />
                          Add Tax
                        </Link> </div>
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

      {/* <AddEditModal mode={mode} initialData={selectedTax} /> */}
      <ManageTaxModal tax={selectedTax}  setTax={setSelectedTax} />
      <DeleteAlert
        label="Tax"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        selectedTax={selectedTax}
        onDelete={deleteData}
      />
    </div>
  );
};

export default TaxSetUpList;
