import "bootstrap-daterangepicker/daterangepicker.css";
import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../components/common/collapse-header"; // Updated path
import Table from "../../components/common/dataTable/index"; // Updated path
import FlashMessage from "../../components/common/modals/FlashMessage";
import { clearMessages } from "../../redux/leads"; // Ensuring the redux slice is for leads

import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import * as XLSX from "xlsx";
import DateRangePickerComponent from "../../components/datatable/DateRangePickerComponent"; // Updated path
import ExportData from "../../components/datatable/ExportData";
import SearchBar from "../../components/datatable/SearchBar";
import SortDropdown from "../../components/datatable/SortDropDown";
import { deleteCalls, fetchCalls } from "../../redux/calls";
import DeleteAlert from "./alert/DeleteAlert";
import AddCallModal from "./modal/AddCallsModal";
import EditLeadsModal from "./modal/EditLeadsModal";
import FilterComponent from "./modal/FilterComponent";
import CallsGrid from "./CallsGrid";
import ViewIconsToggle from "../../components/datatable/ViewIconsToggle";
import UnauthorizedImage from "../../components/common/UnAuthorized.js";
import { Helmet } from "react-helmet-async";

const LeadList = () => {
  const [callsDetails, setCallDetails] = useState()
  const [view, setView] = useState("list"); // 'list' or 'grid'
    const [isChange,setIsChange] = useState(false)
  const [showFlashModal, setShowFlashModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("ascending");
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().subtract(60, "days"),
    endDate: moment(),
  });
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [paginationData , setPaginationData] = useState()
  const permissions =JSON?.parse(localStorage.getItem("permissions"))
  const allPermissions = permissions?.filter((i)=>i?.module_name === "Calls")?.[0]?.permissions
 const isAdmin = localStorage.getItem("role")?.includes("admin")
  const isView = isAdmin || allPermissions?.view
  const isCreate = isAdmin || allPermissions?.create
  const isUpdate = isAdmin || allPermissions?.update
  const isDelete = isAdmin || allPermissions?.delete


  const dispatch = useDispatch();

  const columns = [
    {
      title: "Call For",
      dataIndex: "call_for",
      render: (text, record, index) => (
        <div>
          {`${record.call_for} `}
        </div>
      ),
      sorter: (a, b) => {
        const nameA = `${a.call_for}`.toLowerCase();
        const nameB = `${b.call_for}`.toLowerCase();
        return nameA.localeCompare(nameB);
      },
    },
    {
      title: "Call For User",
      dataIndex: "crms_m_contact_call_for.firstName",
      render: (text, record, index) => (
        <div>
          {/* {`${record?.crms_m_contact_call_for?.firstName + " " + record?.crms_m_contact_call_for?.lastName} `} */}
          { record?.call_for === "Accounts"  ?
           `${record?.crms_m_contact_call_for?.firstName + " " + record?.crms_m_contact_call_for?.lastName}` 
           : record?.call_for === "Leads" ?
          `${record?.crms_leads?.first_name + " " + record?.crms_leads?.last_name} `
          : `${record?.crms_project?.name}` }
        </div>
      ),
      sorter: (a, b) => a?.firstName - b?.firstName,
    },
    {
      title: "Type",
      dataIndex: "ongoing_callStatus",
      render: (text, record, index) => (
        <span
          className={`badge badge-pill badge-status ${text == "Completed" ? "bg-success" : text === "Scheduled" ? "bg-warning"  :  "bg-primary" }   `}
           // style={{ backgroundColor: }}
        >
          {`${text} `}
        </span>
      ),
      sorter: (a, b) => a - b,
    },
    {
      title: "Related To",
      dataIndex: "related_to",
      render: (text, record, index) => (
        <div>
          {`${text == 1 ? "Accounts" : "Contacts"} `}
        </div>
      ),
      sorter: (a, b) => a.text == 1 ? "Accounts" : "Contacts" - b.text == 1 ? "Accounts" : "Contacts",
    },
    {
      title: "Related To User",
      dataIndex: "crms_m_contact_related_to",
      render: (text, record, index) => (
        <div>
          {`${record?.crms_m_contact_related_to?.firstName + " " + record?.crms_m_contact_related_to?.lastName} `}
        </div>
      ),
      sorter: (a, b) => a.email.length - b.email.length,
    },
    // {
    //   title: "Lead Status",
    //   dataIndex: "crms_m_lost_reasons",
    //   render: (crms_m_lost_reasons) => (
    //     <span
    //       className={`badge badge-pill badge-status`}
    //       style={{ backgroundColor: crms_m_lost_reasons?.colorCode }}
    //     >
    //       {crms_m_lost_reasons.name}
    //     </span>
    //   ),
    //   sorter: (a, b) =>
    //     a.crms_m_lost_reasons.localeCompare(b.crms_m_lost_reasons),
    // },
    // {
    //   title: "Status",
    //   dataIndex: "crms_m_call_statuses",
    //   render: (item) => (
    //     <span
    //       className={`badge badge-pill badge-status ${item?.name == "No answer" ? "bg-success" : item?.name === "Busy" ? "bg-danger" : item?.name === "Unavailable" ? "bg-info" : item?.name === "Wrong Number" ? "bg-warning" : item?.name === "Left Voice Message" ? "bg-dark" :  "bg-primary" }   `}
    //       // style={{ backgroundColor: }}
    //     >
    //       {item?.name || "N/A"}
    //     </span>
    //   ),
    //   sorter: (a, b) => {
    //     const nameA = a?.name || "";
    //     const nameB = b?.name || "";
    //     return nameA.localeCompare(nameB);
    //   },
    // },

    {
      title: "Purpose",
      dataIndex: "crms_m_callpurposes",
      render: (assigned_to_user) => <span>{assigned_to_user?.name}</span>,
      sorter: (a, b) => a.assigned_to_user?.name - b.assigned_to_user?.name,
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      render: (date) => <span>{moment(date).format("DD-MM-YYYY")}</span>,
      sorter: (a, b) => new Date(a.createdDate) - new Date(b.createdDate),
    },

    ...((isDelete || isUpdate ) ? [
      {
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
              data-bs-target="#offcanvas_add_calls"
              onClick={() => setCallDetails(record)}
            >
              <i className="ti ti-edit text-blue"></i> Edit
            </Link>}
          {isDelete &&  <Link
              className="dropdown-item"
              to="#"
              onClick={() => handleDeleteLead(record)}
            >
              <i className="ti ti-trash text-danger"></i> Delete
            </Link>}

          </div>
        </div>
      ),
    }] : [])
  ];
  const { calls, loading, error, success } = useSelector(
    (state) => state.calls,
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
      dispatch(deleteCalls(selectedLead.id));
      setShowDeleteModal(false);
    }
  };

  React.useEffect(() => {
    dispatch(fetchCalls({search:searchText,callType:selectedType,category:selectedCategory, ...(isChange &&  selectedDateRange )}));
  }, [dispatch, searchText , selectedType,selectedCategory,selectedDateRange]);

    React.useEffect(()=>{
        setPaginationData({
          currentPage:calls?.currentPage,
          totalPage:calls?.totalPages,
          totalCount:calls?.totalCount,
          pageSize : calls?.size
        })
      },[calls])
    
      const handlePageChange = ({ currentPage, pageSize }) => {
        setPaginationData((prev) => ({
          ...prev,
          currentPage,
          pageSize
        }));
        dispatch(fetchCalls({search:searchText ,callType:selectedType,category:selectedCategory, ...selectedDateRange, page: currentPage, size: pageSize })); 
      };

  const handleSearch = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  const filteredData = useMemo(() => {
    let data = calls?.data || [];
    // if (searchText) {
    //   data = data.filter((item) =>
    //     columns.some((col) => {
    //       const dataIndex = col.dataIndex;
    //       const value = item[dataIndex];

    //       if (typeof value === "string" || typeof value === "number") {
    //         return value.toString().toLowerCase().includes(searchText.toLowerCase());
    //       }

    //       if (typeof value === "object" && value !== null) {
    //         return Object.values(value).some((nestedValue) =>
    //           nestedValue.toString().toLowerCase().includes(searchText.toLowerCase())
    //         );
    //       }

    //       return null;
    //     }),
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
    if (selectedStatus) {
      data = data.filter((item) => item.call_status_id === selectedStatus);
    }
    if (selectedType) {
      data = data.filter((item) => item.ongoing_callStatus === selectedType);
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
  }, [
    searchText,
    columns,
    selectedDateRange,
    selectedStatus,
    selectedType,
    calls,
  ]);


  const exportToExcel = useCallback(() => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "calls.xlsx");
  }, [filteredData]);

  const exportToPDF = useCallback(() => {
    const doc = new jsPDF();
    doc.text("Exported Data", 14, 10);
    doc.autoTable({
      head: [columns.map((col) => col.title)],
      body: filteredData.map((row) =>
        columns.map((col) => row[col.dataIndex] || ""),
      ),
      startY: 20,
    });
    doc.save("calls.pdf");
  }, [filteredData, columns]);

  return (
    <div>
      <Helmet>
        <title>DCC CRMS - Calls</title>
        <meta name="Calls" content="This is Calls page of DCC CRMS." />
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
                      Calls
                      <span className="count-title">{calls?.data?.length || 0}</span>
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
                      label="Search calls"
                    />
                    <div className="col-sm-8">
                      <ExportData
                        exportToPDF={exportToPDF}
                        exportToExcel={exportToExcel}
                        label="Add Calls"
                        isCreate= {isCreate}
                        id="offcanvas_add_calls"
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
                      <FilterComponent
                        applyFilters={({category, type, status }) => {
                          setSelectedStatus(status);
                          setSelectedType(type);
                          setSelectedCategory(category)
                        }}
                      />
                      {/* <ViewIconsToggle view={view} setView={setView} /> */}
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
                      <CallsGrid data={calls?.data} />
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddCallModal callsDetails={callsDetails} setCallDetails={setCallDetails} />
      <EditLeadsModal lead={selectedLead} />
      <DeleteAlert
        label={"Call"}
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        onDelete={deleteData}
      />
    </div>
  );
};

export default LeadList;
