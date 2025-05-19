import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addCallResult, updateCallResult } from "../../../../redux/callResult";

const AddEditModal = ({ mode = "add", initialData = null }) => {
  const { loading } = useSelector((state) => state.callStatuses);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const dispatch = useDispatch();

  // Prefill form in edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        name: initialData.name || "",
        description: initialData.description || "",
        is_active: initialData.is_active,
      });
    } else {
      reset({
        name: "",
        description: "",
        is_active: "Y",
      });
    }
  }, [mode, initialData, reset]);

  const onSubmit = (data) => {
    const closeButton = document.getElementById(
      "close_btn_add_edit_call_status_modal",
    );
    if (mode === "add") {
      // Dispatch Add action
      dispatch(
        addCallResult({
          name: data.name,
          description: data.description,
          is_active: data.is_active,
        }),
      );
    } else if (mode === "edit" && initialData) {
      // Dispatch Edit action
      dispatch(
        updateCallResult({
          id: initialData.id,
          callResultData: { name: data.name, description: data.description, is_active: data.is_active },
        }),
      );
    }
    reset(); // Clear the form
    closeButton.click();
  };

  return (
    <div className="modal fade" id="add_edit_call_status_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add" ? "Add New Call Status" : "Edit Call Status"}
            </h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close_btn_add_edit_call_status_modal"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              {/* Call Result Name */}
              <div className="mb-3">
                <label className="col-form-label">
                  Call Result Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  {...register("name", {
                    required: "Call result name is required.",
                    minLength: {
                      value: 3,
                      message: "Call result name must be at least 3 characters.",
                    },
                  })}
                />
                {errors.name && (
                  <small className="text-danger">{errors.name.message}</small>
                )}
              </div>

              {/* Call Result Description */}
              <div className="mb-3">
                <label className="col-form-label">
                  Description
                </label>
                <textarea
                  type="text"
                  rows="4"
                  className={`form-control ${errors.description ? "is-invalid" : ""}`}
                  {...register("description", {
                  })}
                />
                {errors.name && (
                  <small className="text-danger">{errors.description.message}</small>
                )}
              </div>

              {/* Status */}
              <div className="mb-0">
                <label className="col-form-label">Status</label>
                <div className="d-flex align-items-center">
                  <div className="me-2">
                    <input
                      type="radio"
                      className="status-radio"
                      id="active"
                      value="Y"
                      {...register("is_active", {
                        required: "Status is required.",
                      })}
                    />
                    <label htmlFor="active">Active</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      className="status-radio"
                      id="inactive"
                      value="N"
                      {...register("is_active")}
                    />
                    <label htmlFor="inactive">Inactive</label>
                  </div>
                </div>
                {errors.status && (
                  <small className="text-danger">{errors.status.message}</small>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <div className="d-flex align-items-center justify-content-end m-0">
                <Link
                  to="#"
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </Link>
                <button
                  disabled={loading}
                  type="submit"
                  className="btn btn-primary"
                >
                  {loading
                    ? mode === "add"
                      ? "Creating..."
                      : "Updating..."
                    : mode === "add"
                      ? "Create"
                      : "Update"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditModal;
