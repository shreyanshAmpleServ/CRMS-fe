import "bootstrap-daterangepicker/daterangepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import React, { useCallback, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import CollapseHeader from "../../../components/common/collapse-header";
import Table from "../../../components/common/dataTableNew/index";
import FlashMessage from "../../../components/common/modals/FlashMessage";
import {
    clearMessages
} from "../../../redux/state"; // Redux actions and reducers for mappedStates
import DeleteAlert from "./alert/DeleteAlert";
import AddEditModal from "./modal/AddEditModal";

import moment from "moment";

import { Select } from "antd";
import AddButton from "../../../components/datatable/AddButton";
import SearchBar from "../../../components/datatable/SearchBar";
import SortDropdown from "../../../components/datatable/SortDropDown";
import { fetchCountries } from "../../../redux/country";
import { deleteMappedState, fetchMappedStates } from "../../../redux/mappedState";
import { Helmet } from "react-helmet-async";

const StatesList = () => {
    const [mode, setMode] = useState("add"); 
    const [countryId,setCountryId] = useState()
    const [paginationData , setPaginationData] = useState()
    const [searchText, setSearchText] = useState("");
    const [sortOrder, setSortOrder] = useState("ascending"); // Sorting

    const permissions =JSON?.parse(localStorage.getItem("permissions"))
    const allPermissions = permissions?.filter((i)=>i?.module_name === "State")?.[0]?.permissions
    const isView = allPermissions?.view
    const isCreate = allPermissions?.create
    const isUpdate = allPermissions?.update
    const isDelete = allPermissions?.delete

    const dispatch = useDispatch();
    
    const columns = [
        {
            title: "State Name",
            dataIndex: "name",
            render: (text, record) => (
                <div>{text}</div>

                // <Link to={`/mappedStates/${record.id}`}>{record.name}</Link>
            ),
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: "Country",
            dataIndex: "country_details",
            render: (text, record) => (
                <div>{text?.code+ text?.name}</div>
                // <Link to={`/mappedStates/${record.id}`}>{record.name}</Link>
            ),
            sorter: (a, b) => a.name.localeCompare(b.name),
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
                    <button
                        className="action-icon btn btn-link"
                        data-bs-toggle="dropdown"
                        aria-expanded="true"
                    >
                        <i className="fa fa-ellipsis-v"></i>
                    </button>
                    <div className="dropdown-menu dropdown-menu-end">
                      {isUpdate &&  <button
                            className="dropdown-item edit-popup"
                            data-bs-toggle="modal"
                            data-bs-target="#add_edit_state_modal"
                            onClick={() => {
                                console.log("Editing record:", record);
                                setSelectedState(record);
                                setMode("edit");
                            }}
                        >
                            <i className="ti ti-edit text-blue"></i> Edit
                        </button>}
                       {isDelete && <button
                            className="dropdown-item"
                            onClick={() => handleDeleteState(record)}
                        >
                            <i className="ti ti-trash text-danger"></i> Delete
                        </button>}
                    </div>
                </div>
            ),
        }]:[])
    ];

    const { mappedStates, loading, error, success } = useSelector(
        (state) => state.mappedStates
    );

    React.useEffect(() => {
        dispatch(fetchCountries()); // Changed to fetchCountries
    }, [dispatch] );

    React.useEffect(() => {
        dispatch(fetchMappedStates({search:searchText,country_code: countryId}));
    }, [dispatch,countryId , searchText] );
      React.useEffect(()=>{
          setPaginationData({
            currentPage:mappedStates?.currentPage,
            totalPage:mappedStates?.totalPages,
            totalCount:mappedStates?.totalCount,
            pageSize : mappedStates?.size
          })
        },[mappedStates])
      
        const handlePageChange = ({ currentPage, pageSize }) => {
          setPaginationData((prev) => ({
            ...prev,
            currentPage,
            pageSize
          }));
          dispatch(fetchMappedStates({search:searchText , country_code: countryId, page: currentPage, size: pageSize })); 
        };

        const { countries} = useSelector(
            (state) => state.countries // Changed to 'countries'
        );
        const countryList = [{name:"All",value:""},...countries]

    const handleSearch = useCallback((e) => {
        setSearchText(e.target.value);
    }, []);

    const filteredData = useMemo(() => {
        let data = mappedStates?.data || [];
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
    }, [searchText, mappedStates, columns, sortOrder]);

    const handleDeleteState = (state) => {
        setSelectedState(state);
        setShowDeleteModal(true);
    };

    const [selectedState, setSelectedState] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const deleteData = () => {
        if (selectedState) {
            dispatch(deleteMappedState(selectedState.id));
            setShowDeleteModal(false);
        }
    };

    return (
        <div className="page-wrapper">
            <Helmet>
              <title>DCC CRMS - States</title>
              <meta name="States" content="This is States page of DCC CRMS." />
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
                                        States
                                        <span className="count-title">{mappedStates?.totalCount || 0}</span>
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
                                        label="Search States"
                                    />
                                   {isCreate && <div className="col-sm-8">
                                        <AddButton
                                            label="Add State"
                                            id="add_edit_state_modal"
                                            setMode={() => setMode("add")}
                                        />
                                    </div>}
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-2 mb-4">
                                    <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-2">
                                        <SortDropdown
                                            sortOrder={sortOrder}
                                            setSortOrder={setSortOrder}
                                        />
                                        </div>
                                    <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-2">      
                          <Select
                             showSearch 
                             optionFilterProp="label" 
                             allowClear
                            className="select shadow-md "
                            style={{minWidth:"8rem",height:"2.5rem"}}
                            placeholder="Select Country"
                            options={countryList?.map((i) => ({
                              label: i?.name,
                              value: i?.id,
                            }))}
                            classNamePrefix="react-select"
                            // value={
                            //   selectedDeal
                            //     ? {
                            //         label: selectedDeal.label,
                            //         value: selectedDeal.value,
                            //       }
                            //     : null
                            // } 
                            
                            onChange={(value)=>{console.log("onChange of country : ", value);setCountryId(value)} } // Store only value
                          />
                        {/* );
                      }}
                    /> */}
                                    </div>
                                    
                                </div>

                                <div className="table-responsive custom-table">
                                    <Table
                                        dataSource={filteredData}
                                        columns={columns}
                                        loading={loading}
                                        isView={isView}
                                        paginationData={paginationData}
                                        onPageChange={handlePageChange} 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AddEditModal mode={mode} initialData={selectedState} />
            <DeleteAlert
                label="State"
                showModal={showDeleteModal}
                setShowModal={setShowDeleteModal}
                selectedState={selectedState}
                onDelete={deleteData}
            />
        </div>
    );
};

export default StatesList;
