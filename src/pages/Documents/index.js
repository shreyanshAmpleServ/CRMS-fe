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
import UnauthorizedImage from "../../components/common/UnAuthorized.js";
import DateRangePickerComponent from "../../components/datatable/DateRangePickerComponent";
import ExportData from "../../components/datatable/ExportData";
import SearchBar from "../../components/datatable/SearchBar";
import SortDropdown from "../../components/datatable/SortDropDown";
import ViewIconsToggle from "../../components/datatable/ViewIconsToggle";
import { deleteAttachment, fetchAttachment } from "../../redux/attachment/index.js";
import {
  clearMessages
} from "../../redux/projects";
import DeleteAlert from "./alert/DeleteAlert";
import ProjectGrid from "./DocumentsGrid.js";
import AddAttachmentModal from "./modal/AddDocumentModal.js";
import FilterComponent from "./modal/FilterComponent";
import SendEmail from "../../utils/SendMail.js";
import { Helmet } from "react-helmet-async";

const DocumentLists = () => {
  const [view, setView] = useState("list"); 
  const dispatch = useDispatch();
  const [paginationData , setPaginationData] = useState()
  const [isRange,setIsRange] = useState(false)
  const [filteredType, setFilteredType] = useState();
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [searchText, setSearchText] = useState(""); 
    const [isChange,setIsChange] = useState(false)
  const [sortOrder, setSortOrder] = useState("ascending"); // Sorting
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().subtract(180, "days"),
    endDate: moment(),
  });

  const permissions =JSON?.parse(localStorage.getItem("permissions"))
  const allPermissions = permissions?.filter((i)=>i?.module_name === "Documents")?.[0]?.permissions
 const isAdmin = localStorage.getItem("role")?.includes("admin")
  const isView = isAdmin || allPermissions?.view
  const isCreate = isAdmin || allPermissions?.create
  const isUpdate = isAdmin || allPermissions?.update
  const isDelete = isAdmin || allPermissions?.delete

  const handleDownload = (url, filename) => {
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/octet-stream", // Treat as a binary file
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute("download", filename || "file.jpg"); // Force download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => console.error("Download failed:", error));
  };

  const columns = [
    {
      title: "File Name",
      dataIndex: "filename",
      // render: (text, record) => (
      //   // <Link to={`/documents/${record.id}`}>{record.name}</Link>
      // ),
      sorter: (a, b) => (a.filename || "").localeCompare(b.filename || ""),
    },
    {
      title: "File Type",
      dataIndex: "file_type",
      sorter: (a, b) => (a.amount || 0) - (b.amount || 0),
    },
    {
        title: "File",
        dataIndex: "file",
        render: (text,record) => {
          const extension = text?.split('.')?.pop()?.split('?')?.[0]?.split('#')?.[0]?.toLowerCase();
          const imageExtensions = [".jpg", ".jpeg", ".png" , ".avif"]; // Fixed ".jpeg" spelling
      
          return (<>
          {(["jpeg","jpg","png"]?.includes(extension)) ? 
          <div  className="dropdown-item" onClick={()=>handleDownload(text,`${record?.filename}`)}    style={{ width: "4rem", padding:"2px"}}  to={text}>
            {imageExtensions.includes(`.${extension}`) ? (
                <img
                  src={text}
                  alt="Preview"
                  style={{ width: "3rem", height: "3rem", margin: "0px", borderRadius: "5px" }}
                />
              ) : (
                <div className="text-light bg-danger h1 d-flex justify-content-center align-itms-center  pt-2" style={{ width: "3rem", height: "3rem", margin: "0px", borderRadius: "5px" }}>
                  <i className="  ti ti-pdf" />
                </div>
              )} </div>
               : <Link target="_blank"  className="dropdown-item"    style={{ width: "4rem", padding:"2px"}}  to={text}>
              {imageExtensions.includes(`.${extension}`) ? (
                <img
                  src={text}
                  alt="Preview"
                  style={{ width: "3rem", height: "3rem", margin: "0px", borderRadius: "5px" }}
                />
              ) : (
                <div className="text-light bg-danger h1 d-flex justify-content-center align-itms-center  pt-2" style={{ width: "3rem", height: "3rem", margin: "0px", borderRadius: "5px" }}>
                  <i className="  ti ti-pdf" />
                </div>
              )}
            </Link> 
           }
              </>
          );
        },
        sorter: (a, b) => (a.amount || 0) - (b.amount || 0),
     
      },
    {
      title: "Related type",
      dataIndex: "related_entity_type",
      // render: (text) => (
      //   <span>{moment(text).format("DD MMM YYYY, hh:mm a")}</span> // Format the date as needed
      // ),
      sorter: (a, b) => moment(a.startDate).diff(moment(b.startDate)),
    },
    {
      title: "Related To",
      dataIndex: "related_entity_name",
      // render: (text) => (
      //   <span>{moment(text).format("DD MMM YYYY, hh:mm a")}</span> // Format the date as needed
      // ),
      sorter: (a, b) => moment(a.startDate).diff(moment(b.startDate)),
    },
    {
      title: "Created By",
      dataIndex: "created_user",
      render: (text) => (
        <span>{text?.full_name}</span> // Format the date as needed
      ),
      sorter: (a, b) => moment(a.full_name).diff(moment(b.full_name)),
    },
    {
      title: "Created Date",
      render: (text) => (
        <span>{moment(text).format("DD-MM-YYYY")}</span> // Format the date as needed
      ),
      dataIndex: "createdDate",
      sorter: (a, b) => moment(a.dueDate).diff(moment(b.dueDate)),
    },
    // {
    //   title: "Status",
    //   dataIndex: "is_active",
    //   render: (text) => (
    //     <div>
    //       {text === "Y" ? (
    //         <span className="badge badge-pill badge-status bg-success">
    //           Active
    //         </span>
    //       ) : (
    //         <span className="badge badge-pill badge-status bg-danger">
    //           Inactive
    //         </span>
    //       )}
    //     </div>
    //   ),
    //   sorter: (a, b) => a.is_active.localeCompare(b.is_active),
    // },
  ...((isDelete || isUpdate) ? [ {
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
              data-bs-target="#offcanvas_add_documents"
              onClick={() => setSelectedProject(record)}
            >
              <i className="ti ti-edit text-blue"></i> Edit
            </Link>}
           {isDelete && <Link
              className="dropdown-item"
              to="#"
              onClick={() => handleDeleteProject(record)}
            >
              <i className="ti ti-trash text-danger"></i> Delete
            </Link>} <Link
              className="dropdown-item"
              to="#"
              onClick={() => SendEmail(record)}
            >
              <i className="ti ti-trash text-danger"></i> Mail
            </Link>

          {["jpeg","jpg","png"]?.includes(record?.file?.split('.').pop().split('?')[0].split('#')[0].toLowerCase()) ? 
          <div className="dropdown-item" onClick={()=>handleDownload(record.file,`${record?.filename}`)}  >
          <i className="ti ti-download text-info me-1" />
            Download
      </div> 
      : <Link target="_blank" className="dropdown-item"    to={record?.file} >
                <i className="ti ti-download text-info me-1" />
                  Download
            </Link>
            }
      {/* <Link className="dropdown-item" to={`/documents/${record?.id}`}>
              <i className="ti ti-eye text-blue-light"></i> Download
            </Link> */}
          </div>
        </div>
      ),
    }] : [])
  ];
  const { attachments, loading, error, success } = useSelector(
    (state) => state.attachments,
  );

  React.useEffect(() => {
    dispatch(fetchAttachment({filteredType ,search:searchText, ...(isChange &&  selectedDateRange )}));
  }, [dispatch , filteredType,searchText,selectedDateRange]);

  React.useEffect(()=>{
    setPaginationData({
      currentPage:attachments?.currentPage,
      totalPage:attachments?.totalPages,
      totalCount:attachments?.totalCount,
      pageSize : attachments?.size
    })
  },[attachments])

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize
    }));
    dispatch(fetchAttachment({filteredType, search:searchText , ...selectedDateRange,page: currentPage, size: pageSize })); 
  };



  // Memoized handlers
  const handleSearch = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  const filteredData = useMemo(() => {
    let data = attachments?.data || [] ;
  
    if(filteredType) {
      data = data?.filter((item)=>item?.related_entity_type === filteredType)
    }
    if (selectedStatus !== null) {
      data = data.filter((item) => item.is_active === selectedStatus);
    }
    // Sorting by createDate (ascending or descending)
    if (sortOrder === "ascending") {
      data = [...data].sort((a, b) => {
        const dateA = moment(a.createdate);
        const dateB = moment(b.createdate);
        return dateA.isBefore(dateB) ? -1 : 1;
      });
    } else if (sortOrder === "descending") {
      data = [...data].sort((a, b) => {
        const dateA = moment(a.createdate);
        const dateB = moment(b.createdate);
        return dateA.isBefore(dateB) ? 1 : -1;
      });
    }
    return data;
  }, [searchText, filteredType, selectedStatus, attachments, columns]);

  const exportToExcel = useCallback(() => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "attachments");
    XLSX.writeFile(workbook, "Documents.xlsx");
  }, [filteredData]);

  const exportToPDF = useCallback(() => {
    const doc = new jsPDF();
    doc.text("Exported Documents", 14, 10);
    doc.autoTable({
      head: [columns.map((col) => col.title !== "Actions" ?  col.title : "")],
      body: filteredData.map((row) =>
        columns.map((col) => row[col.dataIndex] || ""),
      ),
      startY: 20,
    });
    doc.save("Documents.pdf");
  }, [filteredData, columns]);

  const handleDeleteProject = (project) => {
    setSelectedProject(project);
    setShowDeleteModal(true);
  };

  const [selectedProject, setSelectedProject] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const deleteData = () => {
    if (selectedProject) {
      dispatch(deleteAttachment(selectedProject.id)); // Dispatch the delete action
      // navigate(`/documents`); // Navigate to the specified route
      setShowDeleteModal(false); // Close the modal
    }
  };
  
  return (<>
        <Helmet>
        <title>DCC CRMS - Documents</title>
        <meta name="Documents" content="This is Documents page of DCC CRMS." />
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
                    Documents
                    <span className="count-title">{attachments?.data?.length || 0}</span>
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
                    label="Search Documents"
                  />

                  <div className="col-sm-8">
                    {/* Export Start & Add Button */}
                    <ExportData
                      exportToPDF={exportToPDF}
                      exportToExcel={exportToExcel}
                      label="Add Document"
                      isCreate={isCreate}
                      id="offcanvas_add_documents"
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
                    <FilterComponent
                      countryList={countryList}
                      applyFilters={({ type, status }) => {
                        setFilteredType(type);
                        setSelectedStatus(status); // Set the selected status
                      }}
                    />

                    <ViewIconsToggle view={view} setView={setView} />
                  </div>
                </div>

                {/* /Filter */}
                {/* Project List */}

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
                    <ProjectGrid data={filteredData}  setData={setSelectedProject} />
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
                {/* /Project List */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddAttachmentModal data={selectedProject} setData={setSelectedProject} />
      {/* <EditProjectModal project={selectedProject} /> */}
      <DeleteAlert
        label="Project"
        showModal={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={deleteData}
      />
    </div>
    </>
  );
};

export default DocumentLists;
