import React from "react";
import { Link } from "react-router-dom";
const AddButton = ({ id, label, setMode }) => {
  return (
    <div className="d-flex align-items-center flex-wrap row-gap-2 justify-content-sm-end">
      <Link
        to="#"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target={`#${id}`}
        onClick={setMode}
      >
        <i className="ti ti-square-rounded-plus me-2" />
        {label}
      </Link>
    </div>
  );
};

export default AddButton;
