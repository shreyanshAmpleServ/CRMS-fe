// DealKanbanCard.js
import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { all_routes } from "../../../routes/all_routes";
const LeadKanbanCard = ({ lead, leadStatus, leadContainerID }) => {
    const route = all_routes;
  return (
    <div className="card kanban-card border" data-id={leadContainerID}>
      <div className="card-body">
        <div className="d-block">
          <div
            className="mb-3"
            style={{ border: `2px solid ${leadStatus.colorCode}` }}
          />
          <div className="d-flex align-items-center mb-3">
            <Link
              to={`${route}/${lead.id}`}
              className="avatar avatar-lg bg-gray flex-shrink-0 me-2"
            >
              <span className="avatar-title text-dark"> {`${lead?.first_name?.[0] ?? ''}${lead?.last_name?.[0] ?? ''}`.toUpperCase()}</span>
            </Link>
            <h6 className="fw-medium">
              <Link to={`${route}/${lead.id}`}>{`${lead?.first_name} ${lead?.last_name}`}</Link>
            </h6>
          </div>
        </div>
        <div className="mb-3 d-flex flex-column">
          <p className="text-default d-inline-flex align-items-center mb-2">
            <i className="ti ti-report-money text-dark me-1" />${lead.annual_revenue}
          </p>
          <p class="text-default d-inline-flex align-items-center mb-2"><i class="ti ti-mail text-dark me-1"></i>{lead?.email}</p>
          <p class="text-default d-inline-flex align-items-center mb-2"><i class="ti ti-phone text-dark me-1"></i>{lead?.phone}</p>
          <p class="text-default d-inline-flex align-items-center"><i class="ti ti-map-pin-pin text-dark me-1"></i>{lead?.street},{lead?.city} {lead?.country}</p>
          {/* Add more deal-related information here */}
        </div>

        <div className="d-flex align-items-center justify-content-between border-top pt-3 mt-3">
          <span>
            <i className="ti ti-calendar-due" /> {moment(lead?.createdate, "YYYY-MM-DD").format("DD MMM YYYY")}
          </span>
          <div className="icons-social d-flex align-items-center">
            <Link
              to="#"
              className="d-flex align-items-center justify-content-center me-1"
            >
              <i className="ti ti-phone-check" />
            </Link>
            <Link
              to="#"
              className="d-flex align-items-center justify-content-center me-1"
            >
              <i className="ti ti-message-circle-2" />
            </Link>
            <Link
              to="#"
              className="d-flex align-items-center justify-content-center"
            >
              <i className="ti ti-color-swatch" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadKanbanCard;
