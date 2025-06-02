import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { fetchContacts } from "../../../../redux/contacts/contactSlice";
import { addTaxSetup, updateTaxSetup } from "../../../../redux/taxSetUp";

const ManageTaxModal = ({ tax, setTax }) => {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const { loading } = useSelector((state) => state.taxs);

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
      rate: "",
      category: "",
      is_active: "Y",
      validFrom: new Date(),
      external_code: "",
      validTo: new Date(),
      account_id: 0,
      account_name: "",
      effect_date: new Date(),
    },
  });
  React.useEffect(() => {
    if (tax) {
      reset({
        name: tax?.name || "",
        rate: tax?.rate || "",
        category: tax?.category || "",
        is_active: tax?.is_active || "",
        validFrom: new Date(tax?.validFrom) || new Date(),
        validTo: new Date(tax?.validTo) || new Date(),
        account_id: 0,
        account_name: "",
        external_code: tax?.external_code || "",
        effect_date: new Date(tax?.effect_date) || new Date(),
      });
    } else {
      reset({
        name: "",
        rate: "",
        category: "",
        is_active: "",
        external_code: "",
        validFrom: new Date(),
        validTo: new Date(),
        account_id: 0,
        account_name: "",
        effect_date: new Date(),
      });
    }
  }, [tax]);
  useEffect(() => {
    dispatch(fetchContacts(searchValue));
  }, [dispatch, searchValue]);

  const { contacts, loading: loadingContact } = useSelector(
    (state) => state.contacts
  );

  const contactlist = contacts?.data?.map((contact) => ({
    value: contact.id,
    label: `${contact.firstName.trim()} ${contact.lastName.trim()}`,
  }));

  const onSubmit = async (data) => {
    const closeButton = document.getElementById("close_tax_setup");
    // const formData = new FormData();
    // console.log("Submit Data : ", data)
    // Object.keys(data).forEach((key) => {
    //   if(key=== "effect_date"){
    //     formData.append(key, data[key].toISOString());
    //   }
    //   else if(key === "validFrom"){
    //     formData.append(key, data[key].toISOString());
    //   }
    //   else if(key === "validTo"){
    //     formData.append(key, data[key].toISOString());
    //   }
    //   else if (data[key] !== null) {
    //     formData.append(key, data[key]);
    //   }
    // });
    const formData = {
      ...data,
      validFrom: data?.validFrom?.toISOString(),
      validTo: data?.validTo?.toISOString(),
      effect_date: data?.effect_date.toISOString(),
    };

    try {
      tax
        ? await dispatch(updateTaxSetup({ id: tax?.id, taxData: formData }))
        : await dispatch(addTaxSetup(formData)).unwrap();
      closeButton.click();
      reset();
    } catch (error) {
      closeButton.click();
    }
  };
  React.useEffect(() => {
    const offcanvasElement = document.getElementById(
      "offcanvas_add_edit_tax_setup"
    );
    if (offcanvasElement) {
      const handleModalClose = () => {
        setTax();
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
      id="offcanvas_add_edit_tax_setup"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="fw-semibold">{tax ? "Update " : "Add New"} tax</h5>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          id="close_tax_setup"
        >
          <i className="ti ti-x" />
        </button>
      </div>
      <div className="offcanvas-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* <input type="hidden" {...register("entityType", { value: "user" })} />
          <input type="hidden" {...register("username", { value: watch('email') })} /> */}
          <div className="row">
            {/* Full Name */}
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
                {errors.full_name && (
                  <small className="text-danger">{errors.name.message}</small>
                )}
              </div>
            </div>
            {/* Email */}
            <div className="col-md-6">
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="col-form-label">
                    Category <span className="text-danger">*</span>
                  </label>
                </div>
                <input
                  type="text"
                  className="form-control"
                  {...register("category", {
                    required: "category is required",
                  })}
                />
                {errors.category && (
                  <small className="text-danger">
                    {errors.category.message}
                  </small>
                )}
              </div>
            </div>
            {/* Manufacturer */}
            {/* <div className="col-md-6">
                <div className="mb-3">
                  <label className="col-form-label">
                  Manufacturer <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="manufacturer_id"
                    rules={{ required: "Manufacturer is required!" }} // Make the field required
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={manufacturerList}
                        placeholder="Choose"
                        className="select2"
                        classNamePrefix="react-select"
                        onChange={(selectedOption) =>
                          field.onChange(selectedOption?.value || null)
                        } // Send only value
                        value={ watch("manufacturer_id") && manufacturerList?.find(
                          (option) => option.value === watch("manufacturer_id")
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
                  {errors.manufacturer_id && (
                    <small className="text-danger">
                      {errors.manufacturer_id.message}
                    </small>
                  )}
                </div>
              </div> */}
            {/* rate */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Rate <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  {...register("rate", {
                    required: "rate is required",
                    min: {
                      value: 0,
                      message: "Rate must be at least 0%",
                    },
                    max: {
                      value: 100,
                      message: "Rate cannot exceed 100%",
                    },
                  })}
                />
                {errors.rate && (
                  <small className="text-danger">{errors.rate.message}</small>
                )}
              </div>
            </div>
            {/* Account */}
            {/* <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Account <span className="text-danger">*</span>
                </label>
                <Controller
                  name="account_id"
                  control={control}
                  rules={{ required: "Account is required" }}
                  render={({ field }) => {
                    const selectedValue = contactlist?.find(
                      (contact) => contact.value === field.value
                    );
                   return( <Select
                      {...field}
                      options={contactlist}
                      isSearchable
                      onInputChange={(e) => setSearchValue(e)}
                      className="select2"
                      isLoading={loadingContact}
                      classNamePrefix="react-select"
                      placeholder="Choose Account"
                      value={
                        selectedValue
                          ? {
                              label: selectedValue?.label,
                              value: selectedValue.value,
                            }
                          : ""
                      }
                      onChange={(selectedOption) =>{
                        field.onChange(selectedOption.value);
                        setValue("account_name",selectedOption?.label)}
                      } 
                    />)
                  }}
                />
                {errors.contactIds && (
                  <small className="text-danger">
                    {errors.contactIds.message}
                  </small>
                )}
              </div>
            </div> */}
            {/*Effect Dates */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Effect Date <span className="text-danger">*</span>
                </label>
                <DatePicker
                  className="form-control"
                  selected={watch("effect_date")}
                  onChange={(date) => setValue("effect_date", date)}
                  dateFormat="yyyy-MM-dd"
                />
              </div>
            </div>
            {/* external_code */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">External Code</label>
                <input
                  type="text"
                  className="form-control"
                  {...register("external_code")}
                />
              </div>
            </div>
            {/*Valid From */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Valid From<span className="text-danger">*</span>
                </label>
                <DatePicker
                  className="form-control"
                  selected={watch("validFrom")}
                  onChange={(date) => setValue("validFrom", date)}
                  dateFormat="yyyy-MM-dd"
                />
              </div>
            </div>{" "}
            {/* Valid To */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Valid To <span className="text-danger">*</span>
                </label>
                <DatePicker
                  className="form-control"
                  selected={watch("validTo")}
                  onChange={(date) => setValue("validTo", date)}
                  dateFormat="yyyy-MM-dd"
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
              {tax
                ? loading
                  ? "Updating ...."
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

export default ManageTaxModal;
