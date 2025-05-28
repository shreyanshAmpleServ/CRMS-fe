import React, { useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { TagsInput } from "react-tag-input-component";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import DefaultEditor from "react-simple-wysiwyg";
import { addDeal } from "../../../redux/deals";

import {
  salestypelist,
  status,
  optionssymbol,
  duration,
  project,
  tagInputValues,
  socialMedia,
  priorityList,
} from "../../../components/common/selectoption/selectoption";
import { fetchContacts } from "../../../redux/contacts/contactSlice";
import { fetchPipelines, fetchPipelineById } from "../../../redux/pipelines";
import AddPipelineModal from "../../pipelines/modal/AddPipelineModal";
import { fetchCurrencies } from "../../../redux/currency";
import { fetchSources } from "../../../redux/source";

const AddDealModel = () => {
  const dispatch = useDispatch();
  // Fetch contacts on component mount
  React.useEffect(() => {
    dispatch(fetchContacts());
    dispatch(fetchPipelines());
    dispatch(fetchCurrencies())
        dispatch(fetchSources());
  }, [dispatch]);
  const [tags, setTags] = useState([]);
  
  const [dueDate, setDueDate] = useState(new Date());
  const [expectedCloseDate, setExpectedCloseDate] = useState(new Date());
  const [followUpDate, setFollowUpDate] = useState(new Date());
  const { loading: dealsLoading } = useSelector((state) => state.deals);
  const { contacts } = useSelector((state) => state.contacts);
  const { sources } = useSelector((state) => state.sources);
   const { currencies } = useSelector( (state) => state.currency);
  
  const currencyLists = currencies?.map(i => i?.is_active === "Y" ? ({label:i?.code,value:i?.code}) : null).filter(Boolean) || [];
  
   const {   pipelines : pipelineLists } = useSelector((state) => state.pipelines);
  
   const pipelines = pipelineLists?.data?.map(i => i?.is_active === "Y" ? i : null).filter(Boolean) || [];

  const contactlist = contacts?.data?.map((contact) => ({
    value: contact.id,
    label: `${contact.firstName.trim()} ${contact.lastName.trim()}`,
  }));
  const pipelineList = pipelines?.map((pipeline) => ({
    value: pipeline.id,
    label: pipeline.name,
  }));
    const sourceList = sources.map((emnt) => ({
    value: emnt.id,
    label: emnt.name,
  }));

  const {
    control,
    handleSubmit,
    register,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      dealName: "",
      pipelineId: null,
      stageId: null,
      status: null,
      dealValue: "",
      currency: null,
      period: null,
      periodValue: "",
      dueDate: new Date(),
      expectedCloseDate: new Date(),
      followUpDate: new Date(),
      assigneeId: null,
      source: null,
      priority: null,
      tags: "",
      description: "",
      contactIds: [],
      createdBy: 1, // Hardcoded for simplicity
    },
  });
  const [stages, setStages] = useState([]); // Local state for stages
  const {loading} = useSelector((state) => state.pipelines);

  const onPipelineChange = async (selectedPipeline) => {
    setValue("pipelineId", selectedPipeline); // Set selected pipeline in the form
    setStages([]); // Clear stages initially
    if (selectedPipeline) {
      try {
        const response = await dispatch(
          fetchPipelineById(selectedPipeline.value),
        ).unwrap();
        const fetchedStages = response.data.stages.map((stage) => ({
          value: stage.id,
          label: stage.name,
        }));
        setStages(fetchedStages);
      } catch (error) {
        console.error("Failed to fetch pipeline stages:", error);
      }
    }
  };
  // Form submission handler
  const onSubmit = async (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      const transformedData = {
        ...data,
        contactIds: data.contactIds?.map((contact) => contact.value),
        currency: data.currency?.value || null,
        period: data.period?.value || null,
        pipelineId: parseInt(data.pipelineId.value) || null,
        stageId: parseInt(data.stageId.value) || null,
        status: data.status?.value || null,
        tags: tags.join(", "),
        dealValue: parseFloat(data.dealValue),
        periodValue: parseInt(data.periodValue),
        dueDate: dueDate.toISOString(),
        expectedCloseDate: expectedCloseDate.toISOString(),
        followUpDate: followUpDate.toISOString(),
        priority: data.priority?.value || null,
      };
      await dispatch(addDeal(transformedData)).unwrap();
      // Reset the form fields after successful deal creation
      reset(); // This will reset the form to its initial/default values
      closeButton.click();
    } catch (error) {
      closeButton.click();
    }
  };

  return (
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="offcanvas_add_deal"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="fw-semibold">Add New Deal</h5>
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            {/* Deal Name */}
            <div className="col-md-12">
              <div className="mb-3">
                <label className="col-form-label">
                  Deal Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter name"
                  className="form-control"
                  {...register("dealName", {
                    required: "Deal name is required",
                  })}
                />
                {errors.dealName && (
                  <small className="text-danger">
                    {errors.dealName.message}
                  </small>
                )}
              </div>
            </div>

            {/* Pipeline */}
            <div className="col-md-6">
              <div className="mb-3">
                <div className="d-flex align-items-center justify-content-between">
                  <label className="col-form-label">
                    Pipeline <span className="text-danger">*</span>
                  </label>
                  {/* <Link
                    to=""
                    className="label-add"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#add_offcanvas_pipeline"
                  >
                    <i className="ti ti-square-rounded-plus"></i> Add New
                  </Link> */}
                </div>
                <Controller
                  name="pipelineId"
                  rules={{ required: "Pipeline is required" }}
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={[
                        { label: "Choose", value: "" },
                        ...pipelineList,
                      ]}
                      placeholder="Choose"
                      classNamePrefix="react-select"
                      onChange={(selected) => onPipelineChange(selected)}
                    />
                  )}
                />
                {errors.pipelineId && (
                  <small className="text-danger">
                    {errors.pipelineId.message}
                  </small>
                )}
              </div>
            </div>

            {/* Stage */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Stage <span className="text-danger">*</span>
                </label>
                <Controller
                  name="stageId"
                  control={control}
                  rules={{ required: "Stage is required" }} // Validation rule
                  render={({ field }) => (
                    <Select
                      {...field}
                      isLoading={loading}
                      options={stages}
                      placeholder="Choose"
                      isDisabled={!stages.length} // Disable if no stages are available
                      classNamePrefix="react-select"
                    />
                  )}
                />
                {errors.stageId && (
                  <small className="text-danger">
                    {errors.stageId.message}
                  </small>
                )}
              </div>
            </div>

            {/* Deal Value and Currency */}
            <div className="col-md-3">
              <div className="mb-3">
                <label className="col-form-label">
                  Deal Value <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.0"
                  className="form-control"
                  {...register("dealValue", {
                    required: "Deal value is required",
                  })}
                />
                {errors.dealValue && (
                  <small className="text-danger">
                    {errors.dealValue.message}
                  </small>
                )}
              </div>
            </div>

            <div className="col-md-3">
              <div className="mb-3">
                <label className="col-form-label">
                  Currency <span className="text-danger">*</span>
                </label>
                <Controller
                  name="currency"
                  rules={{ required: "Currency is required" }} // Validation rule
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={currencyLists}
                      placeholder="Choose"
                      classNamePrefix="react-select"
                    />
                  )}
                />

                {errors.currency && (
                  <small className="text-danger">
                    {errors.currency.message}
                  </small>
                )}
              </div>
            </div>

            {/* Period and Period Value */}
            <div className="col-md-3">
              <div className="mb-3">
                <label className="col-form-label">
                  Period <span className="text-danger">*</span>
                </label>
                <Controller
                  name="period"
                  rules={{ required: "Period is required" }} // Validation rule
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={duration}
                      placeholder="Choose"
                      classNamePrefix="react-select"
                    />
                  )}
                />
                {errors.period && (
                  <small className="text-danger">{errors.period.message}</small>
                )}
              </div>
            </div>

            <div className="col-md-3">
              <div className="mb-3">
                <label className="col-form-label">
                  Period Value <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  placeholder="0"
                  className="form-control"
                  {...register("periodValue", {
                    required: "Period value is required",
                  })}
                />
                {errors.periodValue && (
                  <small className="text-danger">
                    {errors.periodValue.message}
                  </small>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Contact <span className="text-danger">*</span>
                </label>
                <Controller
                  name="contactIds"
                  control={control}
                  rules={{ required: "Contact is required" }}
                  defaultValue={[]} // Initial empty array
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={contactlist}
                      isMulti
                      className="select2"
                      classNamePrefix="react-select"
                      placeholder="Choose contacts"
                    />
                  )}
                />
                {errors.contactIds && (
                  <small className="text-danger">
                    {errors.contactIds.message}
                  </small>
                )}
              </div>
            </div>

            {/* Dates */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Due Date <span className="text-danger">*</span>
                </label>
                <DatePicker
                  className="form-control"
                  selected={dueDate}
                  onChange={(date) => setDueDate(date)}
                  dateFormat="yyyy-MM-dd"
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Expected Close Date <span className="text-danger">*</span>
                </label>
                <DatePicker
                  className="form-control"
                  selected={expectedCloseDate}
                  onChange={(date) => setExpectedCloseDate(date)}
                  dateFormat="yyyy-MM-dd"
                />
              </div>
            </div>

            {/* Other Fields */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">Tags</label>
                <TagsInput value={tags} onChange={setTags} />
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Priority <span className="text-danger">*</span>
                </label>
                <Controller
                  name="priority"
                  rules={{ required: "Priority is required" }}
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={priorityList}
                      placeholder="Choose"
                      classNamePrefix="react-select"
                    />
                  )}
                />
                {errors.priority && (
                  <small className="text-danger">
                    {errors.priority.message}
                  </small>
                )}
              </div>
            </div>
            {/* Status */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Status <span className="text-danger">*</span>
                </label>
                 <Controller
                                          name="status"
                                          rules={{ required: "Status is required" }} // Make the field required
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
                                                  option.value === watch("status"),
                                              )}
                                            />
                                          )}
                                        />
                {/* <Controller
                  name="status"
                  control={control}
                  rules={{ required: "Status is required" }} // Validation rule
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={status}
                      placeholder="Choose"
                      classNamePrefix="react-select"
                    />
                  )}
                /> */}
                {errors.status && (
                  <small className="text-danger">{errors.status.message}</small>
                )}
              </div>
            </div>
            {/* Description */}
            <div className="col-lg-12">
              <div className="mb-3">
                <label className="col-form-label">Description</label>
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

            <button
              type="submit"
              className="btn btn-primary"
              disabled={dealsLoading}
            >
              {dealsLoading ? "Creating..." : "Create"}
              {dealsLoading && (
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
      <AddPipelineModal />
    </div>
  );
};

export default AddDealModel;
