import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGroupedActivities,
  updateActivities,
} from "../../../../redux/Activities";
import { fetchUsers } from "../../../../redux/manage-user";
import moment from "moment";
import Select from "react-select";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../imageWithBasePath";
import { ascendingandDecending, sortBy } from "../../selectoption/selectoption";
import NoDataFound from "../../NotFound/NotFount";
import ImageWithDatabase from "../../ImageFromDatabase";

export const ActivityDetailOfUser = ({
  deal_id = null,
  contact_id = null,
  company_id = null,
  vendor_id =null,
  owner_id = null,
  project_id = null,
}) => {
  const [sortById, setSortById] = useState("Upcoming");
  const [orderBy, setOrderBy] = useState("Ascending");
  const [isAssignTo, setIsAssignedTo] = useState(true);
  const [clickedIndex,setClickedIndex] = useState()
  const [loadType,setLoadType] = useState()
  const dispatch = useDispatch();
  // useEffect(async() => {
 
  // },[dispatch])
  useEffect(() => {
    dispatch(fetchUsers());
    (deal_id || contact_id || company_id || vendor_id || owner_id || project_id) && dispatch(fetchGroupedActivities({
        search: "",
        deal_id,
        contact_id,
        company_id,
        vendor_id,
        owner_id,
        project_id,
        orderBy,
        sortBy: sortById,
      }));
  }, [dispatch, isAssignTo,vendor_id,owner_id,project_id, orderBy,deal_id,company_id,contact_id, sortById]);

  const options2 = [
    { value: 3, label: "High" },
    { value: 2, label: "Normal" },
    { value: 1, label: "Low" },
  ];

  const { users } = useSelector((state) => state.users);
  const { activitiesGrouped, loading, error } = useSelector(
    (state) => state.activities
  );
  const updateActivity = async (activity, key, value) => {
    const finalData = {
      title: activity?.title || "",
      type_id: activity?.type_id || null,
      due_date: activity?.due_date || new Date(),
      due_time: activity?.due_time || "",
      reminder_time: activity?.reminder_time || "",
      reminder_type: activity?.reminder_type || "",
      owner_id: activity?.owner_id || null,
      is_reminder: activity?.is_reminder || "N",
      description: activity?.description || "",
      deal_id: activity?.deal_id || null,
      contact_id: activity?.contact_id || null,
      company_id: activity?.company_id || null,
      priority: activity?.priority || 0,
    };
    await dispatch(
      updateActivities({
        id: activity.id,
        activityData:
          key === 3
            ? { ...finalData, owner_id: value }
            : key === 2
              ? { ...finalData, priority: value }
              : "",
      })
    ).unwrap();
    setIsAssignedTo(!isAssignTo);
  };

  return (
    <>
      <div className="tab-pane active show" id="activities">
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <h4 className="fw-semibold">Activities</h4>
            <div className="d-flex gap-2">
              <div className="form-sort mt-0">
                <i className="ti ti-sort-ascending-2" />
                <Select
                  className="select  text-nowrap"
                  options={sortBy}
                  placeholder="Sort By"
                  value={sortById ? sortBy?.find(option => option.value === sortById) : null}
                  classNamePrefix="react-select "
                 
                  onChange={(e) => {setSortById(e.value);setLoadType("Sort")}}
                />
                
              </div>
              <div className="form-sort mt-0">
                <i className="ti ti-sort-ascending-2" />
                <Select
                  className="select"
                  options={ascendingandDecending}
                  placeholder="Ascending"
                  classNamePrefix="react-select"
                  value={orderBy ? ascendingandDecending?.find(option => option.value === orderBy) : null}
                  onChange={(e) => {setOrderBy(e.value);setLoadType("Sort")}}
                />
              </div>
            </div>
          </div>
          <div className="position-relative">
          {  (loadType === "Sort" && loading) ? 
           <div style={{zIndex:9999, paddingTop:'7rem',  minHeight:"23rem",  backgroundColor: 'rgb(255, 255, 255)'}}  
          className=" position-absolute d-flex  w-100 top-0   h-100 bg-gray justify-content-center ">
          <div
            className="spinner-border position-absolute d-flex justify-content-center  text-primary"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          </div> :  activitiesGrouped && Object?.keys(activitiesGrouped)?.length > 0 ? (
            Object?.keys(activitiesGrouped)?.map((item, index) => (
              <div key={index} className="card-body">
                <div className="badge badge-soft-purple fs-14 fw-normal shadow-none mb-3">
                  <i className="ti ti-calendar-check me-1" />
                  {sortById === "Recent"  ?  moment(item).format("ll")   : moment(item).isSame(moment(), "day")
                    ? "Today"
                    : moment(item).isSame(moment().add(1, "days"), "day")
                      ? "Tommorow"
                      : "Upcoming Activity"}
                </div>

                {activitiesGrouped[item]?.map((i, ind) => (
                  <div key={ind}>
                    <div className="card border shadow-none mb-3">
                      <div className="card-body p-3">
                        <div className="d-flex">
                          {i.activity_type?.name === "Emails" ? (
                            <span className="avatar avatar-md flex-shrink-0 rounded me-2 bg-pending">
                              {" "}
                              <i className="ti ti-mail-code" />{" "}
                            </span>
                          ) : i.activity_type?.name === "Calls" ? (
                            <span className="avatar avatar-md flex-shrink-0 rounded me-2 bg-secondary-success">
                              {" "}
                              <i className="ti ti-phone" />{" "}
                            </span>
                          ) : i.activity_type?.name === "Task" ? (
                            <span className="avatar avatar-md flex-shrink-0 rounded me-2 bg-orange">
                              {" "}
                              <i className="ti ti-notes" />
                            </span>
                          ) : i.activity_type?.name === "Meeting" ? (
                            <span className="avatar avatar-md flex-shrink-0 rounded me-2 bg-info">
                              {" "}
                              <i className="ti ti-user-pin" />{" "}
                            </span>
                          ) : (
                            <i className="ti ti-user-pin" />
                          )}

                          <div className="col-sm-11 lh-1">
                            <h6 className="fw-medium mb-1 "> {i?.title}</h6>
                            <p className="mb-1 lh-1">{i?.description} </p>
                            <p>
                              {moment
                                .utc(i?.due_date)
                                .format("DD-MM-YYYY HH:mm A")}
                            </p>
                            {!moment(i.due_date).isSameOrBefore(moment()) && (
                              <div className="upcoming-info col-sm-12 ">
                                <div className="row ">
                                  <div className="col-sm-4">
                                    <p>Reminder</p>
                                    <div className="dropdown">
                                      <Link
                                        to="#"
                                        className="dropdown-toggle"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        <i className="ti ti-clock-edit me-1" />
                                        Reminder
                                        <i className="ti ti-chevron-down ms-1" />
                                      </Link>
                                      {/* <div className="dropdown-menu dropdown-menu-right">
                                        <Link className="dropdown-item" to="#">
                                          Remainder
                                        </Link>
                                        <Link className="dropdown-item" to="#">
                                          1 hr
                                        </Link>
                                        <Link className="dropdown-item" to="#">
                                          10 hr
                                        </Link>
                                      </div> */}
                                    </div>
                                  </div>
                                  <div className="col-sm-4">
                                    <p>Task Priority</p>
                                    <div className="dropdown">
                                      <Link
                                        to="#"
                                        className="dropdown-toggle"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        <i
                                          className={`ti ti-square-rounded-filled me-1 ${i.priority === 1 ? "text-success" : i.priority === 2 ? "text-warning" : "text-danger"} circle`}
                                        />
                                        {i.priority === 1
                                          ? "Low"
                                          : i.priority === 2
                                            ? "Normal"
                                            : "High"}
                                       {(clickedIndex === index && loadType === "P" && loading) ? (
                                          <div
                                            style={{
                                              height: "15px",
                                              width: "15px",
                                            }}
                                            className="spinner-border ml-2 text-success"
                                            role="status"
                                          >
                                            <span className="visually-hidden">
                                              Loading...
                                            </span>
                                          </div>
                                        ) : (
                                          <i className="ti ti-chevron-down ms-1" />
                                        )}
                                      </Link>
                                      <div className="dropdown-menu dropdown-menu-right">
                                        {options2?.map((item) => (
                                          <Link
                                            className="dropdown-item"
                                            to="#"
                                            onClick={() => {
                                              setClickedIndex(index)
                                              setLoadType("P")
                                              updateActivity(i, 2, item.value);
                                            }}
                                          >
                                            <i
                                              className={`ti ti-square-rounded-filled me-1 ${item.value === 1 ? "text-success" : item.value === 2 ? "text-warning" : "text-danger"} circle`}
                                            />
                                            {item.label}
                                          </Link>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-sm-4">
                                    <p>Assigned to</p>
                                    <div className="dropdown">
                                      <Link
                                        to="#"
                                        className="dropdown-toggle"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        <ImageWithDatabase
                                          src={i?.owner?.profile_img || "assets/img/profiles/avatar-19.jpg"}
                                          alt="img"
                                          className="avatar-xs"
                                        />
                                        {i.owner.full_name
                                          ? i.owner.full_name
                                          : "Choose"}
                                        {(clickedIndex === index && loadType === "A" && loading) ? (
                                          <div
                                            style={{
                                              height: "15px",
                                              width: "15px",
                                            }}
                                            className="spinner-border text-success"
                                            role="status"
                                          >
                                            <span className="visually-hidden">
                                              Loading...
                                            </span>
                                          </div>
                                        ) : (
                                          <i className="ti ti-chevron-down ms-1" />
                                        )}
                                      </Link>
                                      <div className="dropdown-menu dropdown-menu-right">
                                        {users?.data?.map((user,inx) => (
                                          <button
                                            key={inx}
                                            className="dropdown-item"
                                            onClick={() => {
                                              setClickedIndex(index)
                                              setLoadType("A")
                                              user.id && updateActivity(i, 3, user.id);
                                            }}
                                          >
                                            <ImageWithDatabase                                              src={
                                                user.profile_img ||
                                                "assets/img/profiles/avatar-19.jpg"
                                              } // Fallback image path if not provided
                                              alt={""}
                                              className="avatar-xs"
                                            />
                                            {user.full_name}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* {<div className="card border shadow-none mb-3">
                <div className="card-body p-3">
                  <div className="d-flex">
                    <span className="avatar avatar-md flex-shrink-0 rounded me-2 bg-secondary-success">
                      <i className="ti ti-phone" />
                    </span>
                    <div>
                      <h6 className="fw-medium mb-1">
                        Denwar responded to your appointment schedule question
                        by call at 09:30pm.
                      </h6>
                      <p>09:25 pm</p>
                    </div>
                  </div>
                </div>
              </div>}
              { <div className="card border shadow-none mb-3">
                <div className="card-body p-3">
                  <div className="d-flex">
                    <span className="avatar avatar-md flex-shrink-0 rounded me-2 bg-orange">
                      <i className="ti ti-notes" />
                    </span>
                    <div>
                      <h6 className="fw-medium mb-1">Notes added by Antony</h6>
                      <p className="mb-1">
                        Please accept my apologies for the inconvenience caused.
                        It would be much appreciated if it's possible to
                        reschedule to 6:00 PM, or any other day that week.
                      </p>
                      <p>10.00 pm</p>
                    </div>
                  </div>
                </div>
              </div>} */}
                    {/* <div className="badge badge-soft-purple fs-14 fw-normal shadow-none mb-3">
                <i className="ti ti-calendar-check me-1" />
                28 Feb 2024
              </div> */}
                    {/* { <div className="card border shadow-none mb-3">
                <div className="card-body p-3">
                  <div className="d-flex">
                    <span className="avatar avatar-md flex-shrink-0 rounded me-2 bg-secondary-success">
                      <i className="ti ti-user-pin" />
                    </span>
                    <div>
                      <h6 className="fw-medium mb-1 d-inline-flex align-items-center flex-wrap">
                        Meeting With{" "}
                        <span className="avatar avatar-xs mx-2">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-19.jpg"
                            alt="img"
                          />
                        </span>{" "}
                        Abraham
                      </h6>
                      <p>Schedueled on 05:00 pm</p>
                    </div>
                  </div>
                </div>
              </div>} */}
                    {/* <div className="card border shadow-none mb-3">
                <div className="card-body p-3">
                  <div className="d-flex">
                    <span className="avatar avatar-md flex-shrink-0 rounded me-2 bg-secondary-success">
                      <i className="ti ti-notes" />
                    </span>
                    <div>
                      <h6 className="fw-medium mb-1">
                        Drain responded to your appointment schedule question.
                      </h6>
                      <p>09:25 pm</p>
                    </div>
                  </div>
                </div>
              </div> */}

                    {/* {moment(i.dueDate).isSameOrBefore(moment()) &&  <div className="card border shadow-none mb-0">
                <div className="card-body p-3">
                <div className="d-flex">
                    
                    {i.activity_type?.name === "Emails" ? <span className="avatar avatar-md flex-shrink-0 rounded me-2 bg-pending"> <i className="ti ti-mail-code" /> </span> 
                    :i.activity_type?.name === "Calls" ?   <span className="avatar avatar-md flex-shrink-0 rounded me-2 bg-secondary-success"> <i className="ti ti-phone" /> </span>
                    : i.activity_type?.name === "Task" ?  <span className="avatar avatar-md flex-shrink-0 rounded me-2 bg-orange"> <i className="ti ti-notes" /></span>
                    : i.activity_type?.name === "Meeting" ?  <span className="avatar avatar-md flex-shrink-0 rounded me-2 bg-info"> <i className="ti ti-user-pin" /> </span> 
                    : <i className="ti ti-user-pin" />   }
                    
                    <div>
                    <h6 className="fw-medium mb-1"> {i?.title}</h6>
                      <p className="mb-1">{i?.description} </p>
                      <p>{moment(i?.due_date)?.format("DD-MM-YYYY  HH:MM A")}</p>
                      <div className="upcoming-info">
                        <div className="row">
                          <div className="col-sm-4">
                            <p>Reminder</p>
                            <div className="dropdown">
                              <Link
                                to="#"
                                className="dropdown-toggle"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <i className="ti ti-clock-edit me-1" />
                                Reminder
                                <i className="ti ti-chevron-down ms-1" />
                              </Link>
                              <div className="dropdown-menu dropdown-menu-right">
                                <Link className="dropdown-item" to="#">
                                  Remainder
                                </Link>
                                <Link className="dropdown-item" to="#">
                                  1 hr
                                </Link>
                                <Link className="dropdown-item" to="#">
                                  10 hr
                                </Link>
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <p>Task Priority</p>
                            <div className="dropdown">
                              <Link
                                to="#"
                                className="dropdown-toggle"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <i className="ti ti-square-rounded-filled me-1 text-danger circle" />
                                High
                                <i className="ti ti-chevron-down ms-1" />
                              </Link>
                              <div className="dropdown-menu dropdown-menu-right">
                                <Link className="dropdown-item" to="#">
                                  <i className="ti ti-square-rounded-filled me-1 text-danger circle" />
                                  High
                                </Link>
                                <Link className="dropdown-item" to="#">
                                  <i className="ti ti-square-rounded-filled me-1 text-success circle" />
                                  Low
                                </Link>
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <p>Assigned to</p>
                            <div className="dropdown">
                              <Link
                                to="#"
                                className="dropdown-toggle"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <ImageWithBasePath
                                  src="assets/img/profiles/avatar-19.jpg"
                                  alt="img"
                                  className="avatar-xs"
                                />
                                John
                                <i className="ti ti-chevron-down ms-1" />
                              </Link>
                              <div className="dropdown-menu dropdown-menu-right">
                                <Link className="dropdown-item" to="#">
                                  <ImageWithBasePath
                                    src="assets/img/profiles/avatar-19.jpg"
                                    alt="img"
                                    className="avatar-xs"
                                  />
                                  John
                                </Link>
                                <Link className="dropdown-item" to="#">
                                  <ImageWithBasePath
                                    src="assets/img/profiles/avatar-15.jpg"
                                    alt="img"
                                    className="avatar-xs"
                                  />
                                  Peter
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>} */}
                  </div>
                ))}
              </div>
            ))
          ) : (
            <NoDataFound />
          )}
            
          </div>
       
        </div>
      </div>
    </>
  );
};
