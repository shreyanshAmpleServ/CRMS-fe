import "bootstrap-daterangepicker/daterangepicker.css";
import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../../components/common/collapse-header";
import Table from "../../../components/common/dataTable/index";
import FlashMessage from "../../../components/common/modals/FlashMessage";
import {
    clearMessages,
    deleteCountry,
    fetchCountries,
} from "../../../redux/country"; // Change to 'country' action file
import DeleteAlert from "./alert/DeleteAlert";
import AddEditModal from "./modal/AddEditModal";

import moment from "moment";

import AddButton from "../../../components/datatable/AddButton";
import SearchBar from "../../../components/datatable/SearchBar";
import SortDropdown from "../../../components/datatable/SortDropDown";
import { Helmet } from "react-helmet-async";

const CountriesList = () => {
    const [mode, setMode] = useState("add"); 

    const permissions =JSON?.parse(localStorage.getItem("permissions"))
    const allPermissions = permissions?.filter((i)=>i?.module_name === "Country")?.[0]?.permissions
    const isView = allPermissions?.view
    const isCreate = allPermissions?.create
    const isUpdate = allPermissions?.update
    const isDelete = allPermissions?.delete

    const dispatch = useDispatch();
    const columns = [
        {
            title: "Country Code",
            dataIndex: "code",
            // render: (text, record) => (
            //     <Link to={`/countries/${record.id}`}>{record.name}</Link>
            // ),
            sorter: (a, b) => a.code.localeCompare(b.name),
        },
        {
            title: "Countries",
            dataIndex: "name",
            render: (text, record) => (
                <Link to={`/countries/${record.id}`}>{record.name}</Link>
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
       ...((isUpdate || isDelete ) ?[ {
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
                      {isUpdate &&  <Link
                            className="dropdown-item edit-popup"
                            to="#"
                            data-bs-toggle="modal"
                            data-bs-target="#add_edit_country_modal"
                            onClick={() => {
                                setSelectedCountry(record);
                                setMode("edit");
                            }}
                        >
                            <i className="ti ti-edit text-blue"></i> Edit
                        </Link>}
                      {isDelete &&  <Link
                            className="dropdown-item"
                            to="#"
                            onClick={() => handleDeleteCountry(record)}
                        >
                            <i className="ti ti-trash text-danger"></i> Delete
                        </Link>}
                    </div>
                </div>
            ),
        }]:[])
    ];

    React.useEffect(() => {
        dispatch(fetchCountries()); // Changed to fetchCountries
    }, [dispatch]);
    const { countries, loading, error, success } = useSelector(
        (state) => state.countries // Changed to 'countries'
    );


    const [searchText, setSearchText] = useState("");
    const [sortOrder, setSortOrder] = useState("ascending"); // Sorting

    const handleSearch = useCallback((e) => {
        setSearchText(e.target.value);
    }, []);

    const filteredData = useMemo(() => {
        let data = countries;
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
    }, [searchText, countries, columns, sortOrder]);

    const handleDeleteCountry = (country) => {
        setSelectedCountry(country);
        setShowDeleteModal(true);
    };

    const [selectedCountry, setSelectedCountry] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const deleteData = () => {
        if (selectedCountry) {
            dispatch(deleteCountry(selectedCountry.id)); // Changed to deleteCountry
            setShowDeleteModal(false);
        }
    };

    return (
        <div className="page-wrapper">
            <Helmet>
              <title>DCC CRMS - Countries</title>
              <meta name="Countries" content="This is Countries page of DCC CRMS." />
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
                                        Country
                                        <span className="count-title">{countries?.length || 0}</span>
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
                                        label="Search Countries"
                                    />
                                    {isCreate && <div className="col-sm-8">
                                        <AddButton
                                            label="Add Country"
                                            id="add_edit_country_modal"
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
                                        isView={isView}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AddEditModal mode={mode} initialData={selectedCountry} />
            <DeleteAlert
                label="Country"
                showModal={showDeleteModal}
                setShowModal={setShowDeleteModal}
                selectedCountry={selectedCountry}
                onDelete={deleteData}
            />
        </div>
    );
};

export default CountriesList;
