import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { Link } from "react-router-dom";
import { addModules, updateModules } from "../../../../redux/Modules";
import { ModuleOptions } from "../../../../components/common/selectoption/selectoption";

const AddEditModal = ({ mode = "add", initialData = null }) => {
  const { loading } = useSelector((state) => state.currency || {});
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  const dispatch = useDispatch();

  // Prefill form in edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        module_name: initialData.module_name || "",
        module_path: initialData.module_path || "",
        description: initialData.description || "",
        is_active: initialData.is_active || "Y",
      });
    } else {
      reset({
        module_name: "",
        description: "",
        module_path: "",
        is_active: "Y",
      });
    }
  }, [mode, initialData, reset]);

  const onSubmit = (data) => {
    const closeButton = document.getElementById("close_btn_module_modal");

    if (mode === "add") {
      dispatch(
        addModules({
          module_name: data.module_name,
          module_path: data.module_path,
          description: data.description,
          is_active: data.is_active,
        })
      );
    } else if (mode === "edit" && initialData) {
      dispatch(
        updateModules({
          id: initialData.id,
          moduleData: {
            module_name: data.module_name,
            module_path: data.module_path,
            description: data.description,
            is_active: data.is_active,
          },
        })
      );
    }

    reset(); // Clear the form
    closeButton.click();
  };
  const handleSelect = (selectedOption) => {
    setValue("module_path", selectedOption.path); // Set the module_path value based on the selected option
    setValue("module_name", selectedOption.label); // Set the module_name value based on the selected option
  };
  return (
    <div className="modal fade" id="add_edit_module_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add" ? "Add New Module" : "Edit Module"}
            </h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close_btn_module_modal"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              {/* Module Name */}
              <div className="mb-3">
                <label className="col-form-label">
                  Module Name <span className="text-danger">*</span>
                </label>
              </div>
              <Controller
                name="module_name"
                control={control}
                rules={{ required: "Module name is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={ModuleOptions}
                    classNamePrefix="react-select"
                    placeholder="Select Modules"
                    onChange={handleSelect}
                    value={
                      ModuleOptions.find(
                        (option) => option.label === watch("module_name")
                      ) || null
                    }
                  />
                )}
              />
              {errors.module_name && (
                <small className="text-danger">
                  {errors.module_name.message}
                </small>
              )}
              {/* Description */}
              <div className="mb-3">
                <label className="col-form-label">
                  Description <span className="text-danger">*</span>
                </label>
                <textarea
                  type="text"
                  rows="4"
                  className={`form-control ${errors.descpiption ? "is-invalid" : ""}`}
                  {...register("description", {})}
                />
                {errors.name && (
                  <small className="text-danger">
                    {errors?.description?.message}
                  </small>
                )}
              </div>

              {/* Status */}
              <div className="me-4">
                <label className="col-form-label">Status</label>
                <div className="d-flex align-items-center">
                  <div className="me-3">
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
