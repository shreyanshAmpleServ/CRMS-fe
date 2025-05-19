import moment from "moment";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { deleteAttachment } from "../../redux/attachment";
import DeleteAlert from "./alert/DeleteAlert";
import AddFile from "./modal/AddDocumentModal";

const ProjectsGrid = ({ data  }) => {
  const dispatch = useDispatch();
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [visibleItems, setVisibleItems] = useState(3); // Default visible items
  const [loading, setLoading] = useState(false); // New state for loading

  const handleDownload = (url, filename) => {
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/octet-stream", // Treat as a binary file
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute("download", filename || "file.jpg"); // Force download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => console.error("Download failed:", error));
  };
  
  const handleDeleteCompany = (company) => {
    setSelectedDoc(company);
    setShowDeleteModal(true);
  };

  const deleteData = () => {
    if (selectedDoc) {
      dispatch(deleteAttachment(selectedDoc.id)); // Dispatch the delete action
      // navigate(`/companies`); // Navigate to the specified route
      setShowDeleteModal(false); // Close the modal
    }
  };

  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleItems((prev) => prev + 3); // Increase visible items by 3
      setLoading(false);
    }, 1000); // Simulate loading delay
  };

  const getFileExtension = (fileUrl) => {
    if (!fileUrl) return "";
    return fileUrl.split('.').pop().split('?')[0].split('#')[0].toLowerCase();
  };

  return (
    <>
      <div className="row p-3">
        {data.slice(0, visibleItems).map((company, index) => {
          const fileUrl = company?.file || "";
          const extension = getFileExtension(fileUrl);
          const imageExtensions = ["jpg", "jpeg", "png", "avif"];

          return (
            <div className="col-xxl-3 col-xl-4 col-md-6" key={company.id || index}>
              <div className="card border" style={{ height: "250px" }}>
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center">
                      <Link target="_blank"    style={{ margin: "0px",width:"4rem",padding:"5px", borderRadius: "5px" }} className="dropdown-item" to={fileUrl}>
                        {imageExtensions.includes(extension) ? (
                          <img
                            src={fileUrl}
                            alt="Preview"
                            style={{ width: "3rem", height: "3rem", margin: "0px", borderRadius: "5px" }}
                          />
                        ) : (
                          <div
                            className="text-light bg-danger h1 d-flex justify-content-center align-items-center pt-2"
                            style={{ width: "3rem", height: "3rem", margin: "0px", borderRadius: "5px" }}
                          >
                            <i className="ti ti-pdf" />
                          </div>
                        )}
                      </Link>
                      <div>
                        <h6>
                          <Link className="text-break fw-large h5">
                            {company.filename || "N/A"}
                          </Link>
                        </h6>
                        <p className="text-default">{company.file_type || "N/A"}</p>
                      </div>
                    </div>
                    <div className="dropdown table-action">
                      <Link to="#" className="action-icon" data-bs-toggle="dropdown">
                        <i className="fa fa-ellipsis-v" />
                      </Link>
                      <div className="dropdown-menu dropdown-menu-right">
                        <Link
                          className="dropdown-item"
                          to="#"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#offcanvas_add_documents"
                          onClick={() => setSelectedDoc(company)}
                        >
                          <i className="ti ti-edit text-blue" /> Edit
                        </Link>
                        <Link className="dropdown-item" to="#" onClick={() => handleDeleteCompany(company)}>
                          <i className="ti ti-trash text-danger" /> Delete
                        </Link>
                        {["jpeg","jpg","png"]?.includes(company?.file?.split('.').pop().split('?')[0].split('#')[0].toLowerCase()) ? 
                                  <div className="dropdown-item" onClick={()=>handleDownload(company.file,`${company?.filename}`)}  >
                                  <i className="ti ti-download text-info me-1" />
                                    Download
                              </div> 
                              : <Link target="_blank" className="dropdown-item"    to={company?.file} >
                                        <i className="ti ti-download text-info me-1" />
                                          Download
                                    </Link>
                                    }
                        {/* <Link className="dropdown-item" to={`/companies/${company?.id}`}>
                          <i className="ti ti-eye text-blue-light" /> Preview
                        </Link> */}
                      </div>
                    </div>
                  </div>
                  <div className="d-block">
                    <div className="d-flex flex-column mb-3">
                      {/* <p className="text-default d-inline-flex align-items-center mb-2">
                        <span className="col-md-4 text-dark">Doc.Type</span>
                        <span>{company.file_type || "No Type"}</span>
                      </p>
                      <p className="text-default d-inline-flex align-items-center mb-2">
                        <span className="col-md-4 text-dark">Doc.Name</span>
                        <span>{company.filename || "Unknown"}</span>
                      </p> */}
                      <p className="text-default d-inline-flex align-items-center mb-2">
                        <span className="col-md-4 text-dark">Category </span>
                        <span>{company.related_entity_type || "Unknown"}</span>
                      </p>
                      <p className="text-default d-inline-flex align-items-center mb-2">
                        <span className="col-md-4 text-dark">Related To</span>
                        <span>{company.related_entity_name || "No Type"}</span>
                      </p>
                      <p className="text-default d-inline-flex align-items-center mb-2">
                        <span className="col-md-4 text-dark">Created by</span>
                        <span>{company.created_user.full_name || "No due date"}</span>
                      </p>
                      <p className="text-default d-inline-flex align-items-center mb-2">
                        <span className="col-md-4 text-dark">Created at</span>
                        <span>{moment(company.createdate).format("ll") || "No start date"}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {visibleItems < data.length && (
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


      <AddFile data={selectedDoc} setData={setSelectedDoc} />
      <DeleteAlert
        label="Attachment"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        selectedDoc={selectedDoc}
        onDelete={deleteData}
      />
    </>
  );
};

export default ProjectsGrid;
