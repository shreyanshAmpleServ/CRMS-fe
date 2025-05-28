import React, { memo, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addAttachment, updateAttachment } from "../../../redux/attachment";
import { DocumentRelatedType } from "../../../components/common/selectoption/selectoption";
import Select from "react-select";
import { fetchDeals } from "../../../redux/deals";
import { fetchCompanies } from "../../../redux/companies";
import { fetchVendors } from "../../../redux/vendor";
import { fetchContacts } from "../../../redux/contacts/contactSlice";
import { fetchLeads } from "../../../redux/leads";
import { fetchUsers } from "../../../redux/manage-user";
import { fetchProjects } from "../../../redux/projects";
import { fetchorders } from "../../../redux/order";
// import { fetchLeads } from "../../../redux/leads";

const AddFiles = ({ data, setData }) => {
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState();
  const fileInputRef = useRef(null);

  const {
    handleSubmit,
    register,
    control,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      related_entity_type: "",
      related_entity_id: null,
      related_entity_name: "",
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
        related_entity_type: data?.related_entity_type || "",
        related_entity_id: data?.related_entity_id || null,
        related_entity_name: data?.related_entity_name || "",
        filename: data?.filename || "",
        description: data?.description || "",
        file_type: data?.file_type || "",
        file: data?.file || "",
      });
    } else {
      reset({
        related_entity_type: "",
        related_entity_name: "",
        related_entity_id: null,
        filename: "",
        description: "",
        file_type: "",
        file: "",
      });
    }
  }, [data]);
  let related_type = watch("related_entity_type");
  const { loading } = useSelector((state) => state?.attachments);

  useEffect(() => {
    related_type === "Deals" && dispatch(fetchDeals());
    related_type === "Companies" && dispatch(fetchCompanies());
    related_type === "Vendor" && dispatch(fetchVendors());
    related_type === "Contacts" && dispatch(fetchContacts(""));
    related_type === "Leads" && dispatch(fetchLeads());
    related_type === "User" && dispatch(fetchUsers());
    related_type === "Projects" && dispatch(fetchProjects());
    related_type === "Orders" && dispatch(fetchorders());
  }, [related_type]);

  const { deals  ,loading:loadingDeals } = useSelector((state) => state?.deals);
  const { companies ,loading:loadingComp } = useSelector((state) => state?.companies);
  const { vendor ,loading:loadingVendor } = useSelector((state) => state?.vendor);
  const { contacts ,loading:loadingContacts } = useSelector((state) => state?.contacts);
  const { leads ,loading:loadingLeads } = useSelector((state) => state?.leads);
  const { users ,loading:loadingUser } = useSelector((state) => state?.users);
  const { projects ,loading:loadingProject } = useSelector((state) => state?.projects);
  const { orders ,loading:loadingOrder } = useSelector((state) => state?.orders);

  let isLoading = loadingDeals ||loadingComp ||loadingVendor ||loadingContacts ||loadingLeads ||loadingUser ||loadingProject ||loadingOrder

  const dealsList = deals?.data?.map((i) => ({ label: i?.dealName, value: i?.id }));
  const contactsList = contacts?.data?.map((i) => ({
    label: i?.firstName + " " + i?.lastName,
    value: i?.id,
  }));
  const leadsList = leads?.data?.map((i) => ({
    label: i?.first_name + " " + i?.last_name,
    value: i?.id,
  }));
  const projectsList = projects?.data?.map((i) => ({ label: i?.name, value: i?.id }));
  const vendorList = vendor?.data?.map((i) => ({ label: i?.name, value: i?.id }));
  const userList = users?.data?.map((i) => ({ label: i?.full_name, value: i?.id }));
  const companiesList = companies?.data?.map((i) => ({
    label: i?.name,
    value: i?.id,
  }));
  const ordersList = orders?.data?.map((i) => ({
    label: i?.order_code,
    value: i?.id,
  }));

  let related_options =
    related_type === "Contacts"
      ? contactsList
      : related_type === "Deals"
        ? dealsList
        : related_type === "Companies"
          ? companiesList
          : related_type === "Projects"
            ? projectsList
            : related_type === "User"
              ? userList
              : related_type === "Leads"
                ? leadsList
                : related_type === "Orders"
                  ? ordersList
                  : vendorList;

  const onSubmit = async (datas) => {
    const closeButton = document.getElementById(
      "close_offcanvas_edit_documents"
    );
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
    const offcanvasElement = document.getElementById("offcanvas_add_documents");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setData(null);
        resetFileInput();
      };
      offcanvasElement.addEventListener(
        "hidden.bs.offcanvas",
        handleModalClose
      );
      return () => {
        offcanvasElement.removeEventListener(
          "hidden.bs.offcanvas",
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
      className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="offcanvas_add_documents"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="fw-semibold">Add Document</h5>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
          data-bs-dismiss="offcanvas"
          id="close_offcanvas_edit_documents"
          aria-label="Close"
        >
          <i className="ti ti-x" />
        </button>
      </div>
      <div className="offcanvas-body">
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
                          Related Type <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="related_entity_type"
                          rules={{ required: "Related Type is required" }}
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={DocumentRelatedType}
                              placeholder="Choose"
                              classNamePrefix="react-select"
                              value={
                                DocumentRelatedType?.find(
                                  (i) =>
                                    i?.value === watch("related_entity_type")
                                ) || " "
                              }
                              onChange={(selectedOption) => {
                                field.onChange(selectedOption?.value || null);
                                setValue("related_entity_id", null);
                                setValue("related_entity_name", "");
                              }}
                            />
                          )}
                        />
                        {errors.related_entity_type && (
                          <small className="text-danger">
                            {errors.related_entity_type.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          {" "}
                          Related To<span className="text-danger">*</span>
                        </label>
                        <Controller
                          name={"related_entity_id"}
                          rules={{ required: "Related  To is required!" }}
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              placeholder="Choose"
                              classNamePrefix="react-select"
                              options={related_options}
                              isLoading={isLoading}
                              // getOptionLabel={(option) => option.related_entity_name} // Ensure label is from related_entity_name
                              // getOptionValue={(option) => option.related_entity_id}
                              onChange={(selectedOption) => {
                                field.onChange(selectedOption?.value || null);
                                setValue(
                                  "related_entity_name",
                                  selectedOption?.label || ""
                                );
                              }}
                              value={
                                related_options?.find(
                                  (option) =>
                                    option.value === watch("related_entity_id")
                                ) || ""
                              }
                              isSearchable
                              styles={{
                                borderLeftRadius: "0px",
                                borderBottomLeftRadius: "0px",
                              }}
                            />
                          )}
                        />

                        {errors.related_entity_id && (
                          <small className="text-danger">
                            {errors.related_entity_id.message}
                          </small>
                        )}
                      </div>
                    </div>
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
                          Document Title <span className="text-danger">*</span>
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
                        {selectedFile?.size > 5 * 1024 * 1024 && (
                          <small className="text-danger">
                            {!selectedFile
                              ? "Attachment file required."
                              : "File size exceeds 5MB. Please select a smaller file."}
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
                        data-bs-dismiss="offcanvas"
                        className="btn btn-light"
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-primary wizard-next-btn"
                        type={loading ? "button" : "submit"}
                        disabled={
                          selectedFile && selectedFile.size > 5 * 1024 * 1024
                        }
                      >
                        {data
                          ? loading
                            ? "Updating..."
                            : "Update"
                          : loading
                            ? "Creating..."
                            : "Create"}
                        {loading && (
                          <div
                            style={{
                              height: "15px",
                              width: "15px",
                            }}
                            className="spinner-border ml-3 text-light"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        )}
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
  );
};
export default memo(AddFiles);
