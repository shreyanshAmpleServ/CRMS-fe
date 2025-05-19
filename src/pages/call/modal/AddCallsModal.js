import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import React, { memo, useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeads } from "../../../redux/leads";
import { TimePicker } from "antd";
import DatePicker from "react-datepicker";
import DefaultEditor from "react-simple-wysiwyg";
import { fetchCallPurposes } from "../../../redux/callPurpose";
import { addCalls, updateCalls } from "../../../redux/calls";
import { fetchCallStatuses } from "../../../redux/callStatus";
import { fetchContacts } from "../../../redux/contacts/contactSlice";
import { fetchUsers } from "../../../redux/manage-user";
import { fetchProjects } from "../../../redux/projects";
import "./Toggle.css"
import { fetchCallTypes } from "../../../redux/callType";
import moment from "moment";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    width: "100%",
    minHeight: "38px",
    backgroundColor: "red",
    color: "white",
    fontWeight: "700",
    outline: "none",
    boxShadow: "none",
    borderColor: "red",
    borderTopRightRadius: "0px",
    borderBottomRightRadius: "0px",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "white",
    fontWeight: "700",
  }),
};

const AddCallModal = ({ setCallDetails, callsDetails }) => {
  const dispatch = useDispatch();
  dayjs.extend(customParseFormat);
  const [searchLeads, setSearchLeads] = useState("");
  const [searchProjects, setSearchProjects] = useState("");
  const [searchCallFor, setSearchCallFor] = useState("");
  const { contacts ,loading: loadingContact } = useSelector((state) => state.contacts);
  const { leads ,loading:loadingLeads } = useSelector((state) => state.leads);
  const { users ,loading:loadingUser} = useSelector((state) => state.users);
  const { callPurposes } = useSelector((state) => state.callPurposes);
  const { callStatuses } = useSelector((state) => state.callStatuses);
  const { callTypes } = useSelector((state) => state.callTypes);
  const { projects ,loading:loadingProjects } = useSelector((state) => state.projects);
  const [isScheduled,setIsScheduled] = useState(false)
  // const { relatedTo } = useSelector((state) => state.calls);
  React.useEffect(() => {
    if (searchCallFor) dispatch(fetchContacts({search:searchCallFor}));
  }, [ searchCallFor]);

  React.useEffect(() => {
    if (searchLeads) dispatch(fetchLeads({search:searchLeads}));
  }, [ searchLeads]);
  
  React.useEffect(() => {
    if (searchProjects) dispatch(fetchProjects(searchProjects));
  }, [ searchProjects]);

  const RefreshApi = async () => {
    watch("call_for") === "Leads" && (await dispatch(fetchLeads()).unwrap());
    watch("call_for") === "Accounts" && (await dispatch(fetchContacts()).unwrap());
    watch("call_for") === "Projects" && (await dispatch(fetchProjects("")).unwrap());
  };

 
  React.useEffect(() => {
    dispatch(fetchUsers());
    // dispatch(fetchContacts(""));
    // dispatch(fetchLeads({}));
    dispatch(fetchCallPurposes());
    dispatch(fetchCallStatuses());
    dispatch(fetchCallTypes());
    // dispatch(fetchProjects());
  }, [dispatch]);

  const constactList = contacts?.data?.map((emnt) => ({
    value: emnt.id,
    label: emnt.firstName + " " + emnt.lastName,
  }));
  const leadList = leads?.data?.map((emnt) => ({
    value: emnt.id,
    label: emnt.first_name + " "+emnt?.last_name,
  }));
  const projectList = projects?.data?.map((emnt) => ({
    value: emnt.id,
    label: emnt.name,
  }));
  const usersList = users?.data?.map((emnt) => ({
    value: emnt.id,
    label: emnt.full_name,
  }));
  const callPurposeList = callPurposes.map((emnt) => ({
    value: emnt.id,
    label: emnt.name,
  }));
  const callStatusList = callStatuses.map((emnt) => ({
    value: emnt.id,
    label: emnt.name,
  }));
  const callTypeList = callTypes.map((emnt) => ({
    value: emnt.id,
    label: emnt.name,
  }));

  // console.log("Related To ", relatedTo)
  const reminderTypes = [
    { value: "Email", label: "Email" },
    { value: "Pop-Up", label: "Pop-Up" },
    { value: "Both", label: "Both" },
  ];
  const options1 = [
    { value: "Accounts", label: "Accounts" },
    { value: "Leads", label: "Leads" },
    { value: "Projects", label: "Projects" },
  ];
  // console.log("Related To ", relatedTo)
  const options3 = [
    { value: "Accounts", label: "Accounts" },
    { value: "Contacts", label: "Contacts" },
  ];
  const options2 = [
    { value: "Y", label: "Yes" },
    { value: "N", label: "No" },
  ];

  // Initialize React Hook Form
  const {
    control,
    handleSubmit,
    trigger,
    register,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      call_for: "",
      call_for_lead_id: null,
      call_for_contact_id: null,
      call_for_project_id: null,
      assigned_to: null,
      related_to: null,
      related_to_id: null,
      call_purpose_id: null,
      call_status_id: null,
      ongoing_callStatus: isScheduled ? "Scheduled" : "Completed",
      call_status_id: null,
      call_type_id: null,
      call_start_date: new Date(),
      call_start_time: "",
      duration_minutes: null,
      call_subject: "",
      call_reminder: null,
      reminder_type: "",
      call_notes: "",
      follow_up_needed: "",
      follow_up_date: new Date(),
    },
  });
  React.useEffect(() => {
    if (callsDetails) {
      reset({
        call_for: callsDetails?.call_for || "",
        call_for_lead_id: callsDetails?.call_for_lead_id || null,
        call_for_contact_id: callsDetails?.call_for_contact_id || null,
        call_for_project_id: callsDetails?.call_for_project_id || null,
        assigned_to: callsDetails?.assigned_to || null,
        related_to: callsDetails?.related_to || null,
        related_to_id: callsDetails?.related_to_id || null,
        call_purpose_id: callsDetails?.call_purpose_id || null,
        call_status_id: callsDetails?.call_status_id || null,
        ongoing_callStatus: callsDetails?.ongoing_callStatus || isScheduled ? "Scheduled" : "Completed",
        call_type_id: callsDetails?.call_type_id || null,
        call_start_date: new Date(callsDetails?.call_start_date) || new Date(),
        call_start_time: dayjs(callsDetails?.call_start_time) || "",
        duration_minutes: callsDetails?.duration_minutes || null,
        call_subject: callsDetails?.call_subject || "",
        call_reminder: callsDetails?.call_reminder || null,
        reminder_type: callsDetails?.reminder_type || "",
        call_notes: callsDetails?.call_notes || "",
        follow_up_needed: callsDetails?.follow_up_needed || "",
        follow_up_date: callsDetails?.follow_up_date || new Date(),
      });
    } else {
      reset({
        call_for: "",
        call_for_lead_id: null,
        call_for_contact_id: null,
        call_for_project_id: null,
        assigned_to: null,
        related_to: null,
        related_to_id: null,
        call_purpose_id: null,
        call_status_id: null,
        ongoing_callStatus: isScheduled ? "Scheduled" : "Completed",
        call_type_id: null,
        call_start_date: new Date(),
        call_start_time: "",
        duration_minutes: null,
        call_subject: "",
        call_reminder: null,
        reminder_type: "",
        call_notes: "",
        follow_up_needed: "",
        follow_up_date: new Date(),
      });
    }
  }, [callsDetails]);

  const callFor = watch("call_for");
  const callForLeadId = watch("call_for_lead_id");
  const callForContactId = watch("call_for_contact_id");
  const callForProjectId = watch("call_for_project_id");
  const callForOptions = callFor === "Accounts" ? constactList : callFor === "Leads" ? leadList : projectList;
 const calForLoading =   watch("call_for") === "Accounts"
 ? loadingContact && true
 : watch("call_for") === "Leads" ? loadingLeads && true
 : watch("call_for") === "Projects" ? loadingProjects && true : false

  const { loading } = useSelector((state) => state.calls);

