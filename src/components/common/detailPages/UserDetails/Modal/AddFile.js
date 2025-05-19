import React, { memo, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
// import { fetchLeads } from "../../../redux/leads";
import {
  addAttachment,
  updateAttachment,
} from "../../../../../redux/attachment";

const AddFiles = ({ data, setData, type, type_id ,type_name }) => {
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState();
  const fileInputRef = useRef(null); 
  const {
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      related_entity_type: type,
      related_entity_id: type_id,
      related_entity_name: type_name,
      filename: "",
      description: "",
      file_type: "",
      file: "",
    },
  });
  React.useEffect(() => {
    if (data) {
      setSelectedFile(data?.file);
      reset({
        related_entity_type: data?.related_entity_type || type,
        related_entity_id: data?.related_entity_id || type_id,
        related_entity_name: data?.related_entity_name || type_name,
        filename: data?.filename || "",
        description: data?.description || "",
        file_type: data?.file_type || "",
        file: data?.file || "",
      });
    } else {
      reset({
        related_entity_type: type,
        related_entity_id: type_id,
        related_entity_name: type_name,
        filename: "",
        description: "",
        file_type: "",
        file: "",
      });
    }
  }, [data]);


 const { loading } = useSelector((state) => state?.attachments);

  const onSubmit = async (datas) => {
    console.log("Submitted Data :", datas)
    const closeButton = document.getElementById("offcanvas_add_files_close");
    const formData = new FormData();
    Object.keys(datas).forEach((key) => {
      if (datas[key] !== null && key !== "file") {
        formData.append(key, datas[key]);
      }
    });

    if (selectedFile) {
      formData.append("file", selectedFile);
    }
    if (data?.id) {
      formData.append("id", Number(data?.id));
    }
    console.log("data?.id : ", datas?.related_entity_name);
    try {
      await dispatch(
        data ? updateAttachment(formData) : addAttachment(formData)
      ).unwrap();
      reset();
      closeButton.click();
      setData(null);
    } catch (error) {
      closeButton.click();
    }
  };
  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setSelectedFile(null);
  };
  useEffect(() => {
    const offcanvasElement = document.getElementById("new_file");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setData(null);
        resetFileInput()
      };
      offcanvasElement.addEventListener(
        "hidden.bs.modal",
        handleModalClose
      );
      return () => {
        offcanvasElement.removeEventListener(
          "hidden.bs.modal",
          handleModalClose
        );
      };
    }
  }, []);
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
      
    if (file) {
      const maxSize = 5 * 1024 * 1024; // 15MB in bytes
      setSelectedFile(file);
      if (file.size > maxSize) {
        alert("File size exceeds 5 MB. Please select a smaller file.");
        return;
      }
    }
  };
  return (
    <div
      className="modal custom-modal fade custom-modal-two modal-padding"
      id="new_file"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered modal-md">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Upload New File</h5>
            <button
              type="button"
              id="offcanvas_add_files_close"
              className="btn-close position-static"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="add-info-fieldset">
              <div className="add-details-wizard">
                <ul className="progress-bar-wizard">
                  <li className="active">
                    <span>
                      <i className="ti ti-file" />
                    </span>
                    <div className="multi-step-info">
                      <h6>Basic Info</h6>
                    </div>
                  </li>
                  {/* <li>
                  <span>
                    <i className="ti ti-circle-plus" />
                  </span>
                  <div className="multi-step-info">
                    <h6>Add Recipient</h6>
                  </div>
                </li> */}
                </ul>
              </div>
              <fieldset id="first-field-file">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="contact-input-set">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="col-form-label">
                            Document Type <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            {...register("file_type", {
                              required: "Title is required",
                            })}
                          />
                          {errors.file_type && (
                            <small className="text-danger">
                              {errors.file_type.message}
                            </small>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="col-form-label">
                            Document Title{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            {...register("filename", {
                              required: "Title is required",
                            })}
                          />
                          {errors.filename && (
                            <small className="text-danger">
                              {errors.filename.message}
                            </small>
                          )}
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="col-form-label">
                            Upload attachment{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="file"
                            className="form-control"
                            onChange={handleAvatarChange}
                            ref={fileInputRef}
                            // value={selectedFile}
                          />
                          {( selectedFile?.size > 5 * 1024 * 1024 ) && (
                            <small className="text-danger">
                              {!selectedFile ? "Attachment file required." : "File size exceeds 5MB. Please select a smaller file."}
                            </small>
                          )}
                          {/* <div className="upload-content border p-1 ">
                            <div className="upload-btn">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                              /> */}
                          {/* <span>
                      <i className="ti ti-file-broken" />
                      Upload File
                    </span> */}
                          {/* </div> */}
                          {/* <p>JPG, GIF, or PNG. Max size of 800K</p> */}
                          {/* </div> */}
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="col-form-label">Description</label>

                          <textarea
                            className="form-control"
                            rows={5}
                            placeholder="Add Content"
                            {...register("description")}
                          />
                        </div>
                      </div>
                      <div className="col-lg-12 text-end form-wizard-button modal-btn">
                        <button
                          type="button"
                          id="offcanvas_add_files_close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                          className="btn btn-light"
                        >
                          Cancel
                        </button>
                        <button
                          className="btn btn-primary wizard-next-btn"
                          type={loading ? "button" : "submit"}
                          disabled={selectedFile && selectedFile.size > 5 * 1024 * 1024}
                        >
                          {data
                            ? loading
                              ? "Updating..."
                              : "Update"
                            : loading
                              ? "Uploading..."
                              : "Upload"}
                              {loading  && <div
                              style={{
                                height: "15px",
                                width: "15px",
                              }}
                              className="spinner-border ml-3 text-light"
                              role="status"
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default memo(AddFiles);
