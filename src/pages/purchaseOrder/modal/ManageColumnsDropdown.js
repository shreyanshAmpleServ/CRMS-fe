import React from "react";
import { Link } from "react-router-dom";

const ManageColumnsDropdown = () => {
  const columns = [
    { id: "col-name", label: "Name" },
    { id: "col-phone", label: "Phone" },
    { id: "col-email", label: "Email" },
    { id: "col-tag", label: "Tags" },
    { id: "col-loc", label: "Location" },
    { id: "col-rate", label: "Rating" },
    { id: "col-owner", label: "Owner" },
    { id: "col-contact", label: "Contact", defaultChecked: true },
    { id: "col-status", label: "Status" },
    { id: "col-action", label: "Action" },
  ];

  return (
    <div className="dropdown me-2">
      <Link
        to="#"
        className="btn bg-soft-purple text-purple"
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
      >
        <i className="ti ti-columns-3 me-2" />
        Manage Columns
      </Link>
      <div className="dropdown-menu dropdown-menu-md-end dropdown-md p-3">
        <h4 className="mb-2 fw-semibold">Want to manage datatables?</h4>
        <p className="mb-3">
          Please drag and drop your column to reorder your table and enable see
          option as you want.
        </p>
        <div className="border-top pt-3">
          {columns.map((column) => (
            <div
              key={column.id}
              className="d-flex align-items-center justify-content-between mb-3"
            >
              <p className="mb-0 d-flex align-items-center">
                <i className="ti ti-grip-vertical me-2" />
                {column.label}
              </p>
              <div className="status-toggle">
                <input
                  type="checkbox"
                  id={column.id}
                  className="check"
                  defaultChecked={column.defaultChecked || false}
                />
                <label htmlFor={column.id} className="checktoggle" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageColumnsDropdown;
