// DealKanbanCard.js
import React from "react";
import { Link } from "react-router-dom";
import moment from "moment"
import { all_routes } from "../../../routes/all_routes";

const DealKanbanCard = ({ deal, stage, dealContainerID }) => {
  const route = all_routes;
  return (
    <div className="card kanban-card border" data-id={dealContainerID}>
      <div className="card-body">
        <div className="d-block">
          <div
            className="mb-3"
            style={{ border: `2px solid ${stage.colorCode}` }}
          />
          <div className="d-flex align-items-center mb-3">
            <Link
              to={`${route}/${deal.id}`}
              className="avatar avatar-lg bg-gray flex-shrink-0 me-2"
            >
              <span className="avatar-title text-dark">Deal</span>
            </Link>
            <h6 className="fw-medium">
              <Link to={`${route}/${deal.id}`}>{deal.name}</Link>
            </h6>
          </div>
        </div>
        <div className="mb-3 d-flex flex-column">
          <p className="text-default d-inline-flex align-items-center mb-2">
            <i className="ti ti-report-money text-dark me-1" />${deal.value}
          </p>
          {/* Add more deal-related information here */}
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <Link to="#" className="avatar avatar-md flex-shrink-0 me-2">
              <img src="assets/img/profiles/avatar-19.jpg" alt="" />
            </Link>
            <Link to="#" className="text-default">
             {deal?.contact?.[0]?.contact?.firstName+ " "+deal?.contact?.[0]?.contact?.lastName}
            </Link>
          </div>
          <span className="badge badge-sm text-white bg-blue">
            <i className="ti ti-progress me-1" />
            {deal?.status}
          </span>
        </div>
        <div className="d-flex align-items-center justify-content-between border-top pt-3 mt-3">
          <span>
            <i className="ti ti-calendar-due" />{moment(deal?.ceatedDate).format("LL")}
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

export default DealKanbanCard;
