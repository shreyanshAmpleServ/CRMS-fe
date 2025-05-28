import "bootstrap-daterangepicker/daterangepicker.css";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Table from "../../components/common/dataTableNew/index";

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
import DeleteAlert from "./alert/DeleteAlert";
import FilterComponent from "./modal/FilterComponent";
import UserGrid from "./UsersGrid";
import UnauthorizedImage from "../../components/common/UnAuthorized.js";
import AddProductModal from "./modal/AddProductModal.js";
import { deleteProduct, fetchProducts } from "../../redux/products/index.js";
import { Helmet } from "react-helmet-async";


const Product = () => {
  const [view, setView] = useState("list"); 
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
  const allPermissions = permissions?.filter((i)=>i?.module_name === "Products")?.[0]?.permissions
 const isAdmin = localStorage.getItem("role")?.includes("admin")
  const isView = isAdmin || allPermissions?.view
  const isCreate = isAdmin || allPermissions?.create
  const isUpdate = isAdmin || allPermissions?.update
  const isDelete = isAdmin || allPermissions?.delete

  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      sorter: (a, b) => (a.code || "").localeCompare(b.code || ""), // Fixed sorter logic
    },
    {
      title: "Product",
      dataIndex: "name",
      render: (text, record) => (
        <Link to={`/product/${record.id}`}>{record.name}</Link>
      ),
      sorter: (a, b) => (a.full_name || "").localeCompare(b.full_name || ""), // Fixed sorter logic
    },
    {
      title: "Manufacturer",
      dataIndex: "manufacturer",
      render: (text) => (
        <span>{text?.name}</span> // Format the date as needed
      ),
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""), // Fixed sorter logic
    },
    {
      title: "Vendor",
      dataIndex: "vendor",
      render: (text) => (
        <span>{text?.name}</span> // Format the date as needed
      ),
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""), // Fixed sorter logic
    },
    {
      title: "Unit Price",
      dataIndex: "unit_price",
      // render: (text) => (
      //   <span>{text?.name}</span> // Format the date as needed
      // ),
      sorter: (a, b) =>a-b, // Fixed sorter logic
    },
    {
      title: "Currency",
      dataIndex: "Currency",
      render: (text) => (
        <span>{text?.code}</span> // Format the date as needed
      ),
      sorter: (a, b) => (a.code || "").localeCompare(b.code || ""), // Fixed sorter logic
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
              data-bs-target="#offcanvas_add_edit_product"
              onClick={() => setSelectedproduct(record)}
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
    dispatch(fetchProducts({search:searchText , ...selectedDateRange}));
  }, [dispatch,searchText,selectedDateRange]);
  const { products, loading, error, success } = useSelector(
    (state) => state.products,
  );
  useEffect(()=>{
    setPaginationData({
      currentPage:products?.currentPage,
      totalPage:products?.totalPages,
      totalCount:products?.totalCount,
      pageSize : products?.size
    })
  },[products])

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize
    }));
    dispatch(fetchProducts({search:searchText, ...selectedDateRange, page: currentPage, size: pageSize })); 
  };

  const handleSearch = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  // const filteredData = products
  const filteredData = useMemo(() => {
    let data = products?.data || [];

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
  }, [searchText, selectedDateRange, products, columns, sortOrder]);

  const exportToExcel = useCallback(() => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "products");
    XLSX.writeFile(workbook, "products.xlsx");
  }, [filteredData]);

  const exportToPDF = useCallback(() => {
    const doc = new jsPDF();
    doc.text("Exported products", 14, 10);
    doc.autoTable({
      head: [columns.map((col) => col.title !== "Actions" ?  col.title : "")],
      body: filteredData.map((row) =>
              columns.map((col) => {
                if (col.dataIndex === "manufacturer") {
                  return row.manufacturer?.name || ""; 
                }
                if (col.dataIndex === "vendor") {
                  return row.vendor?.name || ""; 
                }
                if (col.dataIndex === "Currency") {
                  return row.Currency?.code || ""; 
                }
                if (col.dataIndex === "createdate") {
                  return moment(row.createdate).format("DD-MM-YYYY") || ""; 
                }
                return row[col.dataIndex] || "";
              })
            ),
      startY: 20,
    });
    doc.save("Products.pdf");
  }, [filteredData, columns]);

  const [selectedproduct, setSelectedproduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteUser = (user) => {
    setSelectedproduct(user);
    setShowDeleteModal(true);
  };

  const deleteData = () => {
    if (selectedproduct) {
      dispatch(deleteProduct(selectedproduct.id));
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="page-wrapper">
       <Helmet>
         <title>DCC CRMS - Products</title>
         <meta name="Products" content="This is Products page of DCC CRMS." />
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
                    Product
                    <span className="count-title">{products?.data?.length || 0}</span>
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
                    label="Search Product"
                  />

                  <div className="col-sm-8">
                    <ExportData
                      exportToPDF={exportToPDF}
                      exportToExcel={exportToExcel}
                      label="Add Product"
                      isCreate={isCreate}
                      id="offcanvas_add_edit_product"
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
      <AddProductModal product={selectedproduct} setProduct={setSelectedproduct} />

      {/* <EditUserModal user={selectedproduct} /> */}
      <DeleteAlert
        label="Product"
        showModal={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={deleteData}
      />
    </div>
  );
};

export default Product;