console.log(new Date("2025-04-22T10:35:04.000Z"))

  React.useEffect(()=>{
   ( callFor === "Accounts" || watch("related_to")) && dispatch(fetchContacts());
    callFor === "Leads" &&  dispatch(fetchLeads());
    callFor === "Projects" &&  dispatch(fetchProjects());
   },[dispatch,callFor,watch("related_to")])
console.log("IsScheduled : ",isScheduled)
  const onSubmit = async (data) => {
  
    const closeButton = document.getElementById("offcanvas_add_calls_close");
    const finalData = {
      call_for_contact_id: callFor === "Accounts" ? data.call_for_contact_id : null,
      call_for_lead_id: callFor === "Leads" ? data.call_for_lead_id : null,
      call_for_project_id: callFor === "Projects" ? data.call_for_project_id : null,
      ...data,
      call_start_time : dayjs(data.call_start_time).toDate()?.toISOString(),
      ongoing_callStatus: isScheduled ? "Scheduled" : "Completed",
    };
    try {
      await dispatch(
        callsDetails
          ? updateCalls({ id: callsDetails.id, callData: { ...finalData } })
          : addCalls(finalData)
      ).unwrap();
      reset();
      closeButton.click();
      setCallDetails(null);
    } catch (error) {
      closeButton.click();
    }
  };
  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add_calls");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setCallDetails(null);
        setIsScheduled(false)
        reset()
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

