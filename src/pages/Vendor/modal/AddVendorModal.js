import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { addUser, fetchUsers } from "../../../redux/manage-user";
import { fetchRoles } from "../../../redux/roles";
import { addVendor, fetchVendors, updateVendor } from "../../../redux/vendor";
import ImageWithDatabase from "../../../components/common/ImageFromDatabase";
import { fetchCountries } from "../../../redux/country";
import { fetchMappedStates } from "../../../redux/mappedState";

const AddVendorModal = ({vendor,setVendor}) => {
  const dispatch = useDispatch();

  // Access roles and user creation state from Redux
  // const { loading } = useSelector((state) => state.vendor);
  const { users } = useSelector((state) => state.users);
  const {  loading } = useSelector((state) => state.vendor);

  const [selectedAvatar, setSelectedAvatar] = useState(null); // For profile image upload

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
      phone: "",
      email: "",
      is_active: "Y",
      account_owner: null,
      website: "",
      glaccount: "",
      profile_img: null,
      category: "",
      email_opt_out: false,
      billing_street: "",
      billing_city: "",
      billing_state: null,
      billing_zipcode: "",
      billing_country: null,
      description: "",
      
    },
  });
React.useEffect(() => {
    if (vendor) {
      reset({
        name: vendor?.name || "",
        phone: vendor?.phone || "",
        email: vendor?.email || "",
        is_active: vendor?.is_active || "",
        account_owner: vendor?.account_owner || null,
        website: vendor?.website || "",
        glaccount: vendor?.glaccount || "",
        profile_img: vendor?.profile_img || null,
        category: vendor?.category || "",
        email_opt_out: vendor?.email_opt_out == "Y" ? true : false || "", 
        billing_street: vendor?.billing_street || "",
        billing_city: vendor?.billing_city || "",
        billing_state: vendor?.billing_state || null,
        billing_zipcode: vendor?.billing_zipcode || "",
        billing_country: vendor?.billing_country || null,
        description: vendor?.description || "",
 });
    } else {
      reset({
        name: "",
        phone: "",
        email: "",
        is_active: "",
        account_owner:null,
        website: "",
        glaccount: "",
        profile_img: null,
        category: "",
        email_opt_out: false,
        billing_street: "",
        billing_city: "",
        billing_state: null,
        billing_zipcode: "",
        billing_country: null,
        description: "",
       
      });
    }
  }, [vendor]);

  const country_id = watch("billing_country")
  useEffect(() => {
     dispatch(fetchVendors());
     dispatch(fetchUsers())
     dispatch(fetchCountries());
  }, [dispatch]);

  React.useEffect(() => {
    country_id  &&  dispatch(fetchMappedStates(country_id));
  }, [dispatch, country_id]);
  
  const { countries } = useSelector( (state) => state.countries  );
  const { mappedStates } = useSelector( (state) => state.mappedStates );

  const countryList = countries.map((emnt) => ({
    value: emnt.id,
    label: emnt.code + emnt.name,
  }));
  const stateList = mappedStates?.data?.map((emnt) => ({
    value: emnt.id,
    label:emnt.name,
  }));
  const usersList = users?.data?.map((emnt) => ({
    value: emnt.id,
    label: emnt.full_name,
  }));

  // Handle avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedAvatar(file);
    }
  };

  const onSubmit = async (data) => {
    const closeButton = document.getElementById("close_add_user");
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== null) {
        formData.append(key,key === "email_opt_out" ? watch("email_opt_out") === true ? "Y" : "N" : data[key]);
      }
    });

    if (selectedAvatar) {
      formData.append("profile_img", selectedAvatar );
    }
    // formData.append("email_opt_out",watch("email_opt_out") === true ? "Y" : "N")

    try {
      vendor ? await dispatch(updateVendor({id :vendor?.id, vendorData:formData}))
      : await dispatch(addVendor(formData)).unwrap();
      closeButton.click();
      reset();
      setSelectedAvatar(null);
    } catch (error) {
      closeButton.click();
    }
  };
  React.useEffect(() => {
        const offcanvasElement = document.getElementById("offcanvas_add_vendor");
        if (offcanvasElement) {
          const handleModalClose = () => {
            setSelectedAvatar(null)
            setVendor();
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
      id="offcanvas_add_vendor"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="fw-semibold">{vendor ? "Update " : "Add New"} Vendor</h5>
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
          {/* <input type="hidden" {...register("entityType", { value: "user" })} />
          <input type="hidden" {...register("username", { value: watch('email') })} /> */}
          <div className="row">
            {/* Profile Image Upload */}
            <div className="col-md-12">
              <div className="profile-pic-upload">
                <div className="profile-pic">
                  {selectedAvatar ? (
                    <img
                      src={URL.createObjectURL(selectedAvatar)}
                      alt="Avatar Preview"
                      className="img-fluid"
                    />
                  ) : vendor?.profile_img ? 
                    <ImageWithDatabase 
                      src={vendor?.profile_img}
                      alt="image" />
                  :(
                    <span>
                      <i className="ti ti-photo" />
                    </span>
                  )}
                </div>
                <div className="upload-content">
                  <div className="upload-btn">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                    <span>
                      <i className="ti ti-file-broken" />
                      Upload File
                    </span>
                  </div>
                  <p>JPG, GIF, or PNG. Max size of 800K</p>
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Full Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  {...register("name", {
                    required: "Name is required",
                  })}
                />
                {errors.full_name && (
                  <small className="text-danger">
                    {errors.name.message}
                  </small>
                )}
              </div>
            </div>


            {/* Email */}
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
                                                <input
                                                  type="checkbox"
                                                  className="form-check-input"
                                                  {...field}
                                                  checked={field.value}
                                                />
                                              )}
                                            />
                
                                            {/* <label htmlFor="user" className="checktoggle" /> */}
                                          </div>
                                          </div>
                <input
                  type="text"
                  className="form-control"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <small className="text-danger">{errors.email.message}</small>
                )}
              </div>
            </div>

            {/* Owner */}
            <div className="col-md-6">
                <div className="mb-3">
                  <label className="col-form-label">
                   Account Owner <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="account_owner"
                    rules={{ required: "Account Owner is required!" }} // Make the field required
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
                        value={ watch("account_owner") && usersList?.find(
                          (option) => option.value === watch("account_owner")
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
                  {errors.account_owner && (
                    <small className="text-danger">
                      {errors.account_owner.message}
                    </small>
                  )}
                </div>
              </div>

            {/* Phone */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Phone <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  {...register("phone", {
                    required: "Phone number is required",
                  })}
                />
                {errors.phone && (
                  <small className="text-danger">{errors.phone.message}</small>
                )}
              </div>
            </div>

            {/* Website */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">Website</label>
                <input
                  type="text"
                  className="form-control"
                  {...register("website", {
                    required: "Website is required",
                  })}
                />
              </div>
              {errors.website && (
                  <small className="text-danger">
                    {errors.website.message}
                  </small>
                )}
            </div>
            {/* GLAccount */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">GL Account</label>
                <input
                  type="text"
                  className="form-control"
                  {...register("glaccount" , {
                    required: "Gl Account is required",
                  })}
                />
              </div>
              {errors.glaccount && (
                  <small className="text-danger">
                    {errors.glaccount.message}
                  </small>
                )}
            </div>
              {/* Category */}
              <div className="col-md-6">
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
            </div>

            {/* Billing Street */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Billing Street <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  {...register("billing_street")}
                />
              </div>
            </div>

            {/* Billing Country */}
            <div className="col-md-6">
                <div className="mb-3">
                  <label className="col-form-label">
                  Billing Country
                  </label>
                  <Controller
                    name="billing_country"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={countryList}
                        placeholder="Choose"
                        className="select2"
                        classNamePrefix="react-select"
                        onChange={(selectedOption) =>{
                          field.onChange(selectedOption?.value || null)
                          setValue("billing_state",null,{ shouldValidate: true, shouldDirty: true })
                        }} // Send only value
                        value={watch("billing_country") && countryList?.find(
                          (option) => option.value === watch("billing_country")
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
                </div>
              </div>

            {/* Billing State */}
            <div className="col-md-6">
                <div className="mb-3">
                  <label className="col-form-label">
                   Billing State
                  </label>
                  <Controller
                    name="billing_state"
                    control={control}
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
                        value={ watch("billing_state") && stateList?.find(
                          (option) => option.value === watch("billing_state")
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
                </div>
              </div>

              {/* Billing City */}
             <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                Billing City <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  {...register("billing_city")}
                /></div>
              </div>
            

            
            {/* Billing Zipcode */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                Billing Zipcode<span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className="form-control"
                  {...register("billing_zipcode")}/>
               
              </div>
            </div>

             {/* Description */}
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
              {vendor ? loading ? "Updating ....": "Update" : loading ? "Creating..." : "Create"}
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

export default AddVendorModal;
