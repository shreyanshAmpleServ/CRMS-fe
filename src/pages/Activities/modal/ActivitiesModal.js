import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Select from "react-select";
// import {
//     setActivityTogglePopup,
//     setActivityTogglePopupTwo,
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
import { StatusOptions } from "../../../components/common/selectoption/selectoption";



const ActivitiesModal = ({ setActivity, activity }) => {
  const [searchValue, setSearchValue] = useState("");
  const [searchProjectValue, setSearchProjectValue] = useState("");
  const [selectedType, setSelectedType] = useState();
  const dispatch = useDispatch();
  dayjs.extend(customParseFormat);

  const options = [
    {
      value: "Darlee Robertson",
      label: "Darlee Robertson",
      image: "assets/img/profiles/avatar-19.jpg",
    },
    {
      value: "Sharon Roy",
      label: "Sharon Roy",
      image: "assets/img/profiles/avatar-20.jpg",
    },
    {
      value: "Vaughan",
      label: "Vaughan",
      image: "assets/img/profiles/avatar-21.jpg",
    },
    {
      value: "Jessica",
      label: "Jessica",
      image: "assets/img/profiles/avatar-23.jpg",
    },
    {
      value: "Carol Thomas",
      label: "Carol Thomas",
      image: "assets/img/profiles/avatar-16.jpg",
    },
  ];

  const {
    control,
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      status:"",
      is_reminder: "N",
      type_id: null,
      due_date: new Date(),
      due_time: "",
      reminder_time: "",
      reminder_type: "",
      owner_id: null,
      priority: null,
      description: "",
      deal_id: null,
      contact_id: null,
      company_id: null,
      project_id: null,
      createdby: 1,
    },
  });
  const isReminder = watch("is_reminder");

  React.useEffect(
    () => {
      if (activity) {
        reset({
          title: activity?.title || "",
          status: activity?.status || "",
          type_id: activity?.type_id || null,
          due_date: activity?.due_date || new Date(),
          due_time: activity?.due_time || "",
          reminder_time: activity?.reminder_time || "",
          reminder_type: activity?.reminder_type || "",
          owner_id: activity?.owner_id || null,
          is_reminder: activity?.is_reminder || "N",
          description: activity?.description || "",
          deal_id: activity?.deal_id || null,
          contact_id: activity?.contact_id || null,
          company_id: activity?.company_id || null,
          project_id: activity?.project_id || null,
          priority: activity?.priority || 0,
        });
        setSelectedType(activity?.type_id);
      } else {
        reset({
          title: "",
          status: "",
          type_id: null,
          due_date: new Date(),
          due_time: "",
          reminder_time: "",
          reminder_type: "",
          owner_id: null,
          is_reminder: "N",
          description: "",
          deal_id: null,
          priority: 0,
          contact_id: null,
          project_id: null,
          createdby: 1,
        });
        setSelectedType(null);
      }
    },
    [activity],
    reset
  );
  React.useEffect(() => {
    dispatch(fetchContacts({search:searchValue}));
  }, [dispatch, searchValue]);
  React.useEffect(() => {
    dispatch(fetchProjects(searchProjectValue));
  }, [dispatch, searchProjectValue]);
  const { loading } = useSelector((state) => state?.activities);
  React.useEffect(() => {
    dispatch(fetchCompanies());
    dispatch(fetchDeals());
    dispatch(fetchActivityTypes());
    dispatch(fetchUsers());
  }, [dispatch]);

  const { companies } = useSelector((state) => state.companies);
  const { deals } = useSelector((state) => state.deals);
  const { contacts } = useSelector((state) => state.contacts);
  const { projects } = useSelector((state) => state.projects);
  const { users } = useSelector((state) => state.users);
  const activityTypes = useSelector((state) => state.activities.activityTypes);

  const options1 = [
    // { value: "", label: "Select" },
    { value: "M", label: "Minutes" },
    { value: "H", label: "Hours" },
  ];

  const options2 = [
    { value: 0, label: "Select" },
    { value: 3, label: "High" },
    { value: 2, label: "Normal" },
    { value: 1, label: "Low" },
  ];

  const options3 = [
    { value: "select", label: "Select" },
    { value: "collins", label: "Collins" },
    { value: "konopelski", label: "Konopelski" },
    { value: "adams", label: "Adams" },
  ];

  const options4 = [
    { value: "select", label: "Select" },
    { value: "novawave", label: "NovaWave LLC" },
    { value: "silverhawk", label: "SilverHawk" },
    { value: "harborview", label: "HarborView" },
  ];

  const onSubmit = async (data) => {
    const finalData = {
      ...data,
      type_id: selectedType,
    };
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      activity
        ? await dispatch(
            updateActivities({
              id: activity.id,
              activityData: {
                ...finalData,
                due_date: new Date(finalData.due_date),
              },
            })
          ).unwrap()
        : await dispatch(addActivities(finalData)).unwrap();
      closeButton.click();
      reset();
      setActivity(null);
    } catch (error) {
      closeButton.click();
    }
  };

  const deleteData = () => {
    if (activity) {
      dispatch(deleteActivities(activity));
      // navigate(`/crm/activities`); // Navigate to the specified route
      // setShowDeleteModal(false); // Close the modal
      setActivity(null);
    }
  };
  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setActivity(null);
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
      {/* Add New Activity */}
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_add"
      >
        <div className="offcanvas-header border-bottom">
          <h4>{activity ? "Update " : "Add New "} Activity </h4>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => {
              setActivity(null);
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
                <div className="col-md-12">
                  <div className="mb-3">
                    <label className="col-form-label">
                      Title <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      {...register("title", {
                        required: "Title is required",
                      })}
                    />
                  </div>
                  {errors.title && (
                    <small className="text-danger">
                      {errors.title.message}
                    </small>
                  )}
                </div>
                <div className="col-md-12">
                  <div className="mb-3">
                    <label className="col-form-label">
                      Activity Type <span className="text-danger">*</span>
                    </label>
                    <ul className="radio-activity">
                      {activityTypes?.map((types) => (
                        <li>
                          <div
                            className="active-type"
                            onClick={() => setSelectedType(types.id)}
                          >
                            <input
                              type="radio"
                              id={`activity-${types.id}`}
                              name="status"
                              value={types.id}
                              checked={selectedType === types.id}
                            />
                            <label htmlFor="call">
                              {types?.name?.includes("Calls") && (
                                <i className="ti ti-phone" />
                              )}
                              {types?.name?.includes("Emails") && (
                                <i className="ti ti-mail" />
                              )}
                              {types?.name?.includes("Task") && (
                                <i className="ti ti-subtask" />
                              )}
                              {types?.name?.includes("Meeting") && (
                                <i className="ti ti-user-share" />
                              )}
                              {types.name}
                            </label>
                          </div>
                        </li>
                      ))}
                      
                    </ul>
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="col-form-label">
                    Due Date <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3 icon-form">
                    <span className="form-icon">
                      <i className="ti ti-calendar-check" />
                    </span>
                    <Controller
                      name="due_date"
                      control={control}
                      rules={{ required: "Due date is required!" }}
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
                  {errors.due_date && (
                    <small className="text-danger">
                      {errors.due_date.message}
                    </small>
                  )}
                </div>
                <div className="col-md-4">
                  <label className="col-form-label">
                    Time <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3 icon-form">
                    <span className="form-icon">
                      <i className="ti ti-clock-hour-10" />
                    </span>
                    <Controller
                      name="due_time"
                      rules={{ required: "Due Time is required!" }}
                      control={control}
                      render={({ field }) => (
                        <TimePicker
                          {...field}
                          placeholder="Select Time"
                          className="form-control"
                          value={
                            field.value ? dayjs(field.value, "HH:mm:ss") : null
                          }
                          selected={field.value}
                          onChange={field.onChange}
                          dateFormat="HH:mm:ss"
                        />
                      )}
                    />
                    {/* <input type="time" placeholder="Select Time" className="form-control datetimepicker"
                                            {...register("due_time", {
                                                required: "Due Time is required",
                                            })} /> */}
                    {/* <TimePicker
                                             placeholder="Select Time"
                                             className="form-control datetimepicker-time"
                                             onChange={onChange}
                                             defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
                                         /> */}
                  </div>
                  {errors.due_time && (
                    <small className="text-danger">
                      {errors.due_time.message}
                    </small>
                  )}
                </div>
                <div className="col-md-4">
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
                            options={StatusOptions}
                            classNamePrefix="react-select"
                            value={StatusOptions?.find(
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
                <div className="col-md-12">
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
                </div>
                {isReminder === "Y" && (
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
                        {...register("reminder_type", {
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
                )}
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="col-form-label">
                      Owner <span className="text-danger">*</span>
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
                            } // Store only value
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
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="col-form-label">
                      Priority <span className="text-danger">*</span>
                    </label>
                    <Controller
                      name="priority"
                      control={control}
                      rules={{ required: "Priority is required" }} // Validation rule
                      render={({ field }) => {
                        const selectedDeal = options2?.find(
                          (owner) => owner.value === field.value
                        );
                        return (
                          <Select
                            {...field}
                            className="select"
                            options={options2?.map((i) => ({
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
                            } // Ensure correct default value
                            onChange={(selectedOption) =>
                              field.onChange(selectedOption.value)
                            } // Store only value
                          />
                        );
                      }}
                    />
                    {errors.priority && (
                      <small className="text-danger">
                        {errors.priority.message}
                      </small>
                    )}
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="mb-3">
                    <label className="col-form-label">
                      Description <span className="text-danger">*</span>
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
                  <div className="mb-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <label className="col-form-label">Deals</label>
                    </div>
                    <Controller
                      name="deal_id"
                      control={control}
                      rules={{ required: "Deal is required" }} // Validation rule
                      render={({ field }) => {
                        const selectedDeal = deals?.data?.find(
                          (deal) => deal.id === field.value
                        );
                        return (
                          <Select
                            {...field}
                            className="select"
                            options={deals?.data?.map((i) => ({
                              label: i?.dealName,
                              value: i?.id,
                            }))}
                            classNamePrefix="react-select"
                            value={
                              selectedDeal
                                ? {
                                    label: selectedDeal.dealName,
                                    value: selectedDeal.id,
                                  }
                                : null
                            } // Ensure correct default value
                            onChange={(selectedOption) =>
                              field.onChange(selectedOption.value)
                            } // Store only value
                          />
                        );
                      }}
                    />
                    {errors.deal_id && (
                      <small className="text-danger">
                        {errors.deal_id.message}
                      </small>
                    )}
                  </div>
                  <div className="mb-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <label className="col-form-label">Contacts</label>
                    </div>
                    <Controller
                      name="contact_id"
                      control={control}
                      rules={{ required: "Contact is required" }} // Validation rule
                      render={({ field }) => {
                        const selectedValue = contacts?.data?.find(
                          (contact) => contact.id === field.value
                        );
                        return (
                          <Select
                            {...field}
                            className="select"
                            options={contacts?.data?.map((i) => ({
                              label: `${i?.firstName} ${i?.lastName}`,
                              value: i?.id,
                            }))}
                            isSearchable
                            onInputChange={(e) => setSearchValue(e)}
                            classNamePrefix="react-select"
                            value={
                              selectedValue
                                ? {
                                    label: `${selectedValue.firstName} ${selectedValue.lastName}`,
                                    value: selectedValue.id,
                                  }
                                : null
                            } // Ensure correct default value
                            onChange={(selectedOption) =>
                              field.onChange(selectedOption.value)
                            } // Store only the value
                          />
                        );
                      }}
                    />
                    {errors.contact_id && (
                      <small className="text-danger">
                        {errors.contact_id.message}
                      </small>
                    )}
                  </div>
               
                  <div className="mb-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <label className="col-form-label">Companies</label>
                    </div>
                    <Controller
                      name="company_id"
                      control={control}
                      rules={{ required: "Company is required" }} // Validation rule
                      render={({ field }) => {
                        const selectedCompany = companies?.data?.find(
                          (company) => company.id === field.value
                        );
                        return (
                          <Select
                            {...field}
                            className="select"
                            options={companies?.data?.map((i) => ({
                              label: i?.name,
                              value: i?.id,
                            }))}
                            classNamePrefix="react-select"
                            value={
                              selectedCompany
                                ? {
                                    label: selectedCompany.name,
                                    value: selectedCompany.id,
                                  }
                                : null
                            } // Ensure correct default value
                            onChange={(selectedOption) =>
                              field.onChange(selectedOption.value)
                            } // Store only value
                          />
                        );
                      }}
                    />
                    {errors.company_id && (
                      <small className="text-danger">
                        {errors.company_id.message}
                      </small>
                    )}
                  </div>
                  <div className="mb-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <label className="col-form-label">Project</label>
                    </div>
                    <Controller
                      name="project_id"
                      control={control}
                      // rules={{ required: "Contact is required" }} // Validation rule
                      render={({ field }) => {
                        const selectedValue = projects?.data?.find(
                          (contact) => contact.id === field.value
                        );
                        return (
                          <Select
                            {...field}
                            className="select"
                            options={projects?.data?.map((i) => ({
                              label: `${i?.name}`,
                              value: i?.id,
                            }))}
                            isSearchable
                            onInputChange={(e) => setSearchProjectValue(e)}
                            classNamePrefix="react-select"
                            value={
                              selectedValue
                                ? {
                                    label: `${selectedValue.name}`,
                                    value: selectedValue.id,
                                  }
                                : null
                            } // Ensure correct default value
                            onChange={(selectedOption) =>
                              field.onChange(selectedOption.value)
                            } // Store only the value
                          />
                        );
                      }}
                    />
                    {/* {errors.contact_id && (
                      <small className="text-danger">
                        {errors.contact_id.message}
                      </small>
                    )} */}
                  </div>
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
                {activity
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
                <h5 className="modal-title">Add Contacts</h5>
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
                <h5 className="modal-title">Add Deals</h5>
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
                <h5 className="modal-title">Add Company</h5>
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
      <>
        {/* Edit Activity */}
        <div
          className="offcanvas offcanvas-end offcanvas-large"
          tabIndex={-1}
          id="offcanvas_edit"
        >
          <div className="offcanvas-header border-bottom">
            <div>
              <h4 className="mb-2">We scheduled a meeting for next week</h4>
              <p>
                Commented by <span>Aeron</span> on 15 Sep 2023, 11:15 pm
              </p>
            </div>
            <button
              type="button"
              className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <div className="offcanvas-body">
            <form>
              <div className="pro-create">
                <div className="tab-activity">
                  <ul className="nav">
                    <li>
                      <Link
                        to="#"
                        data-bs-toggle="tab"
                        data-bs-target="#activity"
                        className="active"
                      >
                        Activity
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#"
                        data-bs-toggle="tab"
                        data-bs-target="#comments"
                      >
                        Comments<span>1</span>
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="tab-content">
                  <div className="tab-pane fade" id="comments">
                    <div className="comment-wrap mb-4">
                      <h6>
                        The best way to get a project done faster is to start
                        sooner. A goal without a timeline is just a dream.The
                        goal you set must be challenging. At the same time, it
                        should be realistic and attainable, not impossible to
                        reach.
                      </h6>
                      <p>
                        Commented by <span>Aeron</span> on 15 Sep 2023, 11:15 pm
                      </p>
                    </div>
                  </div>
                  <div className="tab-pane show active" id="activity">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="col-form-label">
                            Title <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            value={activity?.title}
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="col-form-label">
                            Activity Type <span className="text-danger">*</span>
                          </label>
                          <ul className="radio-activity">
                            <li>
                              <div className="active-type">
                                <input
                                  type="radio"
                                  id="call2"
                                  name="status"
                                  defaultChecked
                                />
                                <label htmlFor="call2">
                                  <i className="ti ti-phone" />
                                  Calls
                                </label>
                              </div>
                            </li>
                            <li>
                              <div className="active-type">
                                <input type="radio" id="mail2" name="status" />
                                <label htmlFor="mail2">
                                  <i className="ti ti-mail" />
                                  Email
                                </label>
                              </div>
                            </li>
                            <li>
                              <div className="active-type">
                                <input type="radio" id="task2" name="status" />
                                <label htmlFor="task2">
                                  <i className="ti ti-subtask" />
                                  Task
                                </label>
                              </div>
                            </li>
                            <li>
                              <div className="active-type">
                                <input
                                  type="radio"
                                  id="shares2"
                                  name="status"
                                />
                                <label htmlFor="shares2">
                                  <i className="ti ti-user-share" />
                                  Meeting
                                </label>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="col-form-label">
                          Due Date <span className="text-danger">*</span>
                        </label>
                        <div className="mb-3 icon-form">
                          <span className="form-icon">
                            <i className="ti ti-calendar-check" />
                          </span>
                          <input
                            type="text"
                            className="form-control datetimepicker"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="col-form-label">
                          Time <span className="text-danger">*</span>
                        </label>
                        <div className="mb-3 icon-form">
                          <span className="form-icon">
                            <i className="ti ti-clock-hour-10" />
                          </span>
                          <TimePicker
                            placeholder="Select Time"
                            className="form-control datetimepicker-time"
                            // onChange={onChange}
                            defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="col-form-label">
                          Reminder <span className="text-danger">*</span>
                        </label>
                        <div className="mb-3 icon-form">
                          <span className="form-icon">
                            <i className="ti ti-bell-ringing" />
                          </span>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center">
                          <div className="mb-3 w-100">
                            <label className="col-form-label">&nbsp;</label>
                            <Select
                              className="select"
                              options={options1}
                              classNamePrefix="react-select"
                            />
                          </div>
                          <div className="mb-3 time-text">
                            <label className="col-form-label">&nbsp;</label>
                            <p>Before Due</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="col-form-label">
                            Owner <span className="text-danger">*</span>
                          </label>
                          <Select
                            className="select"
                            options={options2}
                            classNamePrefix="react-select"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="col-form-label">
                            Guests <span className="text-danger">*</span>
                          </label>
                          <Select
                            options={options}
                            isMulti
                            getOptionLabel={(option) =>
                              `${option.label} (${option.value})`
                            }
                            getOptionValue={(option) => option.value}
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="col-form-label">
                            Description <span className="text-danger">*</span>
                          </label>
                          <DefaultEditor className="summernote" />
                        </div>
                        <div className="mb-3">
                          <div className="d-flex align-items-center justify-content-between">
                            <label className="col-form-label">Deals</label>
                            <Link
                              to="#"
                              className="label-add"
                              data-bs-toggle="modal"
                              data-bs-target="#add_deal"
                            >
                              <i className="ti ti-square-rounded-plus" />
                              Add New
                            </Link>
                          </div>
                          <Select
                            className="select"
                            options={options3}
                            classNamePrefix="react-select"
                          />
                        </div>
                        <div className="mb-3">
                          <div className="d-flex align-items-center justify-content-between">
                            <label className="col-form-label">Contacts</label>
                            <Link
                              to="#"
                              className="label-add"
                              data-bs-toggle="modal"
                              data-bs-target="#add_contacts"
                            >
                              <i className="ti ti-square-rounded-plus" />
                              Add New
                            </Link>
                          </div>
                          <Select
                            className="select"
                            options={options3}
                            classNamePrefix="react-select"
                          />
                        </div>
                        <div className="mb-3">
                          <div className="d-flex align-items-center justify-content-between">
                            <label className="col-form-label">Companies</label>
                            <Link
                              to="#"
                              className="label-add"
                              data-bs-toggle="modal"
                              data-bs-target="#add_company"
                            >
                              <i className="ti ti-square-rounded-plus" />
                              Add New
                            </Link>
                          </div>
                          <Select
                            className="select"
                            options={options4}
                            classNamePrefix="react-select"
                          />
                        </div>
                      </div>
                    </div>
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
                <button type="button" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
        {/* /Edit Activity */}
        {/* Delete Activity */}
        <div className="modal fade" id="delete_activity" role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <div className="text-center">
                  <div className="avatar avatar-xl bg-danger-light rounded-circle mb-3">
                    <i className="ti ti-trash-x fs-36 text-danger" />
                  </div>
                  <h4 className="mb-2">Remove Activity?</h4>
                  <p className="mb-0">
                    Are you sure you want to remove <br /> activity you
                    selected.
                  </p>
                  <div className="d-flex align-items-center justify-content-center mt-4">
                    <Link
                      to="#"
                      className="btn btn-light me-2"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </Link>
                    <Link
                      to="#"
                      data-bs-dismiss="modal"
                      onClick={deleteData}
                      className="btn btn-danger"
                    >
                      Yes, Delete it
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Delete Activity */}
      </>
    </>
  );
};

export default ActivitiesModal;
