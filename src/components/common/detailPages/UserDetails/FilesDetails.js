import React, { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DeleteAlert from "../../../../pages/call/alert/DeleteAlert";
import { deleteAttachment, fetchAttachment } from "../../../../redux/attachment";
import ImageWithDatabase from "../../ImageFromDatabase";
import NoDataFound from "../../NotFound/NotFount";
import AddFile from "./Modal/AddFile";

const FilesDetails = ({ type,type_id,type_name="Unknown" }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
//   const [callsDetails, setCallDetails] = useState();
const [data,setData] = useState()
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(fetchAttachment(type));
  }, [dispatch]);

  const {attachments } = useSelector((state)=>state?.attachments)

const deleteData = () => {
    if (selectedAttachment) {
      dispatch(deleteAttachment(selectedAttachment));
      setShowDeleteModal(false);
      setSelectedAttachment(null)
    }
  };
  return (
    <>
      <div className="tab-pane fade" id="files">
        <div className="card">
          <div className="card-header">
            <h4 className="fw-semibold">Files</h4>
          </div>
          <div className="card-body">
            <div className="card border mb-3">
              <div className="card-body pb-0">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <div className="mb-3">
                      <h4 className="fw-medium mb-1">Manage Documents</h4>
                      {/* <p>
                        Send customizable quotes, proposals and contracts to
                        close deals faster.
                      </p> */}
                    </div>
                  </div>
                  <div className="col-md-4 text-md-end">
                    <div className="mb-3">
                      <Link
                         to="#"
                         className="btn btn-primary"
                         data-bs-toggle="modal"
                         data-bs-target="#new_file"
                        >
                        Create Document
                      </Link>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
           {attachments?.length ? attachments?.map((items)=> <div className="card border shadow-none mb-3">
              <div className="card-body pb-0">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <div className="mb-3">
                      <h4 className="fw-medium mb-1">
                       {items?.filename}
                      </h4>
                      <p>
                       {items?.description}
                      </p>
                      <div className="d-flex align-items-center">
                        <span className="avatar avatar-md me-2 flex-shrink-0">
                          <ImageWithDatabase
                            src={items?.created_user?.profile_img}
                            alt="img"
                            // className="rounded-circle"
                          />
                        </span>
                        <div style={{lineHeight:"1.1"}}>
                          <p style={{marginBottom:0}}>{items?.created_user?.full_name}</p>
                          <span className="fs-12">{items?.created_user?.crms_d_user_role?.[0]?.crms_m_role?.role_name}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 text-md-end">
                    <div className="mb-3 d-inline-flex align-items-center">
                      <span className={`badge ${items?.file_type === "Proposal" ? "badge-danger-light" : items?.file_type == "Quote" ? "badge-soft-secondary" :"badge-soft-success"} me-1`}>
                        {items?.file_type}
                      </span>
                      {/* <span className="badge bg-pending priority-badge me-1">
                        Draft
                      </span> */}
                      <div className="dropdown">
                        <Link
                          to="#"
                          className="p-0 btn btn-icon btn-sm d-flex align-items-center justify-content-center"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <i className="ti ti-dots-vertical" />
                        </Link>
                        <div className="dropdown-menu dropdown-menu-right">
                          <Link
                          onClick={()=>setData(items)} className="dropdown-item"   data-bs-toggle="modal"
                         data-bs-target="#new_file" to="#">
                            <i className="ti ti-edit text-blue me-1" />
                            Edit
                          </Link>
                          <Link onClick={()=>{setSelectedAttachment(items?.id);setShowDeleteModal(true)}} className="dropdown-item" to="#">
                            <i className="ti ti-trash text-danger me-1" />
                            Delete
                          </Link>
                          <Link target="_blank" className="dropdown-item" to={items?.file}>
                            <i className="ti ti-download text-info me-1" />
                            Download
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>)
            :
            <NoDataFound />}
          
          </div>
        </div>
      </div>
      <AddFile data={data} setData={setData}  type={type} type_id={type_id} type_name={type_name} />
      <DeleteAlert
        label={"Attachment"}
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        onDelete={deleteData}
      />
    </>
  );
};

export default memo(FilesDetails);
