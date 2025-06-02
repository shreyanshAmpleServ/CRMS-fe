import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { updatePipeline } from "../../../redux/pipelines"; // Replace with your actual update action
import ImageWithBasePath from "../../../components/common/imageWithBasePath";
import AccessUserModel from "./AccessUserModel";
import AddNewStage from "./AddNewStage";
import DeleteAlert from "../alert/DeleteAlert";
import EditStage from "./EditStage";

const EditPipelineModal = ({ pipeline }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.pipelines);
console.log("Pipeline",pipeline)
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: pipeline?.name || "",
      stages: pipeline?.stages || [],
      is_active: pipeline?.is_active || "Y",
    },
  });

  const [stages, setStages] = useState(pipeline?.stages || []);
  const [selectedStage, setSelectedStage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    setValue("name", pipeline?.name);
    setValue("is_active", pipeline?.is_active || "Y");
    setStages(pipeline?.stages || []);
  }, [pipeline, setValue]);

  const handleAddStage = (newStageName, colorCode) => {
    setStages([...stages, { name: newStageName, colorCode }]);
  };

  const handleRemoveStage = () => {
    setShowDeleteModal(false);
    setStages(stages.filter((_, i) => i !== selectedStage));
  };

  const handleEditStage = (updatedStage) => {
    setStages(
      stages.map((stage) =>
        stage.id === updatedStage.id
          ? {
              ...stage,
              id: updatedStage.id,
              name: updatedStage.name,
              colorCode: updatedStage.colorCode,
            }
          : stage,
      ),
    );
  };

  const onSubmit = async (data) => {
    const closeButton = document.getElementById("edit_offcanvas_pipeline_btn");
    const payload = {
      ...data,
      stages: stages?.map((stage, index) => ({
        name: stage.name,
        colorCode: stage.colorCode,
        order: index,
        id: stage.id,
      })),
    };
    try {
      await dispatch(
        updatePipeline({ id: pipeline?.id, pipelineData: payload }),
      ).unwrap();
      closeButton.click(); // Close the modal after successful update
      reset();
    } catch (error) {
      closeButton.click(); // Close the modal even if there's an error
    }
  };

  return (
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="edit_offcanvas_pipeline"
    >
      <div className="offcanvas-header border-bottom">
        <h4>Edit Pipeline</h4>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          id="edit_offcanvas_pipeline_btn"
        >
          <i className="ti ti-x" />
        </button>
      </div>
      <div className="offcanvas-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="col-form-label">
              Pipeline Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              {...register("name", {
                required: "Pipeline name is required",
              })}
            />
            {errors.name && (
              <small className="text-danger">{errors.name.message}</small>
            )}
          </div>

          <div className="mb-3">
            <div className="pipe-title d-flex align-items-center justify-content-between">
              <h5 className="form-title">Pipeline Stages</h5>
              <Link
                to="#"
                className="add-stage"
                data-bs-toggle="modal"
                data-bs-target="#edit_pipeline_add_stage"
              >
                <i className="ti ti-square-rounded-plus" />
                Add New
              </Link>
            </div>
            <div className="pipeline-listing">
              {stages?.map((stage, index) => (
                <div
                  key={index}
                  className="pipeline-item"
                  style={{ "--stage-color": stage?.colorCode }}
                >
                  <p>
                    <i className="ti ti-grip-vertical" /> {stage.name}
                  </p>
                  <div className="action-pipeline">
                    <a
                      href="#"
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#edit_pipeline_edit_stage"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedStage(stage);
                      }}
                    >
                      <i className="ti ti-edit text-blue" />
                      Edit
                    </a>
                    <a
                      href="#"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedStage(index);
                        setShowDeleteModal(true);
                      }}
                    >
                      <i className="ti ti-trash text-danger" />
                      Delete
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* <div className="mb-3">
            <h5 className="form-title">Access</h5>
            <div className="d-flex flex-wrap access-item nav">
              <div
                className="radio-btn"
                data-bs-toggle="tab"
                data-bs-target="#all"
              >
                <input
                  type="radio"
                  className="status-radio"
                  id="all"
                  name="status"
                  defaultChecked
                />
                <label htmlFor="all">All</label>
              </div>
              <div
                className="radio-btn"
                data-bs-toggle="tab"
                data-bs-target="#select-person"
              >
                <input
                  type="radio"
                  className="status-radio"
                  id="select"
                  name="status"
                />
                <label htmlFor="select">Select Person</label>
              </div>
            </div>
          </div> */}
          <div className="mb-3">
            <label className="col-form-label">Status</label>
            <div className="d-flex flex-wrap">
              <div className="me-2">
                <input
                  type="radio"
                  className="status-radio"
                  id="edit-active"
                  value="Y"
                  {...register("is_active")}
                />
                <label htmlFor="edit-active">Active</label>
              </div>
              <div>
                <input
                  type="radio"
                  className="status-radio"
                  id="edit-inactive"
                  value="N"
                  {...register("is_active")}
                />
                <label htmlFor="edit-inactive">Inactive</label>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <button
              type="button"
              data-bs-dismiss="offcanvas"
              className="btn btn-light me-2"
              id=""
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
      <AccessUserModel />
      <AddNewStage
        onAddStage={handleAddStage}
        modelID={"edit_pipeline_add_stage"}
      />
      <EditStage
        stage={selectedStage}
        onEditStage={handleEditStage}
        modelID={"edit_pipeline_edit_stage"}
      />

      <DeleteAlert
        label="Stage"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        onDelete={handleRemoveStage}
      />
    </div>
  );
};

export default EditPipelineModal;
