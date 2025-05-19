import React from "react";
import { Link } from "react-router-dom";
const ExportData = ({ exportToPDF, exportToExcel,isCreate=true, id, label }) => {
  return (
    <div className="d-flex align-items-center flex-wrap row-gap-2 justify-content-sm-end">
      <div className="dropdown me-2">
        <Link to="#" className="dropdown-toggle" data-bs-toggle="dropdown">
          <i className="ti ti-package-export me-2" />
          Export
        </Link>
        <div className="dropdown-menu dropdown-menu-end">
          <ul>
            <li>
              <Link to="#" className="dropdown-item" onClick={exportToPDF}>
                <i className="ti ti-file-type-pdf text-danger me-1" />
                Export as PDF
              </Link>
            </li>
            <li>
              <Link to="#" className="dropdown-item" onClick={exportToExcel}>
                <i className="ti ti-file-type-xls text-green me-1" />
                Export as Excel
              </Link>
            </li>
          </ul>
        </div>
      </div>
      {isCreate &&<Link
        to="#"
        className="btn btn-primary"
        data-bs-toggle="offcanvas"
        data-bs-target={`#${id}`}
      >
        <i className="ti ti-square-rounded-plus me-2" />
        {label}
      </Link>}
    </div>
  );
};

export default ExportData;
