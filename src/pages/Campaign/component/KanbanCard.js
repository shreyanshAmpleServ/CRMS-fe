// DealKanbanCard.js
import React from "react";
import { Link } from "react-router-dom";
import moment from "moment"
import ImageWithDatabase from "../../../components/common/ImageFromDatabase";

const ActContainerIDKanbanCard = ({ activity, ActContainerID }) => {
  return (
    <div className="card kanban-card border" data-id={ActContainerID}>
      <div className="card-body">
        <div className="d-block">
          <div
            className="mb-3"
            // style={{ border: `2px solid ${stage.colorCode}` }}
          />
          <div className="d-flex align-items-center mb-3">
            {/* <Link
              to="/deal-details"
              className="avatar avatar-lg bg-gray flex-shrink-0 me-2"
            >
              <span className="avatar-title text-dark">Deal</span>
            </Link> */}
            <h6 className="fw-medium">
              <Link to="#">{activity?.title}</Link>
            </h6>
          </div>
        </div>
        <div className="mb-3 d-flex flex-column">
          <p className="text-default d-inline-flex align-items-center mb-2">
            <i className="ti ti-report-money text-dark me-1" />{activity?.activity_type.name}
          </p>
          {/* Add more deal-related information here */}
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <Link to="#" className="avatar avatar-md flex-shrink-0 me-2">
              {/* <img src="assets/img/profiles/avatar-19.jpg" alt="" /> */}
              <ImageWithDatabase src={activity?.owner?.profile_img} />
            </Link>
            <Link to="#" className="text-default">
             {activity?.owner?.full_name}
            </Link>
          </div>
          <span className="badge badge-sm text-white bg-blue">
            <i className="ti ti-progress me-1" />
            {activity?.activity_type.name}
          </span>
        </div>
        <div className="d-flex align-items-center justify-content-between border-top pt-3 mt-3">
          <span>
            <i className="ti ti-calendar-due" />{moment(activity?.ceatedDate).format("LL")}
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

export default ActContainerIDKanbanCard;
