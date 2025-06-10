import "bootstrap-daterangepicker/daterangepicker.css";
import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../components/common/collapse-header"; // Updated path
import Table from "../../components/common/dataTable/index"; // Updated path
import FlashMessage from "../../components/common/modals/FlashMessage";
import { clearMessages, deleteLead, fetchLeads } from "../../redux/leads"; // Ensuring the redux slice is for leads
import { all_routes } from "../../routes/all_routes";
import AddLeadsModal from "./modal/AddLeadsModal";

import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import SearchBar from "../../components/datatable//SearchBar";
import DateRangePickerComponent from "../../components/datatable/DateRangePickerComponent"; // Updated path
import ExportData from "../../components/datatable/ExportData";
import SortDropdown from "../../components/datatable/SortDropDown";
import ViewIconsToggle from "../../components/datatable/ViewIconsToggle";
import DeleteAlert from "./alert/DeleteAlert";
import EditLeadsModal from "./modal/EditLeadsModal";
import FilterComponent from "./modal/FilterComponent";
import UnauthorizedImage from "../../components/common/UnAuthorized.js";
import { Helmet } from "react-helmet-async";

const LeadList = () => {
  const navigate = useNavigate();
  const [view, setView] = useState("list"); 
  const dispatch = useDispatch();
  
  const [showFlashModal, setShowFlashModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sortOrder, setSortOrder] = useState("ascending");

  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [paginationData , setPaginationData] = useState()
    const [searchText, setSearchText] = useState(""); // For search
    const [selectedDateRange, setSelectedDateRange] = useState({
      startDate: moment().subtract(180, "days"),
      endDate: moment(),
    });

  const permissions =JSON?.parse(localStorage.getItem("permissions"))
  const allPermissions = permissions?.filter((i)=>i?.module_name === "Leads")?.[0]?.permissions
 const isAdmin = localStorage.getItem("role")?.includes("admin")
  const isView = isAdmin || allPermissions?.view
  const isCreate = isAdmin || allPermissions?.create
  const isUpdate = isAdmin || allPermissions?.update
  const isDelete = isAdmin || allPermissions?.delete

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      sorter: (a, b) => a - b,
    },
    {
      title: "Lead Name",
      dataIndex: "leadName",
      render: (text, record, index) => (
        <Link to={`/leads/${record.id}`} key={index}>
          {`${record.first_name} ${record.last_name}`}
        </Link>
      ),
      sorter: (a, b) => {
        const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
        const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
        return nameA.localeCompare(nameB);
      },
    },
    {
      title: "Company Name",
      dataIndex: "lead_company",
      render: (text, record, index) => (
        <Link t key={index}>
          {`${text.name}`}
        </Link>
      ),
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a, b) => a.phone.length - b.phone.length,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.length - b.email.length,
    },
    {
      title: "Lead Status",
      dataIndex: "crms_m_lost_reasons",
      render: (crms_m_lost_reasons) => (
        <span
          className={`badge badge-pill badge-status`}
          style={{ backgroundColor: crms_m_lost_reasons?.colorCode }}
        >
          {crms_m_lost_reasons?.name || "N/A"}
        </span>
      ),
      sorter: (a, b) => {
        const nameA = a.crms_m_lost_reasons?.name || "";
        const nameB = b.crms_m_lost_reasons?.name || "";
        return nameA.localeCompare(nameB);
      },
    },

    {
      title: "Assignee",
      dataIndex: "crms_m_user",
      render: (crms_m_user) => <span>{crms_m_user.full_name}</span>,
      sorter: (a, b) => a.crms_m_user.full_name - b.crms_m_user.full_name,
    },
    {
      title: "Created Date",
      dataIndex: "createdate",
      render: (date) => <span>{moment(date).format("DD-MM-YYYY")}</span>,
      sorter: (a, b) => new Date(a.createdate) - new Date(b.createdate),
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
          <div className="dropdown-menu dropdown-menu-right">
            {isUpdate && <Link
              className="dropdown-item edit-popup"
              to="#"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvas_add_lead"
              onClick={() => setSelectedLead(record)}
            >
              <i className="ti ti-edit text-blue"></i> Edit
            </Link>}
           {isDelete && <Link
              className="dropdown-item"
              to="#"
              onClick={() => handleDeleteLead(record)}
            >
              <i className="ti ti-trash text-danger"></i> Delete
            </Link>}
          {isView &&  <Link className="dropdown-item" to={`/leads/${record?.id}`}>
              <i className="ti ti-eye text-blue-light"></i> Preview
            </Link>}
          </div>
        </div>
      ),
    }]:[])
  ];
  const { leads, loading, error, success } = useSelector(
    (state) => state.leads,
  );

  // Show FlashMessage when success or error changes
  React.useEffect(() => {
    if (error || success) {
      setShowFlashModal(true);
    }
  }, [error, success]);

  const handleCloseFlashMessage = () => {
    setShowFlashModal(false);
    dispatch(clearMessages());
  };

  const handleDeleteLead = (lead) => {
    setSelectedLead(lead);
    setShowDeleteModal(true);
  };

  const deleteData = () => {
    if (selectedLead) {
      dispatch(deleteLead(selectedLead.id));
      navigate(`/crms/leads`);
      setShowDeleteModal(false);
    }
  };

  React.useEffect(() => {
    dispatch(fetchLeads({search:searchText,status:selectedStatus  , ...selectedDateRange}));
  }, [dispatch,searchText ,selectedStatus, selectedDateRange]);

