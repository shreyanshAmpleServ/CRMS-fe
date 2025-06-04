import "bootstrap-daterangepicker/daterangepicker.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import CollapseHeader from "../../components/common/collapse-header";
import { countryList } from "../../components/common/data/json/countriesData";
import Table from "../../components/common/dataTable/index";
import FlashMessage from "../../components/common/modals/FlashMessage";
import DateRangePickerComponent from "../../components/datatable/DateRangePickerComponent";
import ExportData from "../../components/datatable/ExportData";
import SearchBar from "../../components/datatable/SearchBar";
import SortDropdown from "../../components/datatable/SortDropDown";
import {
  clearMessages,
  deleteCompany,
  fetchCompanies,
} from "../../redux/companies";
import { all_routes } from "../../routes/all_routes";
import DeleteAlert from "./alert/DeleteAlert";
import CompanyGrid from "./CompanyGrid";
import AddCompanyModal from "./modal/AddCompanyModal";
import EditCompanyModal from "./modal/EditCompanyModal";
import FilterComponent from "./modal/FilterComponent";
// import ManageColumnsDropdown from "../deals/modal/ManageColumnsDropdown";
import { useNavigate } from "react-router-dom";
import ViewIconsToggle from "../../components/datatable/ViewIconsToggle";
import UnauthorizedImage from "../../components/common/UnAuthorized.js";
import { Helmet } from "react-helmet-async";

const CompanyList = () => {
  const [view, setView] = useState("list"); 
  const [isChange,setIsChange] = useState(false)
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("ascending"); // Sorting
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().subtract(180, "days"),
    endDate: moment(),
  });
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [paginationData , setPaginationData] = useState()
  const permissions =JSON?.parse(localStorage.getItem("permissions"))
  const allPermissions = permissions?.filter((i)=>i?.module_name === "Companies")?.[0]?.permissions
 const isAdmin = localStorage.getItem("role")?.includes("admin")
  const isView = isAdmin || allPermissions?.view
  const isCreate = isAdmin || allPermissions?.create
  const isUpdate = isAdmin || allPermissions?.update
  const isDelete = isAdmin || allPermissions?.delete

  const columns = [
    {
      title: "Company Name",
      dataIndex: "name",
      render: (text, record) => (
        <Link to={`/companies/${record.id}`}>{record.name}</Link>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },

    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a, b) => a.phone.localeCompare(b.phone),
    },
    {
      title: "Website",
      dataIndex: "website",
      render: (text) =>
        text ? (
          <a href={text} target="_blank" rel="noopener noreferrer">
            {text}
          </a>
        ) : (
          "N/A"
        ),
      sorter: (a, b) => (a.website || "").localeCompare(b.website || ""),
    },
    {
      title: "Industry Type",
      dataIndex: "industryType",
      sorter: (a, b) => a.industryType.localeCompare(b.industryType),
    },
    {
      title: "Annual Revenue",
      dataIndex: "annualRevenue",
      sorter: (a, b) => (a.annualRevenue || 0) - (b.annualRevenue || 0),
    },
    {
      title: "Employee Count",
      dataIndex: "employeeCount",
      sorter: (a, b) => (a.employeeCount || 0) - (b.employeeCount || 0),
    },
    {
      title: "Business Type",
      dataIndex: "businessType",
      sorter: (a, b) => a.businessType.localeCompare(b.businessType),
    },
   ...((isUpdate || isDelete) ?[{
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
              data-bs-target="#offcanvas_edit_company"
              onClick={() => setSelectedCompany(record)}
            >
              <i className="ti ti-edit text-blue"></i> Edit
            </Link>}
          {isDelete &&  <Link
              className="dropdown-item"
              to="#"
              onClick={() => handleDeleteCompany(record)}
            >
              <i className="ti ti-trash text-danger"></i> Delete
            </Link>}
           {isView && <Link className="dropdown-item" to={`/companies/${record?.id}`}>
              <i className="ti ti-eye text-blue-light"></i> Preview
            </Link>}
          </div>
        </div>
      ),
    }]:[])
  ];
  const navigate = useNavigate();
  const { companies, loading, error, success } = useSelector(
    (state) => state.companies,
  );

  React.useEffect(() => {
    dispatch(fetchCompanies({search:searchText , ...(isChange &&  selectedDateRange )}));
  }, [dispatch,searchText , selectedDateRange]);

