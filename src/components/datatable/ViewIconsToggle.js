import React from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const ViewIconsToggle = ({ view,isActivity=false, setView }) => {
  const navigate = useNavigate()
  return (
    <div className="view-icons">
      <Link
        to="#"
        className={view === "list" ? "active" : ""}
        onClick={() => setView("list")}
      >
        <i className="ti ti-list-tree" />
      </Link>
      <Link
        to="#"
        className={view === "grid" ? "active" : ""}
        onClick={() => {isActivity ?   setView("grid") : setView("grid")}}
      >
        <i className="ti ti-grid-dots" />
      </Link>
    </div>
  );
};

ViewIconsToggle.propTypes = {
  view: PropTypes.string.isRequired, // Current view state, either 'list' or 'grid'
  setView: PropTypes.func.isRequired, // Function to update the view state
};

export default ViewIconsToggle;
