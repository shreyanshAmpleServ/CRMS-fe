import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { addCases, fetchCaseReason, fetchCasesCode, updateCases } from "../../../redux/cases";
import { fetchContacts } from "../../../redux/contacts/contactSlice";
import { fetchDeals } from "../../../redux/deals";
import { fetchUsers } from "../../../redux/manage-user";
import { fetchProducts } from "../../../redux/products";

const AddCaseModal = ({cases,setCases}) => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);
  const { cashNumber, loading } = useSelector((state) => state.cases);

  // React Hook Form setup
  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      case_number: "",
      case_owner_id: null,
      product_id: null,
      case_status: "",
      case_type: "",
      case_priority: "",
      case_origin: "",
      case_reason: null,
      contact_id: null,
      subject: "",
      account_id: null,
      deal_id: null,
      reported_by: null,
      email: "",
      phone: "",
      description: "",
      is_active: "Y",
    },
  });
React.useEffect(() => {
    if (cases) {
      reset({
        name: cases?.name || "",
        case_number: cases?.case_number || "",
        case_owner_id: cases?.case_owner_id || null,
        product_id: cases?.product_id || null,
        case_status: cases?.case_status || "",
        case_type: cases?.case_type || "",
        case_priority: cases?.case_priority || "",
        case_origin: cases?.case_origin || "",
        case_reason: cases?.case_reason || null, 
        contact_id: cases?.contact_id || null,
        subject: cases?.subject || "",
        account_id: cases?.account_id || null,
        deal_id: cases?.deal_id || null,
        reported_by: cases?.reported_by || null,
        email: cases?.email || "",
        phone: cases?.phone || "",
        description: cases?.description || "",
        is_active: cases?.is_active || "Y",
      });
    } else {
      reset({
        name: "",
        is_active: "Y",
        case_number: "",
        case_owner_id: null,
        product_id:null,
        case_status: "",
        case_type: "",
        case_priority: "",
        case_origin: "",
        case_reason: null,
        contact_id: null,
        subject: "",
        account_id: null,
        deal_id: null,
        reported_by: null,
        email: "",
        phone: "",
        description: "",
      });
    }
  }, [cases]);

  useEffect(() => {
     dispatch(fetchProducts());
     dispatch(fetchUsers())
     dispatch(fetchDeals())
     dispatch(fetchContacts(""))
     dispatch(fetchCaseReason())
     dispatch(fetchCasesCode())
  }, [dispatch]);

  useEffect(()=>{
    !cases && setValue("case_number",cashNumber)
  },[cashNumber,cases])

  const { products } = useSelector((state) => state.products);
  const { deals } = useSelector((state) => state.deals);
  const { contacts } = useSelector((state) => state.contacts);
  const { caseReason } = useSelector((state) => state.cases);

  const usersList = users?.data?.map((emnt) => ({
    value: emnt.id,
    label: emnt.full_name,
  }));
  const productsList = products?.data?.map((emnt) => ({
    value: emnt.id,
    label: emnt.name,
  }));
  const dealsList = deals?.data?.map((emnt) => ({
    value: emnt.id,
    label: emnt.dealName,
  }));
  const contactsList = contacts?.data?.map((emnt) => ({
    value: emnt.id,
    label: emnt.firstName +" "+ emnt.lastName,
  }));
  const caseReasonList = caseReason?.map((emnt) => ({
    value: emnt.id,
    label: emnt.name,
  })) || [];

 

  const onSubmit = async (data) => {
    const closeButton = document.getElementById("close_add_user");
    const FinalData = {...data}
    if (cases)  FinalData.id = cases.id 
    try {
      cases ? await dispatch(updateCases(FinalData))
      : await dispatch(addCases(FinalData)).unwrap();
      closeButton.click();
      reset();
    } catch (error) {
      closeButton.click();
    }
  };
  React.useEffect(() => {
        const offcanvasElement = document.getElementById("offcanvas_add_edit_case");
        if (offcanvasElement) {
          const handleModalClose = () => {
            setCases();
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
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="offcanvas_add_edit_case"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="fw-semibold">{cases ? "Update " : "Add New"} Cases</h5>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          id="close_add_user"
        >
          <i className="ti ti-x" />
        </button>
      </div>
      <div className="offcanvas-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
        
            {/* Name */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  {...register("name", {
                    required: "Name is required",
                  })}
                />
                {errors.name && (
                  <small className="text-danger">
                    {errors.name.message}
                  </small>
                )}
              </div>
            </div>

            {/* Case Number */}
           <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">Case Number <span className="text-danger">*</span></label>
                <input
                  type="text"
                  disabled
                  value={watch("case_number") || ""}
                  className="form-control"
                  {...register("case_number", {
                    required: "Case number is required",
                  })}
                />
              </div>
              {errors.case_number && (
                  <small className="text-danger">
                    {errors.case_number.message}
                  </small>
                )}
            </div>
         
            {/* Case Owner */}
            <div className="col-md-6">
                <div className="mb-3">
                  <label className="col-form-label">
                   Case Owner 
                   <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="case_owner_id"
                    rules={{ required: "Case Owner is required!" }} // Make the field required
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={usersList}
                        placeholder="Choose"
                        className="select2"
                        classNamePrefix="react-select"
                        onChange={(selectedOption) =>
                          field.onChange(selectedOption?.value || null)
                        } // Send only value
                        value={ watch("case_owner_id") && usersList?.find(
                          (option) => option.value === watch("case_owner_id")
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
                  {errors.case_owner_id && (
                    <small className="text-danger">
                      {errors.case_owner_id.message}
                    </small>
                  )}
                </div>
              </div>

            {/* Product */}
            <div className="col-md-6">
                <div className="mb-3">
                  <label className="col-form-label">
                   Product <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="product_id"
                    rules={{ required: "Product is required!" }} // Make the field required
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={productsList}
                        placeholder="Choose"
                        className="select2"
                        classNamePrefix="react-select"
                        onChange={(selectedOption) =>
                          field.onChange(selectedOption?.value || null)
                        } // Send only value
                        value={ watch("product_id") && productsList?.find(
                          (option) => option.value === watch("product_id")
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
                  {errors.product_id && (
                    <small className="text-danger">
                      {errors.product_id.message}
                    </small>
                  )}
                </div>
              </div>

            {/* Case Status */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">Case Status  <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  {...register("case_status", {
                    required: "Case status is required",
                  })}
                />
              </div>
              {errors.case_status && (
                  <small className="text-danger">
                    {errors.case_status.message}
                  </small>
                )}
            </div>
            {/* Case Type */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">Case Type  <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  {...register("case_type" , {
                    required: "Case type is required",
                  })}
                />
                 {errors.case_type && (
                  <small className="text-danger">
                    {errors.case_type.message}
                  </small>
                )}
              </div>
            </div>
            {/* Case Priority */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">Case Priority <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  {...register("case_priority", {
                    required: "Case priority is required",
                  } )}
                />
                 {errors.case_priority && (
                  <small className="text-danger">
                    {errors.case_priority.message}
                  </small>
                )}
              </div>
            </div>
            {/* Case Origin */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">Case Origin  <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  {...register("case_origin" , {
                    required: "Case origin is required",
                  })}
                />
                 {errors.case_origin && (
                  <small className="text-danger">
                    {errors.case_origin.message}
                  </small>
                )}
              </div>
            </div>
              {/* Deals */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="col-form-label">
                   Deals 
                   {/* <span className="text-danger">*</span> */}
                  </label>
                  <Controller
                    name="deal_id"
                    // rules={{ required: "Deal is required!" }} // Make the field required
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={dealsList}
                        placeholder="Choose"
                        className="select2"
                        classNamePrefix="react-select"
                        onChange={(selectedOption) =>
                          field.onChange(selectedOption?.value || null)
                        } // Send only value
                        value={ watch("deal_id") && dealsList?.find(
                          (option) => option.value === watch("deal_id")
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
                  {errors.deal_id && (
                    <small className="text-danger">
                      {errors.deal_id.message}
                    </small>
                  )}
                </div>
              </div>
            {/* Contacts */}
            <div className="col-md-6">
                <div className="mb-3">
                  <label className="col-form-label">
                   Contact
                    {/* <span className="text-danger">*</span> */}
                  </label>
                  <Controller
                    name="contact_id"
                    // rules={{ required: "Contact is required!" }} // Make the field required
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={contactsList}
                        placeholder="Choose"
                        className="select2"
                        classNamePrefix="react-select"
                        onChange={(selectedOption) =>
                          field.onChange(selectedOption?.value || null)
                        } // Send only value
                        value={ watch("contact_id") && contactsList?.find(
                          (option) => option.value === watch("contact_id")
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
                  {errors.contact_id && (
                    <small className="text-danger">
                      {errors.contact_id.message}
                    </small>
                  )}
                </div>
              </div>
            {/* Case Reason */}
            <div className="col-md-6">
                <div className="mb-3">
                  <label className="col-form-label">
                   Case Reason
                    {/* <span className="text-danger">*</span> */}
                  </label>
                  <Controller
                    name="case_reason"
                    // rules={{ required: "Case reason is required!" }} // Make the field required
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={caseReasonList}
                        placeholder="Choose"
                        className="select2"
                        classNamePrefix="react-select"
                        onChange={(selectedOption) =>
                          field.onChange(selectedOption?.value || null)
                        } // Send only value
                        value={ watch("case_reason") && caseReasonList?.find(
                          (option) => option.value === watch("case_reason")
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
                  {/* {errors.case_reason && (
                    <small className="text-danger">
                      {errors.case_reason.message}
                    </small>
                  )} */}
                </div>
              </div>

            {/* Phone */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Phone 
                  {/* <span className="text-danger">*</span> */}
                </label>
                <input
                  type="text"
                  className="form-control"
                  {...register("phone",
                    //  {required: "Phone number is required", }
                  )}
                />
                {/* {errors.phone && (
                  <small className="text-danger">{errors.phone.message}</small>
                )} */}
              </div>
            </div>
               {/* Email */}
               <div className="col-md-6">
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                <label className="col-form-label">
                  Email 
                  {/* <span className="text-danger">*</span> */}
                </label> </div>
                <input
                  type="text"
                  className="form-control"
                  {...register("email", 
                    // { required: "Email is required" }
                  )}
                />
                {/* {errors.email && (
                  <small className="text-danger">{errors.email.message}</small>
                )} */}
              </div>
            </div>

            {/* subject */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">Subject</label>
                <input
                  type="text"
                  className="form-control"
                  {...register("subject" )}
                />
              </div>
            </div>
            {/* reported by */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">Reported by</label>
                <input
                  type="text"
                  className="form-control"
                  {...register("reported_by" )}
                />
              </div>
            </div>
              {/* Category */}
              {/* <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">Category</label>
                <input
                  type="text"
                  className="form-control"
                  {...register("category", {
                    required: "Category is required",
                  })}
                />
              </div>
              {errors.category && (
                  <small className="text-danger">
                    {errors.category.message}
                  </small>
                )}
            </div> */}

             {/* Description */}
            <div className="col-md-12">
                      <div className="mb-0">
                        <label className="col-form-label">
                          Description
                          {/*  <span className="text-danger">*</span> */}
                        </label>
                        <textarea
                          className="form-control"
                          rows={5}
                          {...register("description", 
                            // { required: "Description is required",}
                          )}
                        />
                      </div>
                    </div>
          </div>

          <div className="d-flex mt-3 align-items-center justify-content-end">
            <button
              type="button"
              className="btn btn-light me-2"
              data-bs-dismiss="offcanvas"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {cases ? loading ? "Updating ....": "Update" : loading ? "Creating..." : "Create"}
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

export default AddCaseModal;
