import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { Link } from "react-router-dom";
import Select from "react-select";

import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanies } from "../../../redux/companies";
import { addContact, updateContact } from "../../../redux/contacts/contactSlice";
import { fetchCountries } from "../../../redux/country";
import { fetchCurrencies } from "../../../redux/currency";
import { fetchDeals } from "../../../redux/deals";
import { fetchIndustries } from "../../../redux/industry";
import { fetchUsers } from "../../../redux/manage-user";
import { fetchMappedStates } from "../../../redux/mappedState";
import { fetchSources } from "../../../redux/source";

const AddContactModal = ({contact,setSelectedContact}) => {
  const [selectedLogo, setSelectedLogo] = useState();
  const languages = [
    { value: "Choose", label: "Choose" },
    { value: "English", label: "English" },
    { value: "Arabic", label: "Arabic" },
    { value: "Chinese", label: "Chinese" },
    { value: "Hindi", label: "Hindi" },
  ];
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    register,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      jobTitle: "",
      company_id: null,
      email: "",
      phone1: "",
      phone2: "",
      fax: "",
      deal_id: null,
      dateOfBirth: new Date(),
      reviews: null,
      owner: null,
      source: null,
      industry: null,
      currency: "",
      language: null,
      description: "",
      emailOptOut: false,
      streetAddress: "",
      city: "",
      state: "",
      country: "",
      zipcode: "",
      socialProfiles: {
        facebook: "",
        linkedin: "",
        twitter: "",
      },
      visibility: "",
      is_active: "",
    },
  });

 React.useEffect(() => {
    if (contact) {
      reset({
        firstName: contact?.firstName || "",
        lastName: contact?.lastName || "",
        jobTitle: contact?.jobTitle || "",
        company_id: contact?.company_id || null,
        email: contact?.email || "",
        phone1: contact?.phone1 || "",
        phone2: contact?.phone2 || "",
        fax: contact?.fax || "",
        deal_id: contact?.deal_id || null,
        dateOfBirth: contact?.dateOfBirth ||new Date(),
        reviews: contact?.reviews || null,
        owner: contact?.owner || null,
        source: contact?.source || null,
        industry: contact?.industry || null,
        currency: contact?.currency || "",
        language: contact?.language || null,
        description: contact?.description || "",
        emailOptOut: contact?.emailOptOut || false ,
        streetAddress: contact?.streetAddress || "",
        city: contact?.city || "",
        state: contact?.state || "",
        country: contact?.country || "",
        zipcode: contact?.zipcode || "",
        visibility: contact?.visibility || "",
        is_active: contact?.is_active || "",

      });
    } else {
      reset({
        firstName: "",
        lastName: "",
        jobTitle: "",
        company_id: null,
        email: "",
        phone1: "",
        phone2: "",
        fax: "",
        deal_id: null,
        dateOfBirth: new Date(),
        reviews: null,
        owner: null,
        source: null,
        industry: null,
        currency: "",
        language: null,
        description: "",
        emailOptOut: false,
        streetAddress: "",
        city: "",
        state: "",
        country: "",
        zipcode: "",
        socialProfiles: {
          facebook: "",
          linkedin: "",
          twitter: "",
        },
        visibility: "",
        is_active: "",
      });
    }
  }, [contact]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedLogo(file);
    }
  };

  const { loading } = useSelector((state) => state.contacts);

  React.useEffect(() => {
    dispatch(fetchIndustries());
    dispatch(fetchCompanies());
    dispatch(fetchDeals());
    dispatch(fetchUsers());
    dispatch(fetchSources());
    dispatch(fetchCountries());
    dispatch(fetchCurrencies())
  }, [dispatch]);
  
  const country_id = watch("country")
    React.useEffect(() => {
      country_id  &&  dispatch(fetchMappedStates(country_id));
    }, [dispatch, country_id]);
    
    const { countries } = useSelector( (state) => state.countries  );
    const { mappedStates } = useSelector( (state) => state.mappedStates );
    const { currencies } = useSelector( (state) => state.currency);
      
    const currencyLists = currencies?.map(i => i?.is_active === "Y" ? ({label:`${i?.code} - ${i?.name}`,value:i?.code}) : null).filter(Boolean) || [];
      
  
    const countryList = countries.map((emnt) => ({
      value: emnt.id,
      label: emnt.code + emnt.name,
    }));
    const stateList = mappedStates?.data?.map((emnt) => ({
      value: emnt.id,
      label:emnt.name,
    }));

  const { industries } = useSelector((state) => state.industries);
  const { sources } = useSelector((state) => state.sources);
  const { deals } = useSelector((state) => state.deals);
  const { companies } = useSelector((state) => state.companies);
  const { users } = useSelector((state) => state.users);

  // Submit Handler
  const onSubmit = async (data) => {
    const formData = new FormData();

    // Append all form fields
    Object?.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined) {
        // Convert complex data to strings if needed
        formData.append(
          key,
          typeof data[key] === "object" ? JSON.stringify(data[key]) : data[key]
        );
      }
    });

    if (selectedLogo) {
      formData.append("image", selectedLogo);
    }
    if(contact){
      formData.append("id",contact.id)
    }
    // formData.append("reviews",data.reviews ? Number(data.reviews) : null)

    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      contact ?  await dispatch(updateContact(formData)).unwrap()
      :await dispatch(addContact(formData)).unwrap();
      closeButton.click();
    } catch (error) {
      closeButton.click();
    }
    finally{
      setSelectedLogo(null)
      setSelectedContact();
    }
  };
   React.useEffect(() => {
      const offcanvasElement = document.getElementById("offcanvas_add");
      if (offcanvasElement) {
        const handleModalClose = () => {
          setSelectedContact();
          setSelectedLogo(null);
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
      id="offcanvas_add"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="fw-semibold">{contact ? "Update" : "Add New"} Contact</h5>
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
                            {selectedLogo ? (
                              <img
                                src={URL.createObjectURL(selectedLogo)}
                                alt="Company Logo"
                                className="preview w-100 h-100 object-fit-cover"
                                // style={{image}}
                              />
                            ) : contact ?   
                            <img
                            src={contact.image}
                            alt="Company Logo"
                            className="preview w-100 h-100 object-fit-cover"
                          />
                            : (
                              <span>
                                <i className="ti ti-photo" />
                              </span>
                            )}
                            <button
                              type="button"
                              className="profile-remove"
                              onClick={() => setSelectedLogo(null)}
                            >
                              <i className="ti ti-x" />
                            </button>
                            {/* <img
                              src="assets/img/profiles/avatar-20.jpg"
                              alt="img"
                              className="preview1"
                            />
                            <button type="button" className="profile-remove">
                              <i className="ti ti-x" />
                            </button> */}
                          </div>
                          <div className="profile-upload-content">
                            <label className="profile-upload-btn">
                              <i className="ti ti-file-broken" /> Upload File
                              <input
                                type="file"
                                accept="image/*"
                                className="input-img"
                                onChange={handleLogoChange}
                              />
                            </label>
                            <p>JPG, GIF or PNG. Max size of 800 Kb</p>
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
                          {...register("firstName", {
                            required: "First name is required",
                          })}
                        />
                        {errors.firstName && (
                          <small className="text-danger">
                            {errors.firstName.message}
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
                          {...register("lastName", {
                            required: "Last name is required",
                          })}
                        />
                        {errors.lastName && (
                          <small className="text-danger">
                            {errors.lastName.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Job Title <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("jobTitle", {
                            required: "Job title is required",
                          })}
                        />
                        {errors.jobTitle && (
                          <small className="text-danger">
                            {errors.jobTitle.message}
                          </small>
                        )}
                      </div>
                    </div>
                    {/* <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">Company Name</label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("company_id")}
                        />
                      </div>
                    </div> */}
                    <div className="col-md-6">
                      <div className="mb-3">
                        <div className="d-flex align-items-center justify-content-between">
                          <label className="col-form-label">Companies</label>
                        </div>
                        <Controller
                          name="company_id"
                          control={control}
                          // rules={{ required: "Company is required" }} // Validation rule
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
                      </div>
                    </div>

                    <div className="col-md-12">
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
                              name="emailOptOut"
                              control={control}
                              render={({ field }) => (
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  {...field}
                                  checked={field.value}
                                />
                              )}
                            />

                            <label htmlFor="user" className="checktoggle" />
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
                          Phone1 <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("phone1", {
                            required: "Phone 1 is required",
                          })}
                        />
                        {errors.phone1 && (
                          <small className="text-danger">
                            {errors.phone1.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">Phone 2</label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("phone2")}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">Fax</label>

                        <input
                          type="text"
                          className="form-control"
                          {...register("fax")}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <div className="d-flex align-items-center justify-content-between">
                          <label className="col-form-label">Deals</label>
                          <Link
                            to="#"
                            className="label-add"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvas_add_2"
                          >
                            <i className="ti ti-square-rounded-plus" />
                            Add New
                          </Link>
                        </div>
                        <Controller
                          name="deal_id"
                          control={control}
                          // rules={{ required: "Deal is required" }} // Validation rule
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
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">Date of Birth</label>
                        <div className="icon-form-end">
                          <span className="form-icon">
                            <i className="ti ti-calendar-event" />
                          </span>
                          <Controller
                            name="dateOfBirth"
                            control={control}
                            render={({ field }) => (
                              <DatePicker
                                {...field}
                                className="form-control"
                                selected={field.value}
                                onChange={field.onChange}
                                dateFormat="dd-MM-yyyy"
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">Reviews </label>
                        <div className="icon-form-end">
                          <span className="form-icon">
                            <i className="ti ti-star" />
                          </span>
                          <input
                            type="number"
                            className="form-control"
                            {...register("reviews")}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Owner <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="owner"
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
                      </div>
                    </div>
                    {/* <div className="col-md-6">
                      <div className="fmb-3">
                        <label className="col-form-label">Owner</label>
                        <SelectWithImage />
                      </div>
                    </div> */}
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
                          Source <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="source"
                          control={control}
                          rules={{ required: "Source is required" }} // Validation rule
                          render={({ field }) => {
                            const selectedSource = sources?.find(
                              (source) => source.id === field.value
                            );
                            return (
                              <Select
                                {...field}
                                className="select"
                                options={sources?.map((i) => ({
                                  label: i?.name,
                                  value: i?.id,
                                }))}
                                classNamePrefix="react-select"
                                value={
                                  selectedSource
                                    ? {
                                        label: selectedSource.name,
                                        value: selectedSource.id,
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
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Indurtry <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="industry"
                          control={control}
                          rules={{ required: "industry is required" }} // Validation rule
                          render={({ field }) => {
                            const selectedIndustry = industries?.find(
                              (industry) => industry.id === field.value
                            );
                            return (
                              <Select
                                {...field}
                                className="select"
                                options={industries?.map((i) => ({
                                  label: i?.name,
                                  value: i?.id,
                                }))}
                                classNamePrefix="react-select"
                                value={
                                  selectedIndustry
                                    ? {
                                        label: selectedIndustry.name,
                                        value: selectedIndustry.id,
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
                      </div>
                    </div>
                    {/* <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Industry <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="industry"
                          rules={{ required: "Industry is required!" }}
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={industries}
                              placeholder="Choose"
                              className="select"
                              classNamePrefix="react-select"
                              onChange={(selectedOption) =>
                                field.onChange(selectedOption?.value || null)
                              } // Send only value
                              value={industries?.find(
                                (option) => option.value === field.value
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
                    </div> */}
                    
                    <div className="col-md-6">
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
                                onChange={(selectedOption) =>
                                  field.onChange(selectedOption.value)
                                }
                                value={currencyLists?.find(
                                  (option) => option.value === field.value
                                )}
                              />
                            )}
                          />

                          {errors.currency && (
                            <small className="text-danger">
                              {errors.currency.message}
                            </small>
                          )}
                    
                      </div>
                      {/* <div className="mb-3">
                        <label className="col-form-label">
                          Currency <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("currency", {
                            required: "Currency is required",
                          })}
                        />
                        {errors.currency && (
                          <small className="text-danger">
                            {errors.currency.message}
                          </small>
                        )}
                      </div> */}
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Language <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="language"
                          rules={{ required: "Language is required!" }}
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={languages}
                              placeholder="English"
                              className="select"
                              classNamePrefix="react-select"
                              onChange={(selectedOption) =>
                                field.onChange(selectedOption?.value || null)
                              } // Send only value
                              value={languages?.find(
                                (option) => option.value === field.value
                              )}
                            />
                          )}
                        />
                        {errors.language && (
                          <small className="text-danger">
                            {errors.language.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-0">
                        <label className="col-form-label">
                          Description <span className="text-danger">*</span>
                        </label>
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
                          {...register("streetAddress", {
                            required: "Street address is required",
                          })}
                        />
                        {errors.streetAddress && (
                          <small className="text-danger">
                            {errors.streetAddress.message}
                          </small>
                        )}
                      </div>
                    </div>
                      {/* Billing Country */}
            <div className="col-md-6">
                <div className="mb-3">
                  <label className="col-form-label">
                 Country
                  </label>
                  <Controller
                    name="country"
                    control={control}
                    rules={{ required: "Country is required" }} // Validation rule
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={countryList}
                        placeholder="Choose"
                        className="select2"
                        classNamePrefix="react-select"
                        onChange={(selectedOption) =>{
                          field.onChange(selectedOption?.value || null)
                          setValue("state",null)
                        }} // Send only value
                        value={watch("country") && countryList?.find(
                          (option) => option.value === watch("country")
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
                {errors.country && (
                          <small className="text-danger">
                            {errors.country.message}
                          </small>
                        )}
                </div>
              </div>

            {/* Billing State */}
            <div className="col-md-6">
                <div className="mb-3">
                  <label className="col-form-label">
                    State
                  </label>
                  <Controller
                    name="state"
                    control={control}
                       rules={{ required: "State is required" }} // Validation rule
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={stateList}
                        placeholder="Choose"
                        className="select2"
                        classNamePrefix="react-select"
                        onChange={(selectedOption) =>
                          field.onChange(selectedOption?.value || null)
                        } 
                        value={ watch("state") && stateList?.find(
                          (option) => option.value === watch("state")
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
                      {errors.state && (
                          <small className="text-danger">
                            {errors.state.message}
                          </small>
                        )}
                </div>
              </div>
                    {/* City */}
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
                    {/* 
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
                                (option) => option.value === field.value
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
                    </div> */}

                    {/* Zipcode  */}
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
                          {...register("socialProfiles.facebook")}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">Skype </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("socialProfiles.skype")}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">Linkedin </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("socialProfiles.linkedin")}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">Twitter</label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("socialProfiles.twitter")}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3 mb-md-0">
                        <label className="col-form-label">Whatsapp</label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("socialProfiles.whatsapp")}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-0">
                        <label className="col-form-label">Instagram</label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("socialProfiles.instagram")}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Social Profile */} {/* Access */}
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
                      {/* <div className="mb-3">
                        <label className="col-form-label">Visibility</label>
                        <div className="d-flex flex-wrap">
                          <div className="me-2">
                            <input
                              type="radio"
                              className="status-radio"
                              id="public"
                              value="public"
                              {...register("visibility")}
                            />
                            <label htmlFor="public">Public</label>
                          </div>
                          <div className="me-2">
                            <input
                              type="radio"
                              className="status-radio"
                              id="private"
                              value="private"
                              {...register("visibility")}
                            />
                            <label htmlFor="private">Private</label>
                          </div>
                          <div
                            data-bs-toggle="modal"
                            data-bs-target="#access_view"
                          >
                            <input
                              type="radio"
                              className="status-radio"
                              id="people"
                              value="people"
                              {...register("visibility")}
                            />
                            <label htmlFor="people">Select People</label>
                          </div>
                        </div>
                      </div> */}
                      <div className="mb-0">
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
            {/* /Access */}
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
              {contact ? loading ? "Updating..." : "Update" : loading ? "Creating..." : "Create"}
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
export default AddContactModal;
