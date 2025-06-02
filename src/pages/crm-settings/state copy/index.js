import React, { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import "bootstrap-daterangepicker/daterangepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import Table from "../../../components/common/dataTable/index";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchStates,
    clearMessages,
    deleteState,
} from "../../../redux/state"; // Redux actions and reducers for states
import { all_routes } from "../../../routes/all_routes";
import CollapseHeader from "../../../components/common/collapse-header";
import AddEditModal from "./modal/AddEditModal";
import FlashMessage from "../../../components/common/modals/FlashMessage";
import DeleteAlert from "./alert/DeleteAlert";

import moment from "moment";

import SortDropdown from "../../../components/datatable/SortDropDown";
import SearchBar from "../../../components/datatable/SearchBar";
import { useNavigate } from "react-router-dom";
import AddButton from "../../../components/datatable/AddButton";

const StatesList = () => {
    const [mode, setMode] = useState("add"); // 'add' or 'edit'
    const route = all_routes;
    const dispatch = useDispatch();
    const columns = [
        {
            title: "State Name",
            dataIndex: "name",
            render: (text, record) => (
                <Link to={`/states/${record.id}`}>{record.name}</Link>
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
        {
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
                        <button
                            className="dropdown-item edit-popup"
                            data-bs-toggle="modal"
                            data-bs-target="#add_edit_state_modal"
                            onClick={() => {
                                console.log("Editing record:", record);
                                setSelectedState(record);
                                setMode("edit");
                                setModalOpen(true); // Open modal
                            }}
                        >
                            <i className="ti ti-edit text-blue"></i> Edit
                        </button>
                        <button
                            className="dropdown-item"
                            onClick={() => handleDeleteState(record)}
                        >
                            <i className="ti ti-trash text-danger"></i> Delete
                        </button>
                    </div>
                </div>
            ),
        }

    ];

    const navigate = useNavigate();
    const { states, loading, error, success } = useSelector(
        (state) => state.states
    );

    React.useEffect(() => {

        dispatch(fetchStates());
    }, [dispatch]);

    const [searchText, setSearchText] = useState("");
    const [sortOrder, setSortOrder] = useState("ascending"); // Sorting

    const handleSearch = useCallback((e) => {
        setSearchText(e.target.value);
    }, []);

    const filteredData = useMemo(() => {
        let data = states;
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
    }, [searchText, states, columns, sortOrder]);

    const handleDeleteState = (state) => {
        setSelectedState(state);
        setShowDeleteModal(true);
    };

    const [selectedState, setSelectedState] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);

    const deleteData = () => {
        if (selectedState) {
            dispatch(deleteState(selectedState.id));
            setShowDeleteModal(false);
        }
    };

    return (
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
                        <div className="page-header">
                            <div className="row align-items-center">
                                <div className="col-8">
                                    <h4 className="page-title">
                                        States
                                        <span className="count-title">{states?.length || 0}</span>
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
                                    <div className="col-sm-8">
                                        <AddButton
                                            label="Add State"
                                            id="add_edit_state_modal"
                                            setMode={() => setMode("add")}
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
                                    </div>
                                </div>

                                <div className="table-responsive custom-table">
                                    <Table
                                        dataSource={filteredData}
                                        columns={columns}
                                        loading={loading}
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