React.useEffect(()=>{
    setPaginationData({
      currentPage:leads?.currentPage,
      totalPage:leads?.totalPages,
      totalCount:leads?.totalCount,
      pageSize : leads?.size
    })
  },[leads])

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize
    }));
    dispatch(fetchLeads({search:searchText ,status:selectedStatus, ...selectedDateRange, page: currentPage, size: pageSize })); 
  };

  const handleSearch = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  const filteredData = useMemo(() => {
    let data = leads?.data || [];

    // if (selectedStatus) {
    //   data = data.filter((item) => item.status === selectedStatus);
    // }
    // if (selectedPriority) {
    //   data = data.filter((item) => item.priority === selectedPriority);
    // }
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
  }, [
    searchText,
    columns,
    selectedDateRange,
    selectedStatus,
    selectedPriority,
    leads,
  ]);

  const exportToExcel = useCallback(() => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "leads.xlsx");
  }, [filteredData]);

  const exportToPDF = useCallback(() => {
    const doc = new jsPDF();
    doc.text("Exported Data", 14, 10);
    doc.autoTable({
      head: [columns.map((col) => col.title !== "Actions" ?  col.title : "")],
      body: filteredData.map((row) =>
        columns.map((col) => {
          if (col.dataIndex === "leadName") {
            return `${row.first_name} ${row.last_name}` || ""; 
          }
          if (col.dataIndex === "lead_company") {
          return row.lead_company?.name || ""; 
          }
          if (col.dataIndex === "crms_m_lost_reasons") {
            return row.crms_m_lost_reasons?.name || ""; 
          }
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
    doc.save("leads.pdf");
  }, [filteredData, columns]);

  return (
    <div>
      <Helmet>
        <title>DCC CRMS - Leads</title>
        <meta name="Leads" content="This is Leads page of DCC CRMS." />
      </Helmet>
      <div className="page-wrapper">
        <div className="content">
          {error && showFlashModal && (
            <FlashMessage
              type="error"
              message={error}
              onClose={handleCloseFlashMessage}
            />
          )}
          {success && showFlashModal && (
            <FlashMessage
              type="success"
              message={success}
              onClose={handleCloseFlashMessage}
            />
          )}
          <div className="row">
            <div className="col-md-12">
              <div className="page-header">
                <div className="row align-items-center">
                  <div className="col-8">
                    <h4 className="page-title">
                      Leads
                      <span className="count-title">{leads?.data?.length || 0}</span>
                    </h4>
                  </div>
                  <div className="col-4 text-end">
                    <CollapseHeader />
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header">
                  <div className="row align-items-center">
                    <SearchBar
                      searchText={searchText}
                      handleSearch={handleSearch}
                      label="Search Leads"
                    />
                    <div className="col-sm-8">
                      <ExportData
                        exportToPDF={exportToPDF}
                        exportToExcel={exportToExcel}
                        label="Add Lead"
                        isCreate = {isCreate}
                        id="offcanvas_add_lead"
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
                          // setSelectedPriority(priority);
                        }}
                      />
                      <ViewIconsToggle view={view} setView={setView} />
                    </div>
                  </div>

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
                        navigate(`/crms/leads-kanban`);
                        return null;
                      })()
                    )}
                  </div>: <UnauthorizedImage />}
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <div className="datatable-length" />
                    </div>
                    <div className="col-md-6">
                      <div className="datatable-paginate" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddLeadsModal setSelectedLead={setSelectedLead} selectedLead={selectedLead} />
      <EditLeadsModal lead={selectedLead} />
      <DeleteAlert
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        onDelete={deleteData}
      />
    </div>
  );
};

export default LeadList;
