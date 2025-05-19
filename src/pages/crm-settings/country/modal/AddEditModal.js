import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addCountry, updateCountry } from "../../../../redux/country"; // Adjust as per your redux actions
import { Link } from "react-router-dom";

const AddEditModal = ({ mode = "add", initialData = null }) => {
  const { loading } = useSelector((state) => state);

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
        code: initialData.code || "",
        is_active: initialData.is_active,
      });
    } else {
      reset({
        name: "",
        code:"",
        is_active: "Y",
      });
    }
  }, [mode, initialData, reset]);

  const onSubmit = (data) => {
    const closeButton = document.getElementById(
      "close_btn_add_edit_lost_reason_modal",
    );
    if (mode === "add") {
      // Dispatch Add action
      dispatch(
        addCountry({
          name: data.name,
          code: data.code,
          is_active: data.is_active,
        }),
      );
    } else if (mode === "edit" && initialData) {
      // Dispatch Edit action
      dispatch(
        updateCountry({
          id: initialData.id,
          countryData: { name: data.name,code: data.code, is_active: data.is_active },
        }),
      );
    }
    reset(); // Clear the form
    closeButton.click();
  };

  return (
    <div className="modal fade" id="add_edit_country_modal"
      role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add" ? "Add New Country" : "Edit Country"}
            </h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close_btn_add_edit_lost_reason_modal"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              {/* Lost Reason Name */}
              <div className="mb-3">
                <label className="col-form-label">
                  Country Code <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.code ? "is-invalid" : ""}`}
                  {...register("code", {
                    required: "Country Code is required.",
                    minLength: {
                      value: 2,
                      message: "Country Code must be at least 2 characters.",
                    },
                    maxLength: {
                      value: 4,
                      message: "Country Code must be at most 3 characters.",
                    },
                  })}
                />
                {errors.reason && (
                  <small className="text-danger">{errors.code.message}</small>
                )}
              </div>
              <div className="mb-3">
                <label className="col-form-label">
                  Country  <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  {...register("name", {
                    required: "Lost reason is required.",
                    minLength: {
                      value: 3,
                      message: "Lost reason must be at least 3 characters.",
                    },
                  })}
                />
                {errors.reason && (
                  <small className="text-danger">{errors.name.message}</small>
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
                {errors.is_active && (
                  <small className="text-danger">{errors.is_active.message}</small>
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
