import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";
import dragula from "dragula";
import CollapseHeader from "../../components/common/collapse-header";
import "dragula/dist/dragula.css";
import AddLeadsModal from "./modal/AddLeadsModal";
import { fetchLeadStatuses, updateLead } from "../../redux/leads";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../components/common/loader";
import KanbanListItem from "./component/KanbanListItem";
import AddEditModal from "../crm-settings/lost-reasons/modal/AddEditModal";

const LeadsKanban = () => {
    const dispatch = useDispatch();
    const { leadStatuses, loading, error, success } = useSelector(
        (state) => state.leads,
    );
    const [totalLeads, setTotalLeads] = useState(0);

    // Fetch lead status
    useEffect(() => {
        dispatch(fetchLeadStatuses());
    }, [dispatch]);

    useEffect(() => {
        const TotalLeads = leadStatuses.reduce((totalleads, leadStatus) => {
            return totalleads + leadStatus.total_lead; // Add number of deals in each stage
        }, 0);
        setTotalLeads(TotalLeads);
    })



    // Ref to manage drag-and-drop containers
    const containerRefs = useRef([]);
    const drakeInstance = useRef(null);

    const addContainerRef = (ref) => {
        if (ref && !containerRefs.current.includes(ref)) {
            containerRefs.current.push(ref);
        }
    };

    useEffect(() => {
        if (containerRefs.current.length > 0) {
            drakeInstance.current = dragula(containerRefs.current);

            drakeInstance.current.on("drop", (el, target, source) => {
                const leadId = el.getAttribute("data-id");
                const targetStatusId = target.getAttribute("data-lead-status-id");
                const sourceStatusId = source.getAttribute("data-lead-status-id");

                if (leadId && targetStatusId && sourceStatusId && targetStatusId !== sourceStatusId) {
                    // Dispatch the updateLead action
                    dispatch(
                        updateLead({
                            id: leadId,
                            leadData: { lead_status: targetStatusId, update_partial: true },
                        })
                    )
                        .then(() => {
                            // Once update is successful, fetch the lead statuses again
                            dispatch(fetchLeadStatuses());
                        })
                        .catch((error) => {
                            console.error("Failed to update lead:", error);
                        });


                }
            });
        }

        return () => {
            if (drakeInstance.current) {
                drakeInstance.current.destroy();
            }
        };
    }, [leadStatuses, dispatch]);

    const route = all_routes;

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="row">
                    <div className="col-md-12">
                        {/* Page Header */}
                        <div className="page-header">
                            <div className="row align-items-center">
                                <div className="col-8">
                                    <h4 className="page-title">
                                        Leads <span className="count-title">{totalLeads}</span>
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

                        {/* Filter */}
                        <div className="d-flex justify-content-between align-items-center flex-wrap row-gap-2 mb-4">

                            <div>
                                <ul className="d-flex align-items-center">
                                    <li>
                                        <div className="view-icons me-2">
                                            <Link to={route.leads}>
                                                <i className="ti ti-list-tree" />
                                            </Link>
                                            <Link to={route.leadskanban} className="active">
                                                <i className="ti ti-grid-dots" />
                                            </Link>
                                        </div>
                                    </li>
                                    <li>
                                        <Link
                                            to="#"
                                            className="btn btn-primary"
                                            data-bs-toggle="offcanvas"
                                            data-bs-target="#offcanvas_add_lead"
                                        >
                                            <i className="ti ti-square-rounded-plus me-2" />
                                            Add Leads
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        {/* /Filter */}

                        {/* Leads Kanban */}
                        {loading ? (
                            <Loader />
                        ) : (
                            <div className="d-flex overflow-x-auto align-items-start mb-4">

                                {leadStatuses?.map((lead_status) => (
                                    <KanbanListItem
                                        key={lead_status.id}
                                        leadStatus={lead_status}
                                        addContainerRef={addContainerRef}
                                    />
                                ))}
                            </div>
                        )}
                        {/* /Leads Kanban */}
                    </div>
                </div>
            </div>
            <AddLeadsModal />
            {/* <AddEditModal mode={mode} initialData={selectedLostReason} /> */}
        </div>
    );
};

export default LeadsKanban;
