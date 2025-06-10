import React, { useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";
import ImageWithBasePath from "../../components/common/imageWithBasePath";
import { deleteCompany } from "../../redux/companies";
import EditCompanyModal from "./modal/EditCompanyModal";
import DeleteAlert from "./alert/DeleteAlert";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const PipelineGrid = ({ data }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [visibleItems, setVisibleItems] = useState(3); // Default visible items
  const [loading, setLoading] = useState(false); // New state for loading

  const handleDeleteCompany = (company) => {
    setSelectedCompany(company);
    setShowDeleteModal(true);
  };

  const deleteData = () => {
    if (selectedCompany) {
      dispatch(deleteCompany(selectedCompany.id)); // Dispatch the delete action
      navigate(`/crms/companies`); // Navigate to the specified route
      setShowDeleteModal(false); // Close the modal
    }
  };

  const handleLoadMore = () => {
    setLoading(true); // Set loading state to true when loading more items
    setTimeout(() => {
      setVisibleItems((prev) => prev + 3); // Increase visible items by 3
      setLoading(false); // Set loading state to false after the items are loaded
    }, 1000); // Simulate a loading delay of 1 second
  };

  return (
    <>
      <div className="row">
        {data.slice(0, visibleItems).map((company, index) => (
          <div
            className="col-xxl-3 col-xl-4 col-md-6"
            key={company.id || index}
          >
            <div className="card border" style={{ height: "250px" }}>
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center">
                    <Link
                      to={`/companies/${company?.id}`}
                      className="avatar avatar-md flex-shrink-0 me-2"
                    >
                      {company?.logo ? (
                        <img
                          src={company?.logo}
                          alt="Company Logo"
                          className="preview"
                        />
                      ) : (
                        <ImageWithBasePath
                          src="assets/img/profiles/default-avatar.jpg"
                          alt="Company Logo"
                        />
                      )}
                    </Link>
                    <div>
                      <h6>
                        <Link
                          to={`/companies/${company?.id}`}
                          className="fw-medium"
                        >
                          {company.name || "N/A"}
                        </Link>
                      </h6>
                      <p className="text-default">
                        {company.industryType || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="dropdown table-action">
                    <Link
                      to="#"
                      className="action-icon"
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
                        data-bs-target="#offcanvas_edit_company"
                        onClick={() => setSelectedCompany(company)}
                      >
                        <i className="ti ti-edit text-blue" /> Edit
                      </Link>
                      <Link
                        className="dropdown-item"
                        to="#"
                        onClick={() => handleDeleteCompany(company)}
                      >
                        <i className="ti ti-trash text-danger" /> Delete
                      </Link>
                      <Link
                        className="dropdown-item"
                        to={`/companies/${company?.id}`}
                      >
                        <i className="ti ti-eye text-blue-light" /> Preview
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="d-block">
                  <div className="d-flex flex-column mb-3">
                    <p className="text-default d-inline-flex align-items-center mb-2">
                      <i className="ti ti-mail text-dark me-1" />
                      {company.email || "No Email"}
                    </p>
                    <p className="text-default d-inline-flex align-items-center mb-2">
                      <i className="ti ti-phone text-dark me-1" />
                      {company.phone || "No Phone"}
                    </p>
                    <p className="text-default d-inline-flex align-items-center">
                      <i className="ti ti-map-pin-pin text-dark me-1" />
                      {`${company.address || ""}, ${company.country || ""}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {visibleItems < data.length && ( // Show Load More button only if there are more items
        <div className="load-btn text-center pb-4">
          <button onClick={handleLoadMore} className="btn btn-primary">
            {loading ? (
              <>
                Loading...
                <i className="ti ti-loader" />
              </>
            ) : (
              "Load More Contacts"
            )}
          </button>
        </div>
      )}

      <EditCompanyModal company={selectedCompany} />
      <DeleteAlert
        label="Company"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        selectedCompany={selectedCompany}
        onDelete={deleteData}
      />
    </>
  );
};

export default PipelineGrid;