React.useEffect(()=>{
    setPaginationData({
      currentPage:companies?.currentPage,
      totalPage:companies?.totalPages,
      totalCount:companies?.totalCount,
      pageSize : companies?.size
    })
  },[companies])

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize
    }));
    dispatch(fetchCompanies({search:searchText , ...selectedDateRange, page: currentPage, size: pageSize })); 
  };

  // Memoized handlers
  const handleSearch = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  const filteredData = useMemo(() => {
    let data = companies?.data || [];
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
    // if (filteredCountries.length > 0) {
    //   data = data.filter((item) => filteredCountries.includes(item.location));
    // }
    // if (selectedStatus !== null) {
    //   data = data.filter((item) => item.isActive === selectedStatus);
    // }
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
  }, [searchText, filteredCountries, selectedStatus, companies, columns]);

  const exportToExcel = useCallback(() => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Companies");
    XLSX.writeFile(workbook, "companies.xlsx");
  }, [filteredData]);

  const exportToPDF = useCallback(() => {
    const doc = new jsPDF();
    doc.text("Exported Companies", 14, 10);
    doc.autoTable({
      head: [columns.map((col) => col.title !== "Actions" ?  col.title : "")],
      body: filteredData.map((row) =>
        columns.map((col) => row[col.dataIndex] || ""),
      ),
      startY: 20,
    });
    doc.save("companies.pdf");
  }, [filteredData, columns]);

  const handleDeleteCompany = (company) => {
    setSelectedCompany(company);
    setShowDeleteModal(true);
  };
  const deleteData = () => {
    if (selectedCompany) {
      dispatch(deleteCompany(selectedCompany.id)); // Dispatch the delete action
      navigate(`/companies`); // Navigate to the specified route
      setShowDeleteModal(false); // Close the modal
    }
  };
  return (<>
    <Helmet>
    <title>DCC CRMS - Companies</title>
    <meta name="Companies" content="This is Companies page of DCC CRMS." />
  </Helmet>
    <div className="page-wrapper">
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
            {/* Page Header */}
            <div className="page-header">
              <div className="row align-items-center">
                <div className="col-8">
                  <h4 className="page-title">
                    Companies
                    <span className="count-title">
                      {companies?.data?.length || 0}
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
            {/* /Page Header */}
            <div className="card ">
              <div className="card-header">
                {/* Search */}
                <div className="row align-items-center">
                  <SearchBar
                    searchText={searchText}
                    handleSearch={handleSearch}
                    label="Search Companies"
                  />

                  <div className="col-sm-8">
                    {/* Export Start & Add Button */}
                    <ExportData
                      exportToPDF={exportToPDF}
                      exportToExcel={exportToExcel}
                      label="Add Companies"
                      isCreate={isCreate}
                      id="offcanvas_add_company"
                    />
                    {/* Export End & Add Button  */}
                  </div>
                </div>
                {/* /Search */}
              </div>

              <div className="card-body">
                {/* Filter */}
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
                    {/* <ManageColumnsDropdown /> */}
                    {/* <FilterComponent
                      countryList={countryList}
                      applyFilters={({ countries, status }) => {
                        setFilteredCountries(countries);
                        setSelectedStatus(status); // Set the selected status
                      }}
                    /> */}

                    <ViewIconsToggle view={view} setView={setView} />
                  </div>
                </div>

                {/* /Filter */}
                {/* Company List */}

                {isView ?<div className="table-responsive custom-table">
                  {view === "list" ? (
                    <Table
                      dataSource={filteredData}
                      columns={columns}
                      loading={loading}
                      paginationData={paginationData}
                      onPageChange={handlePageChange} 
                    />
                  ) : (
                    <CompanyGrid data={filteredData} />
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
                {/* /Company List */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddCompanyModal />
      <EditCompanyModal company={selectedCompany} />
      <DeleteAlert
        label="Company"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        selectedCompany={selectedCompany}
        onDelete={deleteData}
      />
    </div>
    </>
  );
};

export default CompanyList;
