import React from "react";
import { Link } from "react-router-dom";

const SortDropdown = ({ sortOrder, setSortOrder }) => {
  return (
    <div className="dropdown me-2">
      <Link to="#" className="dropdown-toggle" data-bs-toggle="dropdown">
        <i
          className={`ti ${
            sortOrder === "ascending"
              ? "ti-sort-ascending-2"
              : "ti-sort-descending-2"
          } me-2`}
        />
        Sort{" "}
      </Link>
      <div className="dropdown-menu  dropdown-menu-start">
        <ul>
          <li>
            <Link
              to="#"
              className="dropdown-item"
              onClick={() => setSortOrder("ascending")}
            >
              <i className="ti ti-circle-chevron-right me-1" />
              Ascending
            </Link>
          </li>
          <li>
            <Link
              to="#"
              className="dropdown-item"
              onClick={() => setSortOrder("descending")}
            >
              <i className="ti ti-circle-chevron-right me-1" />
              Descending
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SortDropdown;
