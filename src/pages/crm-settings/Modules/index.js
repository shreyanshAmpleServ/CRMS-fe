import "bootstrap-daterangepicker/daterangepicker.css";
import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../../components/common/collapse-header";
import Table from "../../../components/common/dataTableNew/index";
import FlashMessage from "../../../components/common/modals/FlashMessage";
import DeleteAlert from "./alert/DeleteAlert";
import AddEditModal from "./modal/AddEditModal";

import moment from "moment";

import AddButton from "../../../components/datatable/AddButton";
import SearchBar from "../../../components/datatable/SearchBar";
import SortDropdown from "../../../components/datatable/SortDropDown";
import { deleteModules, fetchModules,clearMessages } from "../../../redux/Modules";
import { Helmet } from "react-helmet-async";

const Modules = () => {
    const [mode, setMode] = useState("add");
    const [searchText, setSearchText] = useState("");
    const [sortOrder, setSortOrder] = useState("ascending"); // Sorting
  const [paginationData , setPaginationData] = useState()
    const [selectedDateRange, setSelectedDateRange] = useState({
      startDate: moment().subtract(180, "days"),
      endDate: moment(),
    });
    const permissions =JSON?.parse(localStorage.getItem("permissions"))
    const allPermissions = permissions?.filter((i)=>i?.module_name === "Modules")?.[0]?.permissions
    const isAdmin = localStorage.getItem("role")=== "admin"
  const isView =  isAdmin  ? true :  allPermissions?.view
  const isCreate = isAdmin ? true : allPermissions?.create
  const isUpdate = isAdmin ? true : allPermissions?.update
  const isDelete = isAdmin ? true : allPermissions?.delete

    const dispatch = useDispatch();
    const columns = [
        {
            title: "Module",
            dataIndex: "module_name",
            // render: (text, record) => (
            //     <Link to={`/modules/${record.id}`}>{record.name}</Link>
            // ),
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
       
        {
            title: "Description",
            dataIndex: "description",
            render: (text) => <span className="text-wrap">{text}</span>,
            sorter: (a, b) => a.is_default.localeCompare(b.is_default),
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
                            data-bs-target="#add_edit_module_modal"
                            onClick={() => {
                                setSelectedModule(record);
                                setMode("edit");
                            }}
                        >
                            <i className="ti ti-edit text-blue"></i> Edit
                        </Link>}
                      {isDelete &&  <Link
                            className="dropdown-item"
                            to="#"
                            onClick={() => handleDeleteModule(record)}
                        >
                            <i className="ti ti-trash text-danger"></i> Delete
                        </Link>}
                    </div>
                </div>
            ),
        }]:[])
    ];

    const { modules, loading, error, success } = useSelector(
        (state) => state.modules
    );

        React.useEffect(() => {
          dispatch(fetchModules({search:searchText}));
        }, [dispatch,searchText]);
      
      React.useEffect(()=>{
          setPaginationData({
            currentPage:modules?.currentPage,
            totalPage:modules?.totalPages,
            totalCount:modules?.totalCount,
            pageSize : modules?.size
          })
        },[modules])
      
        const handlePageChange = ({ currentPage, pageSize }) => {
          setPaginationData((prev) => ({
            ...prev,
            currentPage,
            pageSize
          }));
          dispatch(fetchModules({search:searchText , page: currentPage, size: pageSize })); 
        };

    const handleSearch = useCallback((e) => {
        setSearchText(e.target.value);
    }, []);

    const filteredData = useMemo(() => {
        let data = modules?.data || [];
        // if (searchText) {
        //     data = data.filter((item) =>
        //         columns.some((col) =>
        //             item[col.dataIndex]
        //                 ?.toString()
        //                 .toLowerCase()
        //                 .includes(searchText.toLowerCase())
        //         )
        //     );
        // }
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
    }, [searchText, modules, columns, sortOrder]);

    const handleDeleteModule = (Module) => {
        setSelectedModule(Module);
        setShowDeleteModal(true);
    };

    const [selectedModule, setSelectedModule] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const deleteData = () => {
        if (selectedModule) {
            dispatch(deleteModules(selectedModule.id));
            setShowDeleteModal(false);
        }
    };

    return (
        <div className="page-wrapper">
            <Helmet>
              <title>DCC CRMS - Modules</title>
              <meta name="Modules" content="This is Modules page of DCC CRMS." />
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
                                        Modules
                                        <span className="count-title">{modules?.totalCount || 0}</span>
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
                                        label="Search modules"
                                    />
                                  {isCreate &&  
                                  <div className="col-sm-8">
                                        <AddButton
                                            label="Add Module"
                                            id="add_edit_module_modal"
                                            setMode={() => setMode("add")}
                                        />
                                    </div>
                                    }
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
                                        // isView={isView}
                                        paginationData={paginationData}
                                        onPageChange={handlePageChange} 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AddEditModal mode={mode} initialData={selectedModule} />
            <DeleteAlert
                label="Module"
                showModal={showDeleteModal}
                setShowModal={setShowDeleteModal}
                selectedModule={selectedModule}
                onDelete={deleteData}
            />
        </div>
    );
};

export default Modules;
