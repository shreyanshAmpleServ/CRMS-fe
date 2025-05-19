import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";

import { updateLead } from "../../../redux/leads";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { fetchLostReasons } from "../../../redux/lostReasons";
import { fetchIndustries } from "../../../redux/industry";
import { fetchSources } from "../../../redux/source";
import { fetchUsers } from "../../../redux/manage-user";

const EditLeadModal = ({ lead }) => {
  const dispatch = useDispatch();

  const [selectedLogo, setSelectedLogo] = useState(null);
  const { lostReasons } = useSelector((state) => state.lostReasons);
  const { sources } = useSelector((state) => state.sources);
  const { industries } = useSelector((state) => state.industries);
  const { users } = useSelector((state) => state.users);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedLogo(file);
    }
  };
  React.useEffect(() => {
    dispatch(fetchLostReasons());
    dispatch(fetchIndustries());
    dispatch(fetchSources());
    dispatch(fetchUsers());
  }, [dispatch]);
  const lostReasonsList = lostReasons.map((emnt) => ({
    value: emnt.id,
    label: emnt.name,
  }));
  const sourceList = sources.map((emnt) => ({
    value: emnt.id,
    label: emnt.name,
  }));
  const industriesList = industries.map((emnt) => ({
    value: emnt.id,
    label: emnt.name,
  }));
  const usersList = users?.data?.map((emnt) => ({
    value: emnt.id,
    label: emnt.full_name,
  }));

  const countries = [
    { value: "Choose", label: "Choose" },
    { value: "India", label: "India" },
    { value: "USA", label: "USA" },
    { value: "France", label: "France" },
    { value: "UAE", label: "UAE" },
  ];

  // Initialize React Hook Form
  const {
    control,
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      lead_owner: null,
      company_icon: null, // This will handle the image (Bytes)
      company_name: "",
      first_name: "",
      last_name: "",
      title: "",
      email: "",
      phone: "",
      fax: "",
      mobile: "",
      website: "",
      lead_source: null,
      lead_status: null,
      industry: null,
      no_of_employees: null,
      annual_revenue: null,
      revenue_currency: "",
      rating: "",
      tags: "",
      email_opt_out: "N", // Default to 'N' as per schema
      secondary_email: "",
      facebook_ac: "",
      skype_id: "",
      twitter_ac: "",
      linked_in_ac: "",
      whatsapp_ac: "",
      instagram_ac: "",
      street: "",
      city: "",
      state: "",
      zipcode: "",
      country: "",
      description: "",
      is_active: "Y", // Default to 'Y' as per schema
    },
  });
  useEffect(() => {
    if (lead) {
      Object.keys(lead).forEach((key) => {
        setValue(key, lead[key]);
      });
    }
  }, [lead, setValue]);
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.leads);
  // Submit Handler
  const onSubmit = async (data) => {
    const closeButton = document.getElementById("offcanvas_edit_lead_close");
    const formData = new FormData();

    // Append all form fields to FormData
    Object.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined) {
        // Append other fields as-is
        formData.append(key, data[key]);
      }
    });
    if (selectedLogo) {
      formData.append("company_icon", selectedLogo);
    }
    try {
      await dispatch(updateLead({ id: lead.id, leadData: formData })).unwrap();
      closeButton.click();
    } catch (error) {
      closeButton.click();
    }
  };
  return (
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="offcanvas_edit_lead"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="fw-semibold"> Update Call</h5>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
          data-bs-dismiss="offcanvas"
          id="offcanvas_edit_lead_close"
          aria-label="Close"
        >
          <i className="ti ti-x" />
        </button>
      </div>
      <div className="offcanvas-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="hidden"
            {...register("entityType", { value: "lead-company" })}
          />
          <div className="accordion" id="main_accordion">
            {/* Basic Info */}
            <div className="accordion-item rounded mb-3">
              <div className="accordion-header">
                <Link
                  to="#"
                  className="accordion-button accordion-custom-button bg-white rounded fw-medium text-dark"
                  data-bs-toggle="collapse"
                  data-bs-target="#basic"
                >
                  <span className="avatar avatar-md rounded text-dark border me-2">
                    <i className="ti ti-user-plus fs-20" />
                  </span>
                  Basic Info
                </Link>
              </div>
              <div
                className="accordion-collapse collapse show"
                id="basic"
                data-bs-parent="#main_accordion"
              >
                <div className="accordion-body border-top">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <div className="profile-upload">
                          <div className="profile-upload-img">
                            <span>
                              <i className="ti ti-photo" />
                            </span>
                            {selectedLogo && (
                              <img
                                src={URL.createObjectURL(selectedLogo)}
                                alt="Company Logo"
                                className="preview"
                              />
                            )}
                            <button
                              type="button"
                              className={`profile-remove `}
                              style={{
                                position: "absolute",
                                display: selectedLogo ? "block" : "none",
                                border: "none",
                                top: "-10px",
                                right: "-13px",
                              }}
                              onClick={() => setSelectedLogo(null)}
                            >
                              <i className="ti ti-x" />
                            </button>
                          </div>
                          <div className="profile-upload-content">
                            <label className="profile-upload-btn">
                              <i className="ti ti-file-broken" /> Upload File
                              <input
                                type="file"
                                className="input-img"
                                accept="image/*"
                                onChange={handleLogoChange}
                              />
                            </label>
                            <p>JPG, GIF or PNG. Max size of 800K</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          First Name <span className="text-danger">*</span>
                        </label>

                        <input
                          type="text"
                          className="form-control"
                          {...register("first_name", {
                            required: "First name is required",
                          })}
                        />
                        {errors.first_name && (
                          <small className="text-danger">
                            {errors.first_name.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Last Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("last_name", {
                            required: "Last name is required",
                          })}
                        />
                        {errors.last_name && (
                          <small className="text-danger">
                            {errors.last_name.message}
                          </small>
                        )}
                      </div>
                    </div>

                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Company Name
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("company_name", {
                            required: "Company name is required",
                          })}
                        />
                        {errors.company_name && (
                          <small className="text-danger">
                            {errors.company_name.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">Title</label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("title")}
                        />
                        {errors.title && (
                          <small className="text-danger">
                            {errors.title.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <label className="col-form-label">
                            Email <span className="text-danger">*</span>
                          </label>
                          <div className="status-toggle small-toggle-btn d-flex align-items-center">
                            <span className="me-2 label-text">
                              Email Opt Out
                            </span>
                            <Controller
                              name="email_opt_out"
                              control={control}
                              render={({ field }) => (
                                <>
                                  <input
                                    type="checkbox"
                                    id="emailOptOut" // Add the ID here
                                    className="check"
                                    {...field}
                                    checked={field.value}
                                  />
                                  <label
                                    htmlFor="emailOptOut" // Ensure this matches the input ID
                                    className="checktoggle"
                                  >
                                    Email Opt-Out
                                  </label>
                                </>
                              )}
                            />
                          </div>
                        </div>
                        <input
                          type="email"
                          className="form-control"
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: "Invalid email format",
                            },
                          })}
                        />
                        {errors.email && (
                          <small className="text-danger">
                            {errors.email.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Secondry Email <span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          {...register("secondary_email", {
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: "Invalid email format",
                            },
                          })}
                        />
                        {errors.secondary_email && (
                          <small className="text-danger">
                            {errors.secondary_email.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Phone <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("phone", {
                            required: "Phone is required",
                          })}
                        />
                        {errors.phone && (
                          <small className="text-danger">
                            {errors.phone.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">Mobile</label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("mobile")}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">Fax</label>

                        <input
                          type="text"
                          className="form-control"
                          {...register("mobile")}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">Website</label>

                        <input
                          type="text"
                          className="form-control"
                          {...register("website")}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Source <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="lead_source"
                          rules={{ required: "Source is required!" }} // Make the field required
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={sourceList}
                              placeholder="Choose"
                              className="select2"
                              classNamePrefix="react-select"
                              onChange={(selectedOption) =>
                                field.onChange(selectedOption?.value || null)
                              } // Send only value
                              value={sourceList?.find(
                                (option) =>
                                  option.value === watch("lead_source"),
                              )}
                            />
                          )}
                        />
                        {errors.lead_source && (
                          <small className="text-danger">
                            {errors.lead_source.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Industry <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="industry"
                          rules={{ required: "Industry is required!" }} // Make the field required
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={industriesList}
                              placeholder="Choose"
                              className="select2"
                              classNamePrefix="react-select"
                              onChange={(selectedOption) =>
                                field.onChange(selectedOption?.value || null)
                              } // Send only value
                              value={industriesList?.find(
                                (option) => option.value === watch("industry"),
                              )}
                            />
                          )}
                        />
                        {errors.industry && (
                          <small className="text-danger">
                            {errors.industry.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Lead status <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="lead_status"
                          rules={{ required: "Lead status is required!" }}
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={lostReasonsList}
                              placeholder="Choose"
                              className="select"
                              classNamePrefix="react-select"
                              onChange={(selectedOption) =>
                                field.onChange(selectedOption?.value || null)
                              } // Send only value
                              value={lostReasonsList?.find(
                                (option) =>
                                  option.value === watch("lead_status"),
                              )}
                            />
                          )}
                        />
                        {errors.lead_status && (
                          <small className="text-danger">
                            {errors.lead_status.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Owner <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="lead_owner"
                          rules={{ required: "Owner is required!" }}
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={usersList}
                              placeholder="Choose"
                              className="select"
                              classNamePrefix="react-select"
                              onChange={(selectedOption) =>
                                field.onChange(selectedOption?.value || null)
                              } // Send only value
                              value={usersList?.find(
                                (option) =>
                                  option.value === watch("lead_owner"),
                              )}
                            />
                          )}
                        />
                        {errors.lead_owner && (
                          <small className="text-danger">
                            {errors.lead_owner.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">Tags </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("tags")}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          No of Employees
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          {...register("no_of_employees", {
                            required: " No of Employees is required",
                          })}
                        />
                        {errors.no_of_employees && (
                          <small className="text-danger">
                            {errors.no_of_employees.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Annual Revenue
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          {...register("annual_revenue", {
                            required: "Annual revenue is required",
                          })}
                        />
                        {errors.annual_revenue && (
                          <small className="text-danger">
                            {errors.annual_revenue.message}
                          </small>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Currency <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("revenue_currency", {
                            required: "Currency is required",
                          })}
                        />
                        {errors.revenue_currency && (
                          <small className="text-danger">
                            {errors.revenue_currency.message}
                          </small>
                        )}
                      </div>
                    </div>

                    <div className="col-md-12">
                      <div className="mb-0">
                        <label className="col-form-label">Description</label>
                        <textarea
                          className="form-control"
                          rows={5}
                          {...register("description", {
                            required: "Description is required",
                          })}
                        />
                        {errors.language && (
                          <small className="text-danger">
                            {errors.language.message}
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Basic Info */}
            {/* /Address Info */}
            <div className="accordion-item border-top rounded mb-3">
              <div className="accordion-header">
                <Link
                  to="#"
                  className="accordion-button accordion-custom-button rounded bg-white fw-medium text-dark"
                  data-bs-toggle="collapse"
                  data-bs-target="#address"
                >
                  <span className="avatar avatar-md rounded text-dark border me-2">
                    <i className="ti ti-map-pin-cog fs-20" />
                  </span>
                  Address Info
                </Link>
              </div>
              <div
                className="accordion-collapse collapse"
                id="address"
                data-bs-parent="#main_accordion"
              >
                <div className="accordion-body border-top">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Street Address{" "}
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("street", {
                            required: "Street address is required",
                          })}
                        />
                        {errors.street && (
                          <small className="text-danger">
                            {errors.street.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">City </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("city", {
                            required: "City is required",
                          })}
                        />
                        {errors.city && (
                          <small className="text-danger">
                            {errors.city.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          State / Province{" "}
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("state", {
                            required: "State is required",
                          })}
                        />
                        {errors.state && (
                          <small className="text-danger">
                            {errors.state.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3 mb-md-0">
                        <label className="col-form-label">Country</label>
                        <Controller
                          name="country"
                          control={control}
                          rules={{ required: "Country is required" }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              className="select"
                              classNamePrefix="react-select"
                              options={countries}
                              placeholder="Choose"
                              onChange={(selectedOption) =>
                                field.onChange(selectedOption?.value || null)
                              } // Send only value
                              value={countries?.find(
                                (option) => option.value === field.value,
                              )}
                            />
                          )}
                        />
                        {errors.country && (
                          <small className="text-danger">
                            {errors.country.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-0">
                        <label className="col-form-label">Zipcode </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("zipcode", {
                            required: "Zipcode is required",
                          })}
                        />
                        {errors.zipcode && (
                          <small className="text-danger">
                            {errors.zipcode.message}
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Address Info */}
            {/* Social Profile */}
            <div className="accordion-item border-top rounded mb-3">
              <div className="accordion-header">
                <Link
                  to="#"
                  className="accordion-button accordion-custom-button rounded bg-white fw-medium text-dark"
                  data-bs-toggle="collapse"
                  data-bs-target="#social"
                >
                  <span className="avatar avatar-md rounded text-dark border me-2">
                    <i className="ti ti-social fs-20" />
                  </span>
                  Social Profile
                </Link>
              </div>
              <div
                className="accordion-collapse collapse"
                id="social"
                data-bs-parent="#main_accordion"
              >
                <div className="accordion-body border-top">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">Facebook</label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("facebook_ac")}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">Skype </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("skype_id")}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">Linkedin </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("linked_in_ac")}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">Twitter</label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("twitter_ac")}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3 mb-md-0">
                        <label className="col-form-label">Whatsapp</label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("whatsapp_ac")}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-0">
                        <label className="col-form-label">Instagram</label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("instagram_ac")}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Social Profile */}` {/* Access */}
            <div className="accordion-item border-top rounded mb-3">
              <div className="accordion-header">
                <Link
                  to="#"
                  className="accordion-button accordion-custom-button rounded bg-white fw-medium text-dark"
                  data-bs-toggle="collapse"
                  data-bs-target="#access-info"
                >
                  <span className="avatar avatar-md rounded text-dark border me-2">
                    <i className="ti ti-accessible fs-20" />
                  </span>
                  Access
                </Link>
              </div>
              <div
                className="accordion-collapse collapse"
                id="access-info"
                data-bs-parent="#main_accordion"
              >
                <div className="accordion-body border-top">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="col-form-label">Status</label>
                        <div className="d-flex flex-wrap">
                          <div className="me-2">
                            <input
                              type="radio"
                              className="status-radio"
                              id="active"
                              value="Y"
                              defaultChecked
                              {...register("is_active")}
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
                  </div>
                </div>
              </div>
            </div>
            {/* /Access */}`
          </div>
          <div className="d-flex align-items-center justify-content-end">
            <button
              type="button"
              data-bs-dismiss="offcanvas"
              className="btn btn-light me-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Updateing..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default EditLeadModal;
