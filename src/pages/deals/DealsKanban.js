import React, { useRef, useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";
import ImageWithBasePath from "../../components/common/imageWithBasePath";
import dragula, { Drake } from "dragula";
import CollapseHeader from "../../components/common/collapse-header";
import "dragula/dist/dragula.css";
import AddDealModel from "./modal/AddDealModal";
import {
  fetchPipelines,
  fetchPipelineDeals,
  updateDealStage,
} from "../../redux/pipelines";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../components/common/loader";
import KanbanListItem from "./component/KanbanListItem";
const DealsKanban = ({ data }) => {
  const dispatch = useDispatch();
  // State to track the selected pipeline
  const [selectedPipeline, setSelectedPipeline] = useState(null);
  const [totalDeals, setTotalDeals] = useState(0);

  const { pipelines, deals, loading, error, success } = useSelector(
    (state) => state.pipelines,
  );
  // console.log("Deal Kanban Card : ",pipelines ,deals)
  // Fetch pipelines on component mount
  useEffect(() => {
    dispatch(fetchPipelines());
  }, [dispatch]);

  // Fetch deals for the first pipeline by default when pipelines are loaded
  useEffect(() => {
    if (pipelines?.length > 0 && !selectedPipeline) {
      const firstPipelineId = pipelines[0].id;
      setSelectedPipeline(firstPipelineId);
      dispatch(fetchPipelineDeals(firstPipelineId));
    }
    const TotalDeals = deals?.pipeline?.stages.reduce((totalDeals, stage) => {
      return totalDeals + stage.totalDeals; // Add number of deals in each stage
    }, 0);
    setTotalDeals(TotalDeals);
  }, [pipelines, dispatch, selectedPipeline, deals]);

  // Handle pipeline selection
  const handlePipelineChange = (event) => {
    const selectedPipelineId = event.target.value;
    setSelectedPipeline(selectedPipelineId);
    if (selectedPipelineId) {
      dispatch(fetchPipelineDeals(selectedPipelineId));
    }
  };

  // Ref to store all container references
  const containerRefs = useRef([]);
  const drakeInstance = useRef(null);

  const addContainerRef = (ref) => {
    console.log("ContainerRefs ",drakeInstance, containerRefs , ref)
    if (ref && !containerRefs.current.includes(ref)) {
      containerRefs.current.push(ref);
    }
  };

  useEffect(() => {
    if (containerRefs.current.length > 0) {
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
        if (
          dealId &&
          targetStageId &&
          sourceStageId &&
          targetStageId !== sourceStageId
        ) {
          console.log(
            `Deal ${dealId} moved from ${sourceStageId} to ${targetStageId} for the selectedPipeline ${selectedPipeline}`,
          );

          // Dispatch an action to update the deal's stage
          dispatch(
            updateDealStage({
              dealId,
              stageId: targetStageId,
              pipelineId: selectedPipeline,
            }),
          );
        }
      });
    }

    return () => {
      if (drakeInstance.current) {
        drakeInstance.current.destroy();
      }
    };
  }, [deals]);
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
                  <div className="col-8">
                    <h4 className="page-title">
                      Deals<span className="count-title">{totalDeals}</span>
                    </h4>
                  </div>
                  <div className="col-4 text-end">
                    <div className="head-icons">
                      <CollapseHeader />
                    </div>
                  </div>
                </div>
              </div>
              {/* /Page Header */}
              {/* Filter */}
              <div className="d-flex justify-content-between align-items-center flex-wrap row-gap-2 mb-4">
                <div className="d-flex align-items-center flex-wrap row-gap-2">
                  <div className="form-sorts dropdown me-2">
                    <select
                      id="pipeline-select"
                      onChange={handlePipelineChange}
                      className="form-select"
                      value={selectedPipeline}
                    >
                      <option value=""> Select a Pipeline </option>
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
                        <Link to={route.deals}>
                          <i className="ti ti-list-tree" />
                        </Link>
                        <Link to={route.dealsKanban} className="active">
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
              </div>
              {/* /Filter */}
              {/* Deals Kanban */}
              {loading ? (
                <Loader />
              ) : (
                <div className="d-flex overflow-x-auto align-items-start mb-4">
                  {deals?.pipeline?.stages.map((stage) => (
                    <KanbanListItem
                      key={stage.id}
                      stage={stage}
                      addContainerRef={addContainerRef}
                    />
                  ))}
                </div>
              )}
              {/* /Deals Kanban */}
            </div>
          </div>
        </div>
        <AddDealModel />
      </div>
      {/* /Page Wrapper */}
    </>
  );
};
export default DealsKanban;
