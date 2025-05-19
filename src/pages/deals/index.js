import "bootstrap-daterangepicker/daterangepicker.css";
import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../components/common/collapse-header";
import Table from "../../components/common/dataTable/index";
import { clearMessages, deleteDeal, fetchDeals } from "../../redux/deals";
import AddDealModal from "./modal/AddDealModal";

import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import FlashMessage from "../../components/common/modals/FlashMessage";
import SearchBar from "../../components/datatable//SearchBar";
import DateRangePickerComponent from "../../components/datatable/DateRangePickerComponent";
import ExportData from "../../components/datatable/ExportData";
import SortDropdown from "../../components/datatable/SortDropDown";
import DeleteAlert from "./alert/DeleteAlert";
import EditDealModal from "./modal/EditDealModal";
import FilterComponent from "./modal/FilterComponent";
// import ManageColumnsDropdown from "./modal/ManageColumnsDropdown";
import ViewIconsToggle from "../../components/datatable/ViewIconsToggle";
import UnauthorizedImage from "../../components/common/UnAuthorized.js";
import { Helmet } from "react-helmet-async";

const DealList = () => {
  const navigate = useNavigate();
  const [view, setView] = useState("list"); 
  const dispatch = useDispatch();
  const [showFlashModal, setShowFlashModal] = useState(false);
  const [selecectDeal, setSelectedDeal] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchText, setSearchText] = useState(""); // For search// Memoized handlers
  const [sortOrder, setSortOrder] = useState("ascending");
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().subtract(180, "days"), // Default start date (Last 7 days)
    endDate: moment(),
  });
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [paginationData , setPaginationData] = useState()
  const permissions =JSON?.parse(localStorage.getItem("permissions"))
  const allPermissions = permissions?.filter((i)=>i?.module_name === "Deals")?.[0]?.permissions
 const isAdmin = localStorage.getItem("role")?.includes("admin")
  const isView = isAdmin || allPermissions?.view
  const isCreate = isAdmin || allPermissions?.create
  const isUpdate = isAdmin || allPermissions?.update
  const isDelete = isAdmin || allPermissions?.delete

  const columns = [
    {
      title: "Deal Name",
      dataIndex: "dealName",
      render: (text, record, index) => (
        <Link to={`/deals/${record.id}`} key={index}>
          {record.dealName}
        </Link>
      ),
      sorter: (a, b) => a.dealName.localeCompare(b.dealName),
    },
    {
      title: "Value (USD)",
      dataIndex: "dealValue",
      render: (value) => <span>{value.toFixed(2)}</span>,
      sorter: (a, b) => a.dealValue - b.dealValue,
    },
    {
      title: "Priority",
      dataIndex: "priority",
      render: (priority) => (
        <span
          className={`badge ${priority === "High"
            ? "bg-danger"
            : priority === "Medium"
              ? "bg-warning"
              : "bg-success"
            }`}
        >
          {priority}
        </span>
      ),
      sorter: (a, b) => a.priority.localeCompare(b.priority),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <span
          className={`badge ${status === "Open"
            ? "bg-primary"
            : status === "Won"
              ? "bg-success"
              : "bg-secondary"
            }`}
        >
          {status}
        </span>
      ),
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      render: (date) => <span>{moment(date).format("DD-MM-YYYY")}</span>,
      sorter: (a, b) => new Date(a.createdDate) - new Date(b.createdDate),
    },
    {
      title: "Expected Close Date",
      dataIndex: "expectedCloseDate",
      render: (date) => <span>{moment(date).format("DD-MM-YYYY")}</span>,
      sorter: (a, b) =>
        new Date(a.expectedCloseDate) - new Date(b.expectedCloseDate),
    },
    {
      title: "Assignee",
      dataIndex: "DealContacts",
      render: (value) => <span>{value?.[0]?.contact?.firstName + " "+value?.[0]?.contact?.lastName}</span>, // Replace with assignee name if available
      sorter: (a, b) => a.assigneeId - b.assigneeId,
    },
   ...((isUpdate || isDelete) ? [{
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
            {isUpdate &&<Link
              className="dropdown-item edit-popup"
              to="#"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvas_edit_deal"
              onClick={() => setSelectedDeal(record)} // Set selected deal
            >
              <i className="ti ti-edit text-blue"></i> Edit
            </Link>}
           {isDelete && <Link
              className="dropdown-item"
              to="#"
              onClick={() => handleDeleteDeal(record)} // Handle delete
            >
              <i className="ti ti-trash text-danger"></i> Delete
            </Link>}
          {isView &&  <Link className="dropdown-item" to={`/deals/${record?.id}`}>
              <i className="ti ti-eye text-blue-light"></i> Preview
            </Link>}
          </div>
        </div>
      ),
    }]: [])
  ];
  const { deals, loading, error, success } = useSelector(
    (state) => state.deals,
  );

  React.useEffect(() => {
      dispatch(fetchDeals({search:searchText ,status:selectedStatus,priority:selectedPriority, ...selectedDateRange}));
    }, [dispatch,searchText ,selectedStatus,selectedPriority, selectedDateRange]);
  
  React.useEffect(()=>{
      setPaginationData({
        currentPage:deals?.currentPage,
        totalPage:deals?.totalPages,
        totalCount:deals?.totalCount,
        pageSize : deals?.size
      })
    },[deals])
  
    const handlePageChange = ({ currentPage, pageSize }) => {
      setPaginationData((prev) => ({
        ...prev,
        currentPage,
        pageSize
      }));
      dispatch(fetchDeals({search:searchText ,status: selectedStatus,priority:selectedPriority, ...selectedDateRange, page: currentPage, size: pageSize })); 
    };

  // Show FlashMessage when success or error changes
  React.useEffect(() => {
    if (error || success) {
      setShowFlashModal(true);
    }
  }, [error, success]);


  const handleCloseFlashMessage = () => {
    setShowFlashModal(false);
    // Dispatch the action to clear erro  r and success messages from Redux
    dispatch(clearMessages());
  };
  const handleDeleteDeal = (deal) => {
    // Dispatch deleteContact action
    setSelectedDeal(deal);
    setShowDeleteModal(true);
  };
  const deleteData = () => {
    if (selecectDeal) {
      dispatch(deleteDeal(selecectDeal.id)); // Dispatch the delete action
      navigate(`/deals`); // Navigate to the specified route
      setShowDeleteModal(false); // Close the modal
    }
  };

  const handleSearch = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);
  // Memoized filtered data
  const filteredData = useMemo(() => {
    let data = deals?.data || [];
    // Sorting by createDate (ascending or descending)
    if (sortOrder === "ascending") {
      // Clone the array to avoid direct mutation
      data = [...data].sort((a, b) => {
        const dateA = moment(a.createdate);
        const dateB = moment(b.createdate);
        return dateA.isBefore(dateB) ? -1 : 1;
      });
    } else if (sortOrder === "descending") {
      // Clone the array to avoid direct mutation
      data = [...data].sort((a, b) => {
        const dateA = moment(a.createdate);
        const dateB = moment(b.createdate);
        return dateA.isBefore(dateB) ? 1 : -1;
      });
    }
    return data;
  }, [
    searchText,
    columns,
    selectedDateRange,
    selectedStatus,
    selectedPriority,
    deals,
  ]);

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
    doc.text("Exported Deals", 14, 10);

    // Generate table using autoTable
    doc.autoTable({ // Extract column headers
      head: [columns.map((col) => col.title !== "Actions" ?  col.title : "")], // Extract column headers
      body: filteredData.map((row) =>
        columns.map((col) => {
          if (col.dataIndex === "DealContacts") {
            return row?.DealContacts?.[0]?.contact?.firstName + " "+row?.DealContacts?.[0]?.contact?.lastName || ""; 
          }
          if (col.dataIndex === "createdDate") {
            return moment(row.createdDate).format("DD-MM-YYYY") || ""; 
          }
          if (col.dataIndex === "expectedCloseDate") {
            return moment(row.expectedCloseDate).format("DD-MM-YYYY") || ""; 
          }
          return row[col.dataIndex] || "";
        })
      ),
      startY: 20,
    });

    doc.save("Deals.pdf");
  }, [filteredData, columns]);

  return (
    <div>
      <Helmet>
        <title>DCC CRMS - Deals</title>
        <meta name="Deals" content="This is Deals page of DCC CRMS." />
      </Helmet>
      <div className="page-wrapper">
        <div className="content">
          {/* Show Flash Message for Error */}
          {error && showFlashModal && (
            <FlashMessage
              type="error"
              message={error}
              onClose={handleCloseFlashMessage}
            />
          )}

          {/* Show Flash Message for Success */}
          {success && showFlashModal && (
            <FlashMessage
              type="success"
              message={success}
              onClose={handleCloseFlashMessage}
            />
          )}

          <div className="row">
            <div className="col-md-12">
              {/* Page Header */}
              <div className="page-header">
                <div className="row align-items-center">
                  <div className="col-8">
                    <h4 className="page-title">
                      Deals
                      <span className="count-title">{deals?.data?.length || 0}</span>
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
                  <div className="row align-items-center">
                    {/* Search */}
                    <SearchBar
                      searchText={searchText}
                      handleSearch={handleSearch}
                      label="Search Deals"
                    />
                    {/* /Search */}
                    <dic className="col-sm-8">
                      {/* Export Start & Add Button */}
                      <ExportData
                        exportToPDF={exportToPDF}
                        exportToExcel={exportToExcel}
                        label="Add Deal"
                        isCreate={isCreate}
                        id="offcanvas_add_deal"
                      />
                      {/* Export End & Add Button  */}
                    </dic>
                  </div>
                </div>

                <div className="card-body">
                  {/* card header */}
                  <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-2 mb-4">
                    {/* Sort & Filterby Date Range */}
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
                    {/* End Sort & Filterby Date Range */}
                    {/* Manage Columns , Filter & Grid & List Button */}
                    <div className="d-flex align-items-center flex-wrap row-gap-2">
                      {/* <ManageColumnsDropdown /> */}
                      <FilterComponent
                        applyFilters={({ priority, status }) => {
                          setSelectedStatus(status); // Set the selected status
                          setSelectedPriority(priority); // Set the selected status
                        }}
                      />
                      <ViewIconsToggle view={view} setView={setView} />
                    </div>
                    {/* End Manage Columns , Filter & Grid & List Button */}
                  </div>
                  {/* End card header */}
                 {isView ? <div className="table-responsive custom-table">
                    {view === "list" ? (
                      <Table
                        dataSource={filteredData}
                        columns={columns}
                        loading={loading}
                        paginationData={paginationData}
                        onPageChange={handlePageChange}
                      />
                    ) : (
                      (() => {
                        navigate(`/deals-kanban`);
                        return null; // Ensure JSX doesn't break
                      })()
                    )}
                  </div> : <UnauthorizedImage />}
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <div className="datatable-length" />
                    </div>
                    <div className="col-md-6">
                      <div className="datatable-paginate" />
                    </div>
                  </div>
                  {/* /Deal List */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddDealModal />
      <EditDealModal deal={selecectDeal} />
      {/* Include the Delete deal Modal */}

      {/* Include the Delete deal Modal */}
      <DeleteAlert
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        onDelete={deleteData}
        label="deal"
      />
    </div>
  );
};

export default DealList;
