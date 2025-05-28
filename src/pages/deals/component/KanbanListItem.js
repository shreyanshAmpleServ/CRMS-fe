import React from "react";
import { Link } from "react-router-dom";
import DealKanbanCard from "./DealKanbanCard";

const KanbanListItem = ({ stage, addContainerRef }) => {
  return (
    <div className="kanban-list-items">
      <div className="card mb-0">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="fw-semibold d-flex align-items-center mb-1">
                <i
                  className="ti ti-circle-filled fs-8  me-2"
                  style={{ color: stage?.colorCode }}
                />
                {stage.name}
              </h4>
              <span className="fw-medium text-default">
                {stage.totalDeals} Deals - ${stage.totalRevenue}
              </span>
            </div>
            <div className="d-flex align-items-center">
              <Link to="#" className="text-purple">
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
                    className="dropdown-item"
                    to="#"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvas_edit"
                  >
                    <i className="fa-solid fa-pencil text-blue" /> Edit
                  </Link>
                  <Link
                    className="dropdown-item"
                    to="#"
                    data-bs-toggle="modal"
                    data-bs-target="#delete_deal"
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
        data-stage-id={stage.id}
        ref={(ref) => addContainerRef(ref)}
      >
        {stage.deals.map((deal) => (
          <DealKanbanCard
            key={deal.id}
            deal={deal}
            stage={stage}
            dealContainerID={deal.id}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanListItem;
