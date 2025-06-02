import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Select from "react-select";
// import {
//     setCampaignTogglePopup,
//     setCampaignTogglePopupTwo,
// } from "../data/redux/commonSlice";
import { TimePicker } from "antd";
import DefaultEditor from "react-simple-wysiwyg";
// import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import ImageWithBasePath from "../../../components/common/imageWithBasePath";
import {
  addActivities,
  deleteActivities,
  fetchActivityTypes,
  updateActivities,
} from "../../../redux/Activities";
import { fetchCompanies } from "../../../redux/companies";
import { fetchContacts } from "../../../redux/contacts/contactSlice";
import { fetchDeals } from "../../../redux/deals";
import { fetchUsers } from "../../../redux/manage-user";
import { fetchProjects } from "../../../redux/projects";
import { CampaignStatusOptions, CampaignTypeOptions, StatusOptions } from "../../../components/common/selectoption/selectoption";
import { fetchLeads } from "../../../redux/leads";
import { createCampaign, updateCampaign } from "../../../redux/campaign";



const ActivitiesModal = ({ setCampaign, campaign }) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedType, setSelectedType] = useState();
  const dispatch = useDispatch();
  dayjs.extend(customParseFormat);
  const {
    control,
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      status:"",
      type: "",
      start_date: new Date(),
      end_date: new Date(),
      exp_revenue: "",
      camp_cost: "",
      owner_id: null,
      description: "",
      lead_ids: [],
      contact_ids: [],
      is_active:"Y"
    },
  });

  React.useEffect(
    () => {
      if (campaign) {
        reset({
          name: campaign?.name || "",
          status: campaign?.status || "",
          type: campaign?.type || null,
          start_date: campaign?.start_date || new Date(),
          end_date: campaign?.end_date || new Date(),
          exp_revenue: campaign?.exp_revenue || "",
          camp_cost: campaign?.camp_cost || "",
          owner_id: campaign?.owner_id || null,
          description: campaign?.description || "",
          lead_ids: campaign?.campaign_leads?.map((data)=>({label:data.title,value:data.id})) || [],
          contact_ids: campaign?.campaign_contact?.map((data)=>({label:`${data?.firstName} ${data?.lastName}`,value:data.id})) || [],
          is_active: campaign?.is_active || "Y"
        });
      } else {
        reset({
          name: "",
          status: "",
          type: null,
          start_date: new Date(),
          end_date:new Date(),
          exp_revenue: "",
          camp_cost: "",
          owner_id: null,
          description: "",
          lead_ids: [],
          contact_ids: [],
          is_active : "Y"
        });
        setSelectedType(null);
      }
    },
    [campaign],
    reset
  );
  React.useEffect(() => {
    dispatch(fetchContacts({search:searchValue}));
  }, [dispatch, searchValue]);
  const { loading } = useSelector((state) => state?.activities);
  React.useEffect(() => {
    dispatch(fetchLeads());
    dispatch(fetchUsers());
  }, [dispatch]);

  const { deals } = useSelector((state) => state.deals);
  const { leads } = useSelector((state) => state.leads);
  const { contacts } = useSelector((state) => state.contacts);
  const { users } = useSelector((state) => state.users);

  const onSubmit = async (data) => {
    const finalData = {
      ...data,
      contact_ids: data.contact_ids?.map((contact) => contact.value),
      lead_ids: data.lead_ids?.map((contact) => contact.value),
      start_date: new Date(data.start_date),
      end_date: new Date(data.end_date)
    };
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      campaign
        ? await dispatch(
            updateCampaign({
              id: campaign.id,
              campaignData: finalData
            })
          ).unwrap()
        : await dispatch(createCampaign(finalData)).unwrap();
      closeButton.click();
      reset();
      setCampaign(null);
    } catch (error) {
      closeButton.click();
    }
  };

  const deleteData = () => {
    if (campaign) {
      dispatch(deleteActivities(campaign));
      // navigate(`/crm/activities`); // Navigate to the specified route
      // setShowDeleteModal(false); // Close the modal
      setCampaign(null);
    }
  };
  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setCampaign(null);
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
  return (
    <>
      {/* Add New campaign */}
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_add"
      >
        <div className="offcanvas-header border-bottom">
          <h4>{campaign ? "Update " : "Add New "} Campaign </h4>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => {
              setCampaign(null);
              reset();
            }}
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <div className="offcanvas-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <div className="row">
                      {/* Name */}
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="col-form-label">
                      Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter name"
                      className="form-control"
                      {...register("name", {
                        required: "Name is required",
                      })}
                    />
                  </div>
                  {errors.name && (
                    <small className="text-danger">
                      {errors.name.message}
                    </small>
                  )}
                </div>
                     {/* Campaign Owner */}
               <div className="col-md-6">
                  <div className="mb-3">
                    <label className="col-form-label">
                     Campaign Owner <span className="text-danger">*</span>
                    </label>
                    <Controller
                      name="owner_id"
                      control={control}
                      rules={{ required: "Owner is required" }} // Validation rule
                      render={({ field }) => {
                        const selectedDeal = users?.data?.find(
                          (owner) => owner.id === field.value
                        );
                        return (
                          <Select
                            {...field}
                            className="select"
                            options={users?.data?.map((i) => ({
                              label: i?.full_name,
                              value: i?.id,
                            }))}
                            classNamePrefix="react-select"
                            value={
                              selectedDeal
                                ? {
                                    label: selectedDeal.full_name,
                                    value: selectedDeal.id,
                                  }
                                : null
                            } // Ensure correct default value
                            onChange={(selectedOption) =>
                              field.onChange(selectedOption.value)
                            }
                            styles={{
                              menu: (provided) => ({
                                ...provided,
                                zIndex: 9999, // Ensure this value is higher than the icon's z-index
                              }),
                            }}
                          />
                        );
                      }}
                    />
                    {errors.owner_id && (
                      <small className="text-danger">
                        {errors.owner_id.message}
                      </small>
                    )}
                  </div>
                </div>
                      {/* Start Date  */}
                <div className="col-md-6">
                  <label className="col-form-label">
                    Start Date <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3 icon-form">
                    <span className="form-icon">
                      <i className="ti ti-calendar-check" />
                    </span>
                    <Controller
                      name="start_date"
                      control={control}
                      rules={{ required: "Start date is required!" }}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          className="form-control"
                          selected={field.value}
                          value={
                            field.value
                              ? dayjs(field.value, "dd-MM-yyyy")
                              : null
                          }
                          onChange={field.onChange}
                          dateFormat="dd-MM-yyyy"
                        />
                      )}
                    />
                  </div>
                  {errors.start_date && (
                    <small className="text-danger">
                      {errors.start_date.message}
                    </small>
                  )}
                </div>
                      {/* End Date  */}
                <div className="col-md-6">
                  <label className="col-form-label">
                    End Date <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3 icon-form">
                    <span className="form-icon">
                    <i className="ti ti-calendar-check" />
                    </span>
                    <Controller
                      name="end_date"
                      rules={{ required: "End date is required!" }}
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          placeholder="Select Time"
                          className="form-control"
                          value={
                            field.value ? dayjs(field.value,"dd-MM-yyyy") : null
                          }
                          selected={field.value}
                          onChange={field.onChange}
                          dateFormat="dd-MM-yyyy"
                        />
                      )}
                    />
                    {/* <input type="time" placeholder="Select Time" className="form-control datetimepicker"
                                            {...register("end_date", {
                                                required: "Due Time is required",
                                            })} /> */}
                    {/* <TimePicker
                                             placeholder="Select Time"
                                             className="form-control datetimepicker-time"
                                             onChange={onChange}
                                             defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
                                         /> */}
                  </div>
                  {errors.end_date && (
                    <small className="text-danger">
                      {errors.end_date.message}
                    </small>
                  )}
                </div>
                      {/* Exp Revenue  */}
                <div className="col-md-6">
                    <label className="col-form-label">
                      Expected Revanue <span className="text-danger">*</span>
                    </label>
                    <div className="mb-3 ">
                      <input
                        type="number"
                        placeholder="0.0"
                        className="form-control"
                        {...register("exp_revenue", {
                          // required: "Expected Revenue is required",
                        })}
                      />
                    </div>
                  </div>
                      {/* Campaign Cost  */}
                  <div className="col-md-6">
                    <label className="col-form-label">
                      Campaign Cost <span className="text-danger">*</span>
                    </label>
                    <div className="mb-3 ">
                      <input
                        type="number"
                        placeholder="0.0"
                        className="form-control"
                        {...register("camp_cost", {
                          // required: "Campaign cost is required",
                        })}
                      />
                    </div>
                  </div>
                      {/* Status  */}
                <div className="col-md-6">
                  <label className="col-form-label">
                    Status <span className="text-danger">*</span>
                  </label>
                  <Controller
                      name="status"
                      control={control}
                      rules={{ required: "Status is required" }} // Validation rule
                      render={({ field }) => {
                        const selectedDeal = deals?.data?.find(
                          (deal) => deal.id === field.value
                        );
                        return (
                          <Select
                            {...field}
                            className="select"
                            options={CampaignStatusOptions}
                            classNamePrefix="react-select"
                            value={CampaignStatusOptions?.find(
                              (option) =>
                                option.value === watch("status")) || ""}
                            onChange={(selectedOption) =>
                              field.onChange(selectedOption.value)
                            } // Store only value
                            getOptionLabel={(option) => (
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span
                                  style={{
                                    width: "10px",
                                    height: "10px",
                                    borderRadius: "50%",
                                    backgroundColor: option.color || "black", // Use color property from options
                                    display: "inline-block",
                                  }}
                                />
                                {option.label}
                              </div>
                            )}
                          />
                        );
                      }}
                    />
                  {errors.status && (
                    <small className="text-danger">
                      {errors.status.message}
                    </small>
                  )}
                </div>
                {/* <div className="col-md-12">
                  <div className="status-toggle small-toggle-btn d-flex align-items-center justify-content-end ">
                    <span className="me-2 label-text">Is Reminder</span>
                    <Controller
                      name="is_reminder"
                      control={control}
                      render={({ field }) => (
                        <>
                          <input
                            type="checkbox"
                            id="emailOptOut"
                            className="check"
                            {...field}
                            checked={field.value === "Y"}
                            onChange={(e) =>
                              field.onChange(e.target.checked ? "Y" : "N")
                            }
                          />
                          <label htmlFor="emailOptOut" className="checktoggle">
                            Email Opt-Out
                          </label>
                        </>
                      )}
                    />
                  </div>
                </div> */}
                {/* {isReminder === "Y" && (
                  <div className="col-md-6">
                    <label className="col-form-label">
                      Reminder <span className="text-danger">*</span>
                    </label>
                    <div className="mb-3 icon-form">
                      <span className="form-icon">
                        <i className="ti ti-bell-ringing" />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        {...register("camp_cost", {
                          required: "Reminder is required",
                        })}
                      />
                    </div>
                  </div>
                )}
                {isReminder === "Y" && (
                  <div className="col-md-6">
                    <div className="d-flex align-items-center">
                      <div className="mb-3 w-100">
                        <label className="col-form-label">&nbsp;</label>
                        <Controller
                          name="reminder_time"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              className="select"
                              options={options1}
                              classNamePrefix="react-select"
                              value={options1?.find(
                                (option) => option.value === field.value
                              )} // Ensure default selection
                              onChange={(selectedOption) =>
                                field.onChange(selectedOption.value)
                              } // Store only value
                            />
                          )}
                        />
                      </div>
                      <div className="mb-3 time-text">
                        <label className="col-form-label">&nbsp;</label>
                        <p>Before Due</p>
                      </div>
                    </div>
                  </div>
                )} */}

                      {/* Campaign Type */}
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="col-form-label">
                      Type <span className="text-danger">*</span>
                    </label>
                    <Controller
                      name="type"
                      control={control}
                      rules={{ required: "type is required" }} // Validation rule
                      render={({ field }) => {
                        const selectedDeal = CampaignTypeOptions?.find(
                          (owner) => owner.value === field.value
                        );
                        return (
                          <Select
                            {...field}
                            className="select"
                            options={CampaignTypeOptions?.map((i) => ({
                              label: i?.label,
                              value: i?.value,
                            }))}
                            classNamePrefix="react-select"
                            value={
                              selectedDeal
                                ? {
                                    label: selectedDeal.label,
                                    value: selectedDeal.value,
                                  }
                                : null
                            } 
                            onChange={(selectedOption) =>
                              field.onChange(selectedOption.value)
                            }
                          />
                        );
                      }}
                    />
                    {errors.type && (
                      <small className="text-danger">
                        {errors.type.message}
                      </small>
                    )}
                  </div>
                </div>
                      {/* Leads  */}
                <div className="col-md-12">
                  <div className="mb-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <label className="col-form-label">Leads</label>
                    </div>
                    <Controller
                      name="lead_ids"
                      control={control}
                      rules={{ required: "Deal is required" }} // Validation rule
                      defaultValue={[]} 
                      render={({ field }) => {
                        // const selectedDeal = leads?.data?.find(
                        //   (deal) => deal.id === field.value
                        // );
                        return (
                          <Select
                            {...field}
                            className="select"
                            isMulti
                            options={leads?.data?.map((i) => ({
                              label: i?.title,
                              value: i?.id,
                            }))}
                            classNamePrefix="react-select"
                            // value={
                            //   selectedDeal
                            //     ? {
                            //         label: selectedDeal.name,
                            //         value: selectedDeal.id,
                            //       }
                            //     : null
                            // } // Ensure correct default value
                            // onChange={(selectedOption) =>
                            //   field.onChange(selectedOption.value)
                            // } // Store only value
                          />
                        );
                      }}
                    />
                    {errors.lead_ids && (
                      <small className="text-danger">
                        {errors.lead_ids.message}
                      </small>
                    )}
                  </div>
                </div>
                      {/* Contact  */}
                <div className="col-md-12">
                  <div className="mb-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <label className="col-form-label">Contacts</label>
                    </div>
                    <Controller
                      name="contact_ids"
                      control={control}
                      defaultValue={[]} 
                      rules={{ required: "Contact is required" }} // Validation rule
                      render={({ field }) => {
                        return (
                          <Select
                            {...field}
                            className="select"
                            options={contacts?.data?.map((i) => ({
                              label: `${i?.firstName} ${i?.lastName}`,
                              value: i?.id,
                            }))}
                            isSearchable
                            isMulti
                            onInputChange={(e) => setSearchValue(e)}
                            classNamePrefix="react-select"
                          />
                        );
                      }}
                    />
                    {errors.contact_ids && (
                      <small className="text-danger">
                        {errors.contact_ids.message}
                      </small>
                    )}
                  </div>
                </div>

                  <div className="mb-3">
                    <label className="col-form-label">
                      Description 
                    </label>
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <DefaultEditor
                          className="summernote"
                          {...field}
                          value={field.value || ""}
                          onChange={(content) => field.onChange(content)}
                        />
                      )}
                    />
                    {/* <DefaultEditor className="summernote"  {...register("description", {
                                            required: "Description is required",
                                        })} /> */}
                  </div>
                                {/* Status */}
              <div className="mb-0">
                <label className="col-form-label">Active status</label>
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
            </div>
            <div className="d-flex align-items-center justify-content-end">
              <button
                type="button"
                data-bs-dismiss="offcanvas"
                className="btn btn-light me-2"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {campaign
                  ? loading
                    ? " Updating..."
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
                    className="spinner-border ml-2 text-light"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* /Add New Activity */}
      <>
        {/* Add Contacts */}
        <div
          className="modal custom-modal fade"
          id="add_contacts"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-name">Add Contacts</h5>
                <button
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-2 icon-form">
                    <span className="form-icon">
                      <i className="ti ti-search" />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search"
                    />
                  </div>
                  <div className="access-wrap">
                    <ul>
                      <li className="select-people-checkbox">
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                          <span className="people-profile">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-19.jpg"
                              alt=""
                            />
                            <Link to="#">Darlee Robertson</Link>
                          </span>
                        </label>
                      </li>
                      <li className="select-people-checkbox">
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                          <span className="people-profile">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-20.jpg"
                              alt=""
                            />
                            <Link to="#">Sharon Roy</Link>
                          </span>
                        </label>
                      </li>
                      <li className="select-people-checkbox">
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                          <span className="people-profile">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-21.jpg"
                              alt=""
                            />
                            <Link to="#">Vaughan</Link>
                          </span>
                        </label>
                      </li>
                      <li className="select-people-checkbox">
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                          <span className="people-profile">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-01.jpg"
                              alt=""
                            />
                            <Link to="#">Jessica</Link>
                          </span>
                        </label>
                      </li>
                      <li className="select-people-checkbox">
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                          <span className="people-profile">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-16.jpg"
                              alt=""
                            />
                            <Link to="#">Carol Thomas</Link>
                          </span>
                        </label>
                      </li>
                      <li className="select-people-checkbox">
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                          <span className="people-profile">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-22.jpg"
                              alt=""
                            />
                            <Link to="#">Dawn Mercha</Link>
                          </span>
                        </label>
                      </li>
                    </ul>
                  </div>
                  <div className="modal-btn text-end">
                    <Link
                      to="#"
                      className="btn btn-light"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </Link>
                    <button
                      type="button"
                      data-bs-dismiss="modal"
                      className="btn btn-primary"
                    >
                      Confirm
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* /Add Contacts */}
        {/* Add Deals */}
        <div className="modal custom-modal fade" id="add_deal" role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-name">Add Deals</h5>
                <button
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-2 icon-form">
                    <span className="form-icon">
                      <i className="ti ti-search" />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search"
                    />
                  </div>
                  <div className="access-wrap">
                    <ul>
                      <li className="select-people-checkbox">
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                          <span className="people-profile">
                            <Link to="#">Collins</Link>
                          </span>
                        </label>
                      </li>
                      <li className="select-people-checkbox">
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                          <span className="people-profile">
                            <Link to="#">Konopelski</Link>
                          </span>
                        </label>
                      </li>
                      <li className="select-people-checkbox">
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                          <span className="people-profile">
                            <Link to="#">Adams</Link>
                          </span>
                        </label>
                      </li>
                      <li className="select-people-checkbox">
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                          <span className="people-profile">
                            <Link to="#">Schumm</Link>
                          </span>
                        </label>
                      </li>
                      <li className="select-people-checkbox">
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                          <span className="people-profile">
                            <Link to="#">Wisozk</Link>
                          </span>
                        </label>
                      </li>
                      <li className="select-people-checkbox">
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                          <span className="people-profile">
                            <Link to="#">Dawn Mercha</Link>
                          </span>
                        </label>
                      </li>
                    </ul>
                  </div>
                  <div className="modal-btn text-end">
                    <Link
                      to="#"
                      className="btn btn-light"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </Link>
                    <button
                      type="button"
                      data-bs-dismiss="modal"
                      className="btn btn-primary"
                    >
                      Confirm
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* /Add Deals */}
        {/* Add Company */}
        <div className="modal custom-modal fade" id="add_company" role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-name">Add Company</h5>
                <button
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-2 icon-form">
                    <span className="form-icon">
                      <i className="ti ti-search" />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search"
                    />
                  </div>
                  <div className="access-wrap">
                    <ul>
                      <li className="select-people-checkbox">
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                          <span className="people-profile">
                            <ImageWithBasePath
                              src="assets/img/icons/company-icon-01.svg"
                              alt=""
                            />
                            <Link to="#">NovaWave LLC</Link>
                          </span>
                        </label>
                      </li>
                      <li className="select-people-checkbox">
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                          <span className="people-profile">
                            <ImageWithBasePath
                              src="assets/img/icons/company-icon-02.svg"
                              alt=""
                            />
                            <Link to="#">BlueSky Industries</Link>
                          </span>
                        </label>
                      </li>
                      <li className="select-people-checkbox">
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                          <span className="people-profile">
                            <ImageWithBasePath
                              src="assets/img/icons/company-icon-03.svg"
                              alt=""
                            />
                            <Link to="#">Silver Hawk</Link>
                          </span>
                        </label>
                      </li>
                      <li className="select-people-checkbox">
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                          <span className="people-profile">
                            <ImageWithBasePath
                              src="assets/img/icons/company-icon-04.svg"
                              alt=""
                            />
                            <Link to="#">Summit Peak</Link>
                          </span>
                        </label>
                      </li>
                      <li className="select-people-checkbox">
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                          <span className="people-profile">
                            <ImageWithBasePath
                              src="assets/img/icons/company-icon-05.svg"
                              alt=""
                            />
                            <Link to="#">RiverStone Ventur</Link>
                          </span>
                        </label>
                      </li>
                      <li className="select-people-checkbox">
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                          <span className="people-profile">
                            <ImageWithBasePath
                              src="assets/img/icons/company-icon-06.svg"
                              alt=""
                            />
                            <Link to="#">Bright Bridge Grp</Link>
                          </span>
                        </label>
                      </li>
                    </ul>
                  </div>
                  <div className="modal-btn text-end">
                    <Link
                      to="#"
                      className="btn btn-light"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </Link>
                    <button
                      type="button"
                      data-bs-dismiss="modal"
                      className="btn btn-primary"
                    >
                      Confirm
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* /Add Company */}
      </>
    </>
  );
};

export default ActivitiesModal;
