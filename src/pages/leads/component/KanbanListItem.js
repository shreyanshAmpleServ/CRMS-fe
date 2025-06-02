import React, { useState } from "react";
import { Link } from "react-router-dom";
import LeadKanbanCard from "./LeadsKanbanCard";
import AddEditModal from "../../crm-settings/lost-reasons/modal/AddEditModal";
import {
  deleteLostReason,
} from "../../../redux/lostReasons";
import { fetchLeadStatuses } from "../../../redux/leads";
// Redux actions and reducers for lostReasons
import { useDispatch, useSelector } from "react-redux";
import DeleteAlert from "../../crm-settings/lost-reasons/alert/DeleteAlert";
const KanbanListItem = ({ leadStatus, addContainerRef }) => {
  const [selectedLostReason, setSelectedLostReason] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dispatch = useDispatch();
  const handleDeleteLostReason = (lostReason) => {
    setSelectedLostReason(lostReason);
    setShowDeleteModal(true);
  };
  const deleteData = () => {
    if (selectedLostReason) {
      dispatch(deleteLostReason(selectedLostReason.id)).then(() => {
        // Once update is successful, fetch the lead statuses again
        dispatch(fetchLeadStatuses());
      })
        .catch((error) => {
          console.error("Failed to update lead:", error);
        });;
      setShowDeleteModal(false);
    }
  };
  return (
    <div className="kanban-list-items">
      <div className="card mb-0">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="fw-semibold d-flex align-items-center mb-1">
                <i
                  className="ti ti-circle-filled fs-8  me-2"
                  style={{ color: leadStatus?.colorCode }}
                />
                {leadStatus.name}
              </h4>
              <span className="fw-medium text-default">
                {leadStatus.total_lead} Leads - ${leadStatus.total_revenue}
              </span>
            </div>
            <div className="d-flex align-items-center">
              <Link
                to="#"
                className="text-purple"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvas_add_lead"
              >
                <i className="ti ti-plus" />
              </Link>
              <div className="dropdown table-action ms-2">
                <Link
                  to="#"
                  className="action-icon dropdown-toggle bg-white"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fa fa-ellipsis-v" />
                </Link>
                <div className="dropdown-menu dropdown-menu-right">
                  <Link
                    className="dropdown-item edit-popup"
                    to="#"
                    data-bs-toggle="modal"
                    data-bs-target="#add_edit_lost_reason_modal"
                    onClick={() => {
                      setSelectedLostReason(leadStatus);
                    }}

                  >
                    <i className="fa-solid fa-pencil text-blue" /> Edit
                  </Link>
                  <Link
                    className="dropdown-item"
                    onClick={() => handleDeleteLostReason(leadStatus)}
                  >
                    <i className="fa-regular fa-trash-can text-danger" /> Delete
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="kanban-drag-wrap pt-4"
        data-lead-status-id={leadStatus.id}
        ref={(ref) => addContainerRef(ref)}
      >
        {leadStatus?.crms_leads.map((lead) => (
          <LeadKanbanCard
            key={lead.id}
            lead={lead}
            leadStatus={leadStatus}
            leadContainerID={lead.id}
          />
        ))}
      </div>
      <AddEditModal mode="edit" initialData={selectedLostReason} sourcePage="leads-kanban" />
      <DeleteAlert
        sourcePage="leads-kanban"
        label="Lost Reason"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        selectedLostReason={selectedLostReason}
        onDelete={deleteData}
      />
    </div>
  );
};

export default KanbanListItem;
