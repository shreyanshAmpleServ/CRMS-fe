import React, { memo, useState } from "react";
import DeleteAlert from "../../../../pages/call/alert/DeleteAlert";
import AddCallsModal from "../../../../pages/call/modal/AddCallsModal";
import { deleteCalls, fetchCalls, updateCalls } from "../../../../redux/calls";
import { fetchCallStatuses } from "../../../../redux/callStatus";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../imageWithBasePath";
import NoDataFound from "../../NotFound/NotFount";
import ImageWithDatabase from "../../ImageFromDatabase";

const CallsDetailsOfUsers = ({ lead_id=null, contact_id=null ,project_id=null }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCall, setSelectedCall] = useState(null);
  const [callsDetails, setCallDetails] = useState();
  const dispatch = useDispatch();

  React.useEffect(() => {
    if(lead_id || contact_id || project_id) {dispatch(fetchCalls({ lead_id,project_id,contact_id }));}
    dispatch(fetchCallStatuses());
  }, [dispatch,lead_id,contact_id , project_id]);
  
  const { callStatuses } = useSelector((state) => state.callStatuses);
  const { calls } = useSelector((state) => state.calls);

  const updateCallStatus = async (data, status) => {
    const finalData = {
      call_for: data?.call_for || "",
      call_for_lead_id: data?.call_for_lead_id || null,
      call_for_contact_id: data?.call_for_contact_id || null,
      assigned_to: data?.assigned_to || null,
      related_to: data?.related_to || null,
      related_to_id: data?.related_to_id || null,
      call_purpose_id: data?.call_purpose_id || null,
      call_status_id: status,
      call_start_date: data?.call_start_date || new Date(),
      call_start_time: data?.call_start_time || "",
      duration_minutes: data?.duration_minutes || null,
      call_subject: data?.call_subject || "",
      call_reminder: data?.call_reminder || null,
      call_notes: data?.call_notes || "",
      follow_up_needed: data?.follow_up_needed || "",
      follow_up_date: data?.follow_up_date || new Date(),
    };
    await dispatch(
      updateCalls({ id: data.id, callData: { ...finalData } })
    ).unwrap();
  };
  const handleDeleteCall = (calls) => {
    setSelectedCall(calls);
    setShowDeleteModal(true);
  };
  const deleteData = () => {
    if (selectedCall) {
      dispatch(deleteCalls(selectedCall.id));
      setShowDeleteModal(false);
    }
  };
  return (
    <>
      <div className="tab-pane fade" id="calls">
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <h4 className="fw-semibold">Calls</h4>
            <div className="d-inline-flex align-items-center">
              <Link
                to="#"
                // className="btn btn-primary"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvas_add_calls"
                className="btn link-purple fw-medium"
              >
                <i className="ti ti-circle-plus me-1" />
                Add New
              </Link>
            </div>
          </div>
          <div className="card-body">
            {calls && calls?.length ? (
              calls?.map((item) => (
                <div className="card mb-3">
                  <div className="card-body">
                    <div className="d-sm-flex align-items-center justify-content-between pb-2">
                      <div className="d-flex align-items-center mb-2">
                        <span className="avatar avatar-md me-2 flex-shrink-0">
                          { item.created_by_user.profile_img ? (
                            <ImageWithDatabase
                              src={
                               item.created_by_user.profile_img
                              }
                              alt="img"
                            />
                          ) : (
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-19.jpg"
                              alt={"img"}
                              className="avatar-xs"
                            />
                          )}
                        </span>
                        <div className="col-sm-10">
                        <p className="mb-0" >
                          {" "}
                          <span>
                            Assiged to{" "}
                            <span className="text-dark text-capitalize fw-medium">
                              {item?.assigned_to_user?.full_name + " , "}
                            </span>
                          </span>
                          <span>
                            {" "}
                            Related to{" "}
                            <span className="text-dark text-capitalize fw-medium">
                              {item?.crms_m_contact_related_to?.firstName +
                                " " +
                                item?.crms_m_contact_related_to?.lastName +
                                " , "}
                            </span>{" "}
                          </span>
                          <span>
                            {" "}
                            Call For{" "}
                            <span className="text-dark text-capitalize fw-medium">
                              {item?.call_for === "Leads"
                                ? item?.crms_leads?.first_name +
                                  "  " +
                                  item?.crms_leads?.last_name
                                :item?.call_for === "Projects" ? item?.crms_project?.name + " Project ": item?.crms_m_contact_call_for?.firstName +
                                  "  " +
                                  item?.crms_m_contact_call_for?.lastName}
                            </span>{" "}
                          </span>
                          logged a call on{" "}
                          {moment.utc(item?.call_start_date).format("lll")}
                        </p>
                     
                            </div>
                      </div>
                       
                      <div className="d-inline-flex align-items-center mb-2">
                        <div className="dropdown me-2">
                          <Link
                            to="#"
                            className={`text-light text-sm  text-nowrap  py-1 ${item?.crms_m_call_statuses.name == "No answer" ? "bg-success" : item?.crms_m_call_statuses.name === "Busy" ? "bg-danger" : item?.crms_m_call_statuses?.name === "Unavailable" ? "bg-info" : item?.crms_m_call_statuses.name === "Wrong Number" ? "bg-warning" : item?.crms_m_call_statuses.name === "Left Voice Message" ? "bg-dark" : "bg-primary"}`}
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            {item.crms_m_call_statuses.name}
                            <i className="ti ti-chevron-down ms-2" />
                          </Link>
                          <div className="dropdown-menu dropdown-menu-right">
                            {callStatuses?.map((i) => (
                              <Link
                                className={`dropdown-item`}
                                to="#"
                                onClick={() => updateCallStatus(item, i.id)}
                              >
                                {i.name}
                              </Link>
                            ))}
                          </div>
                        </div>
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
                              className="dropdown-item edit-popup"
                              to="#"
                              data-bs-toggle="offcanvas"
                              data-bs-target="#offcanvas_add_calls"
                              onClick={() => setCallDetails(item)}
                            >
                              <i className="ti ti-edit text-blue me-1" />
                              Edit
                            </Link>
                            <Link
                              className="dropdown-item"
                              to="#"
                              onClick={() => handleDeleteCall(item)}
                            >
                              <i className="ti ti-trash text-danger me-1" />
                              Delete
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p> <span className="text-dark text-capitalize text-end fw-medium">
                            Created By :   {item?.created_by_user?.full_name}
                            </span>{" "}</p>
                            <p dangerouslySetInnerHTML={{ __html: item?.call_notes }}></p>
                  </div>
                </div>
              ))
            ) : (
              <NoDataFound />
            )}
          </div>
        </div>
      </div>
      <AddCallsModal
        callsDetails={callsDetails}
        setCallDetails={setCallDetails}
      />
      <DeleteAlert
        label={"Call"}
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        onDelete={deleteData}
      />
    </>
  );
};

export const CallsDetailsOfUser = memo(CallsDetailsOfUsers)