import React, { useRef, useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";
import ImageWithBasePath from "../../components/common/imageWithBasePath";
import dragula, { Drake } from "dragula";
import CollapseHeader from "../../components/common/collapse-header";
import "dragula/dist/dragula.css";
// import AddDealModel from "./modal/AddDealModal";
import {
  fetchPipelines,
  fetchPipelineDeals,
  updateDealStage,
} from "../../redux/pipelines";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../components/common/loader";
import KanbanListItem from "./component/KanbanListItem";
import { fetchActivities, updateActivities } from "../../redux/Activities";
import { StatusOptions } from "../../components/common/selectoption/selectoption";
const ActivitiesKanban = ({ data }) => {
  const dispatch = useDispatch();
   const [newFilter,setNewFilter] = useState("")
  const activityTypes = useSelector((state) => state.activities.activityTypes);

  const { activities , loading} = useSelector((state) => state.activities || {}  );
    React.useEffect(() => {
      // if (!activities || activities.length === 0) {
        dispatch(fetchActivities({filter2:newFilter }));
      // }
    }, [dispatch , newFilter]);
    
     const groupedActivities = activities?.reduce((acc, activity) => {
          const { status } = activity;
      
          if (!acc[status]) {
            acc[status] = [];
          }
      
          acc[status].push(activity);
          return acc;
        }, {});
      
        const FinalActivity = StatusOptions.map((status) => ({
          status : status?.value,
          data: groupedActivities?.[status?.value] && groupedActivities[status?.value].length > 0 ? groupedActivities[status?.value] : null
        }));



  // Ref to store all container references
  const containerRefs = useRef([]);
  const drakeInstance = useRef(null);

  const addContainerRef = (ref) => {
    if (ref && !containerRefs.current.includes(ref)) {
      containerRefs.current.push(ref);
    }
  };
  useEffect(() => {
    // console.log("Initializing Dragula...");
    if (containerRefs.current.length > 0) {
      if (drakeInstance.current) {
        drakeInstance.current.destroy();
        drakeInstance.current = null;
        // console.log("Previous Dragula instance destroyed.");
      }

      drakeInstance.current = dragula(containerRefs.current, {
        moves: (el, source, handle) => true,
        accepts: (el, target) => true,
      });

      // Event handlers (optional)
      drakeInstance.current.on("drop", (el, target, source, sibling) => {
        // console.log("Dropped element:", el);
        // console.log("Target container:", target);
        // console.log("Source container:", source);
        const dealId = el.getAttribute("data-id");
        const targetStageId = target.getAttribute("data-stage-id");
        const sourceStageId = source.getAttribute("data-stage-id");
        if (dealId &&  targetStageId && sourceStageId &&  targetStageId !== sourceStageId) {
          dispatch(updateActivities({id:dealId, activityData:{ status: targetStageId} }),
          );
        }
      });
    }
  
    return () => {
      if (drakeInstance.current) {
        drakeInstance.current.destroy();
        drakeInstance.current = null;
      }
    };
  }, [activities]);
  const route = all_routes;
  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              {/* Page Header */}
              <div className="page-header">
                <div className="row align-items-center">
                  <div className="col-8 d-flex gap-3 align-item-center">
                    <h4 className="page-title">
                      Activities<span className="count-title">{activities?.length || 0  }</span>
                    </h4>
                      <div className="active-list">
                                              <ul className="mb-0">
                                                {activityTypes?.map((item)=><>
                                                  {item?.name === "Calls" && <li>
                                                    <Link
                                                      // to={route.activityCalls}
                                                      to="#"
                                                      onClick={()=>setNewFilter("Calls")}
                                                      data-bs-toggle="tooltip"
                                                      data-bs-placement="top"
                                                      data-bs-original-title="Calls"
                                                      className={`custom-link ${newFilter === "Calls" ? "active-link bg-info" : ""}`}
                                                    >
                                                      <i className="ti ti-phone" />
                                                    </Link>
                                                  </li>}
                                                  {item?.name === "Emails" && <li>
                                                    <Link
                                                      // to={route.activityMail}
                                                      to="#"
                                                      onClick={()=>setNewFilter("Emails")}
                                                      data-bs-toggle="tooltip"
                                                      data-bs-placement="top"
                                                      data-bs-original-title="Emails"
                                                      className={`custom-link ${newFilter === "Emails" ? "active-link bg-info" : ""}`}
                                                    >
                                                      <i className="ti ti-mail" />
                                                    </Link>
                                                  </li>}
                                                 {item?.name === "Task" &&  <li>
                                                    <Link
                                                      // to={route.activityTask}
                                                      to="#"
                                                      onClick={()=>setNewFilter("Task")}
                                                      data-bs-toggle="tooltip"
                                                      data-bs-placement="top"
                                                      data-bs-original-title="Task"
                                                      className={`custom-link ${newFilter === "Task" ? "active-link bg-info" : ""}`}
                                                    >
                                                      <i className="ti ti-subtask" />
                                                    </Link>
                                                  </li>}
                                                 {item?.name === "Meeting" &&<li>
                                                    <Link
                                                      // to={route.activityMeeting}
                                                      to="#"
                                                      onClick={()=>setNewFilter("Meeting")}
                                                      data-bs-toggle="tooltip"
                                                      data-bs-placement="top"
                                                      data-bs-original-title="Meeting"
                                                      className={`custom-link ${newFilter === "Meeting" ? "active-link bg-info" : ""}`}
                                                    >
                                                      <i className="ti ti-user-share" />
                                                    </Link>
                                                  </li>}
                                                </>)}
                                                </ul>
                                              </div>
                  </div>
                  <div className="col-4 d-flex justify-content-end gap-3 align-items-center text-end">
                
                    {/* <div className="head-icons p-0"> */}
                      <CollapseHeader />
                      
                    {/* </div> */}
                    <div>
                  <ul className="d-flex align-items-center">
                    <li>
                      <div className="view-icons me-2">
                        <Link to={route.activities}>
                          <i className="ti ti-list-tree" />
                        </Link>
                        <Link to={route.activityKanban} className="active">
                          <i className="ti ti-grid-dots" />
                        </Link>
                      </div>
                    </li>
                    {/* <li>
                      <Link
                        to="#"
                        className="btn btn-primary"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvas_add_deal"
                      >
                        <i className="ti ti-square-rounded-plus me-2" />
                        Add Deals
                      </Link>
                    </li> */}
                  </ul>
                </div>
                  </div>
                </div>
              </div>
              {/* /Page Header */}
              {/* Filter */}
              {/* <div className="d-flex justify-content-between align-items-center flex-wrap row-gap-2 mb-4">
                <div className="d-flex align-items-center flex-wrap row-gap-2">
                  <div className="form-sorts dropdown me-2">
                    <select
                      id="pipeline-select"
                      onChange={handlePipelineChange}
                      className="form-select"
                      value={selectedPipeline}
                    >
                      <option value=""> Select Type </option>
                      {pipelines?.data?.map((pipeline) => (
                        <option key={pipeline?.id} value={pipeline?.id}>
                          {pipeline?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <ul className="d-flex align-items-center">
                    <li>
                      <div className="view-icons me-2">
                        <Link to={route.activities}>
                          <i className="ti ti-list-tree" />
                        </Link>
                        <Link to={route.activityKanban} className="active">
                          <i className="ti ti-grid-dots" />
                        </Link>
                      </div>
                    </li>
                    <li>
                      <Link
                        to="#"
                        className="btn btn-primary"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvas_add_deal"
                      >
                        <i className="ti ti-square-rounded-plus me-2" />
                        Add Deals
                      </Link>
                    </li>
                  </ul>
                </div>
              </div> */}
              {/* /Filter */}
              {/* Deals Kanban */}
              {loading ? (
                <Loader />
              ) : (
                <div className="d-flex overflow-x-auto align-items-start mb-4">
                 {FinalActivity?.map((item,index)=>
                    <KanbanListItem
                      key={index}
                      // stage={stage}
                      status={item.status}
                      activities={item.data}
                      addContainerRef={addContainerRef}
                    />)}
                </div>
              )}
              {/* /Deals Kanban */}
            </div>
          </div>
        </div>
        {/* <AddDealModel /> */}
      </div>
      {/* /Page Wrapper */}
    </>
  );
};
export default ActivitiesKanban;