useEffect(()=>{setIsScheduled(callsDetails?.ongoing_callStatus === "Scheduled" ? true : false)},[callsDetails])

  return (
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="offcanvas_add_calls"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="fw-semibold">
          {callsDetails ? " Update " : "Add New "} Calls
        </h5>
       

        <button
          type="button"
          className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
          data-bs-dismiss="offcanvas"
          id="offcanvas_add_calls_close"
          aria-label="Close"
        >
          <i className="ti ti-x" />
        </button>
      </div>
              <div className="d-flex justify-content-end mt-1 " style={{marginBottom:"0px" ,marginRight:"13px"}}> <label for="filter" class="switch" aria-label="Toggle Filter">
  <input type="checkbox" id="filter" checked={isScheduled} onChange={(e)=>setIsScheduled(e.target.checked)} />
  <span>Call log</span>
  <span>Scheduled</span>
</label></div>
      <div className="offcanvas-body" style={{paddingTop:"4px"}}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="accordion" id="main_accordion">
            <div className="row">
              <div className="d-flex justify-content-between align-items-center">
                <label className="col-form-label col-lg-2">
                  Call For <span className="text-danger">*</span>
                </label>
                <div className="col-md-10">
                  <div className=" input-group">
                    <div className="col-md-3">
                      <Controller
                        name="call_for"
                        rules={{ required: "Call For is required!" }}
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            placeholder="Choose"
                            classNamePrefix="react-select"
                            options={options1}
                            onChange={(selectedOption) => {
                              field.onChange(selectedOption?.value || null);
                              setValue("call_for_contact_id", null , { shouldValidate: true });
                              setValue("call_for_lead_id", null , { shouldValidate: true });
                              setValue("call_for_project_id", null , { shouldValidate: true });
                              }}
                            value={options1?.find(
                              (option) => option.value === watch("call_for") || ""
                            ) || ""}
                            styles={customStyles}
                          />
                        )}
                      />
                    </div>
                    <div className="col-md-9">
                      <Controller
                        name={
                          watch("call_for") === "Accounts"
                            ? "call_for_contact_id"
                            :watch("call_for") === "Leads" ? "call_for_lead_id"
                            :"call_for_project_id"
                        }
                        rules={{ required: "Call For To is required!" }}
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            placeholder="Choose"
                            classNamePrefix="react-select"
                            isLoading={calForLoading}
                            onInputChange={(e) =>
                              callFor === "Accounts"
                                ? setSearchCallFor(e)
                                : callFor === "Leads" ? setSearchLeads(e) : setSearchProjects(e)
                            }
                            options={
                              callFor === "Accounts"
                                ? constactList
                                : callFor === "Leads" ? leadList 
                                : projectList
                            }
                            onChange={(selectedOption) => {
                              RefreshApi();
                              callFor === "Accounts"
                                ? setSearchCallFor("")
                                :  callFor === "Leads" ? setSearchLeads("") : setSearchProjects("");
                              field.onChange(selectedOption?.value || null);
                            }}
                            value={callForOptions?.find(
                              (option) =>
                                option.value ===
                                (callFor === "Accounts"
                                  ? callForContactId
                                  : callFor === "Leads" ? callForLeadId : callForProjectId)
                            ) || ""}
                            isSearchable
                            styles={{  control: (provided, state) => ({
                              ...provided,
                              width: "100%",
                              minHeight: "38px",
                              outline: "none",
                              boxShadow: "none",
                              color: "white",
                              borderTopLeftRadius: "0px",
                              borderBottomLeftRadius: "0px",
                            }),
                            }}
                          />
                        )}
                      />
                    </div>
                  </div>
               
                  {errors.call_for && (
                    <small className="text-danger">
                      {errors.call_for.message}
                    </small>
                  )}
                  {watch("call_for") === "Accounts"
                    ? errors.call_for_contact_id && (
                        <small
                          style={{ marginLeft: "15%" }}
                          className="text-danger "
                        >
                          {" "}
                          {errors.call_for_contact_id.message}
                        </small>
                      )
                    : errors.call_for_lead_id && (
                        <small
                          style={{ marginLeft: "40%" }}
                          className="text-danger "
                        >
                          {errors.call_for_lead_id.message}
                        </small>
                      )}
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center my-2">
                <label className="col-form-label col-lg-2">
                  Related To <span className="text-danger">*</span>
                </label>
                <div className="col-md-10">
                  <div className=" input-group">
                    <div className="col-md-3">
                      <Controller
                        name="related_to"
                        rules={{ required: "Related To is required!" }} // Make the field required
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={options3}
                            placeholder="Choose"
                            className="select2"
                            classNamePrefix="react-select"
                            onChange={(selectedOption) =>
                              field.onChange(selectedOption?.value || null)
                            } // Send only value
                            value={options3?.find(
                              (option) => option.value === watch("related_to")
                            ) || ""}
                            styles={{ 
                              
                              ...customStyles, // Keep existing styles if any
                            }}
                          />
                        )}
                      />
                    </div>
                    <div className="col-md-9">
                      <Controller
                        name="related_to_id"
                        rules={{ required: "Related To User is required!" }} // Make the field required
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={constactList}
                            placeholder="Choose"
                            isLoading={loadingContact ? true : false}
                            className="select2"
                            classNamePrefix="react-select"
                            onInputChange={(e) => setSearchCallFor(e)}
                            onChange={(selectedOption) => {
                              setSearchCallFor("");
                              field.onChange(selectedOption?.value || null);
                            }} // Send only value
                            value={constactList?.find(
                              (option) =>
                                option.value === watch("related_to_id")
                            ) || ""}
                            isSearchable
                            styles={{
                              control: (provided, state) => ({
                                ...provided,
                                width: "100%",
                                minHeight: "38px",
                                color: "white",
                                outline: "none",
                                boxShadow: "none",
                                borderTopLeftRadius: "0px",
                                borderBottomLeftRadius: "0px",
                              }),
                              menu: (provided) => ({
                                ...provided,
                                zIndex: 9999, // Ensure this value is higher than the icon's z-index
                              }),
                            }}
                          />
                        )}
                      />
                    </div>
                  </div>
                  {errors.related_to && (
                    <small className="text-danger">
                      {errors.related_to.message}
                    </small>
                  )}
                  {errors.related_to_id && (
                    <small
                      style={{ marginLeft: "15%" }}
                      className="text-danger"
                    >
                      {errors.related_to_id.message}
                    </small>
                  )}{" "}
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="col-form-label">Ongoing Call Status</label>

                  <input
                    type="text"
                    value={isScheduled ? "Scheduled" : "Completed"}
                    disabled
                    className="form-control"
                    {...register("ongoing_callStatus")}
                  />
                </div>
              </div>
            {isScheduled && <div className="col-md-6">
                <div className="mb-3">
                  <label className="col-form-label">
                    Call Owner <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="assigned_to"
                    rules={{ required: "Call For To is required!" }} // Make the field required
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={usersList}
                        isLoading={loadingUser && true}
                        placeholder="Choose"
                        className="select2"
                        classNamePrefix="react-select"
                        onChange={(selectedOption) =>
                          field.onChange(selectedOption?.value || null)
                        } // Send only value
                        value={usersList?.find(
                          (option) => option.value === watch("assigned_to")
                        ) || ""}
                        styles={{
                          menu: (provided) => ({
                            ...provided,
                            zIndex: 9999, // Ensure this value is higher than the icon's z-index
                          }),
                        }}
                      />
                    )}
                  />
                  {errors.assigned_to && (
                    <small className="text-danger">
                      {errors.assigned_to.message}
                    </small>
                  )}
                </div>
              </div>}
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="col-form-label">Call Purpose</label>
                  <Controller
                    name="call_purpose_id"
                    rules={{ required: "Call For To is required!" }} // Make the field required
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={callPurposeList}
                        placeholder="Choose"
                        className="select2"
                        classNamePrefix="react-select"
                        onChange={(selectedOption) =>
                          field.onChange(selectedOption?.value || null)
                        } // Send only value
                        value={callPurposeList?.find(
                          (option) => option.value === watch("call_purpose_id")
                        ) || ""}
                        styles={{
                          menu: (provided) => ({
                            ...provided,
                            zIndex: 9999, // Ensure this value is higher than the icon's z-index
                          }),
                        }}
                      />
                    )}
                  />
                  {errors.call_purpose_id && (
                    <small className="text-danger">
                      {errors.call_purpose_id.message}
                    </small>
                  )}
                </div>
              </div>
         
             <div className="col-md-6">
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <label className="col-form-label">
                      Call Type <span className="text-danger">*</span>
                    </label>
                  </div>
                  <Controller
                    name="call_type_id"
                    rules={{ required: "Call For To is required!" }} // Make the field required
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={callTypeList}
                        placeholder="Choose"
                        className="select2"
                        classNamePrefix="react-select"
                        onChange={(selectedOption) =>
                          field.onChange(selectedOption?.value || null)
                        } // Send only value
                        value={callTypeList?.find(
                          (option) => option.value === watch("call_type_id")
                        ) || ""}
                        styles={{
                          menu: (provided) => ({
                            ...provided,
                            zIndex: 9999, // Ensure this value is higher than the icon's z-index
                          }),
                        }}
                      />
                    )}
                  />
                  {errors.call_status_id && (
                    <small className="text-danger">
                      {errors.call_status_id.message}
                    </small>
                  )}
                </div>
              </div>
         {!isScheduled && <div className="col-md-6">
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <label className="col-form-label">
                      Call Status <span className="text-danger">*</span>
                    </label>
                  </div>
                  <Controller
                    name="call_status_id"
                    rules={{ required: "Call For To is required!" }} // Make the field required
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={callStatusList}
                        placeholder="Choose"
                        className="select2"
                        classNamePrefix="react-select"
                        onChange={(selectedOption) =>
                          field.onChange(selectedOption?.value || null)
                        } // Send only value
                        value={callStatusList?.find(
                          (option) => option.value === watch("call_status_id")
                        ) || ""}
                        styles={{
                          menu: (provided) => ({
                            ...provided,
                            zIndex: 9999, // Ensure this value is higher than the icon's z-index
                          }),
                        }}
                      />
                    )}
                  />
                  {errors.call_status_id && (
                    <small className="text-danger">
                      {errors.call_status_id.message}
                    </small>
                  )}
                </div>
              </div>}

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="col-form-label">
                    Start Date <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3 icon-form">
                    <span className="form-icon z-1">
                      <i className="ti ti-calendar-check" />
                    </span>
                    <Controller
                      name="call_start_date"
                      control={control}
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
                  {errors.call_start_date && (
                    <small className="text-danger">
                      {errors.call_start_date.message}
                    </small>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="col-form-label">
                    Start Time <span className="text-danger">*</span>
                  </label>

                  <div className="mb-3 icon-form">
                    <span className="form-icon">
                      <i className="ti ti-clock-hour-10" />
                    </span>
                    <Controller
                      name="call_start_time"
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
                  </div>
                  {errors.call_start_time && (
                    <small className="text-danger">
                      {errors.call_start_time.message}
                    </small>
                  )}
                </div>
              </div>
             {!isScheduled && <div className="col-md-6">
                <div className="mb-3">
                  <label className="col-form-label">
                    Duration (Min){!isScheduled && <span className="text-danger">*</span>}
                  </label>
                  <input
                    type="Number"
                    className="form-control"
                    {...register("duration_minutes", !isScheduled && {
                      required: "Duration is required",
                      valueAsNumber: true,
                    })}
                  />
                  {errors.duration_minutes && (
                    <small className="text-danger">
                      {errors.duration_minutes.message}
                    </small>
                  )}
                </div>
              </div>}
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="col-form-label">Call Subject</label>
                  <input
                    type="text"
                    className="form-control"
                    {...register("call_subject")}
                  />
                </div>
              </div>
              {isScheduled  && <div className="col-md-6">
                <div className="mb-3">
                  <label className="col-form-label">Call Reminder (Min)</label>

                  <input
                    type="number"
                    className="form-control"
                    {...register("call_reminder", {
                      valueAsNumber: true,
                    })}
                    // onInput={(e) => {
                    //   if (e.target.value > 10) e.target.value = 10; // Prevents values > 10
                    // }}
                    // min={0}
                    // max={10}
                  />
                </div>
              </div>}
            {isScheduled  && <div className="col-md-6">
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <label className="col-form-label">
                      Reminder Type <span className="text-danger">*</span>
                    </label>
                  </div>
                  <Controller
                    name="reminder_type"
                    // rules={{ required: "Call For To is required!" }} // Make the field required
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={reminderTypes}
                        placeholder="Choose"
                        className="select2"
                        classNamePrefix="react-select"
                        onChange={(selectedOption) =>
                          field.onChange(selectedOption?.value || null)
                        } // Send only value
                        value={reminderTypes?.find(
                          (option) => option.value === watch("reminder_type")
                        )}
                        styles={{
                          menu: (provided) => ({
                            ...provided,
                            zIndex: 9999, // Ensure this value is higher than the icon's z-index
                          }),
                        }}
                      />
                    )}
                  />
                  {/* {errors.call_status_id && (
                    <small className="text-danger">
                      {errors.call_status_id.message}
                    </small>
                  )} */}
                </div>
              </div>}
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="col-form-label">Call Note</label>

                  <Controller
                    name="call_notes"
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
                </div>
              </div>
              {/* <div className="col-md-6">
                <div className="mb-3">
                  <label className="col-form-label">Follow Up Need</label>
                  <Controller
                    name="follow_up_needed"
                    rules={{ required: "Source is required!" }} // Make the field required
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={options2}
                        placeholder="Choose"
                        className="select2"
                        classNamePrefix="react-select"
                        onChange={(selectedOption) =>
                          field.onChange(selectedOption?.value || null)
                        } // Send only value
                        value={options2?.find(
                          (option) => option.value === watch("lead_source")
                        )}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="col-form-label">Follow Up Date</label>
                  <div className="mb-3 icon-form">
                    <span className="form-icon">
                      <i className="ti ti-calendar-check" />
                    </span>
                    <Controller
                      name="follow_up_date"
                      control={control}
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
                </div>
              </div> */}
            </div>
          </div>
          {/* /Access */}`
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
              {callsDetails
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
  );
};
export default memo(AddCallModal);
