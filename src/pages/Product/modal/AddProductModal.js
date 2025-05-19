import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import ImageWithDatabase from "../../../components/common/ImageFromDatabase";
import { fetchCurrencies } from "../../../redux/currency";
import { fetchManufacturer } from "../../../redux/manufacturer";
import { addProduct, updateProduct } from "../../../redux/products";
import { fetchVendors } from "../../../redux/vendor";
import { fetchTaxSetup } from "../../../redux/taxSetUp";
import { fetchProductCategory } from "../../../redux/productCategory";

const AddProductModal = ({ product, setProduct }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.products);

  const [selectedAvatar, setSelectedAvatar] = useState(null); // For profile image upload
  const [searchVendor, setSearchVendor] = useState("");
  const [searchManufacturer, setSearchManufacturer] = useState("");
  const [searchProductCategory, setSearchProductCategory] = useState("");
  const [searchCurrency, setSearchCurrency] = useState("");
  const [searchTax, setSearchTax] = useState("");

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
      unit_price: "",
      code: "",
      category: null,
      is_active: "Y",
      vendor_id: null,
      manufacturer_id: null,
      currency: null,
      onhand: null,
      ordered: null,
      product_image: null,
      commited: null,
      reorder_level: null,
      tax_id: null,
      description: "",
    },
  });
  React.useEffect(() => {
    if (product) {
      reset({
        name: product?.name || "",
        unit_price: product?.unit_price || "",
        code: product?.code || "",
        is_active: product?.is_active || "",
        vendor_id: product?.vendor_id || null,
        category: product?.category || null,
        manufacturer_id: product?.manufacturer_id || null,
        currency: product?.Currency?.id || null,
        onhand: product?.onhand || null,
        ordered: product?.ordered || null,
        product_image: product?.product_image || null,
        commited: product?.commited || null,
        reorder_level: product?.reorder_level || null,
        tax_id: product?.tax_id || null,
        description: product?.description || "",
      });
    } else {
      reset({
        name: "",
        unit_price: "",
        code: "",
        is_active: "",
        vendor_id: null,
        category: null,
        manufacturer_id: null,
        currency: null,
        onhand: null,
        ordered: null,
        product_image: null,
        commited: null,
        reorder_level: null,
        tax_id: null,
        description: "",
      });
    }
  }, [product]);

  React.useEffect(() => {
    if (searchVendor) dispatch(fetchVendors({ search: searchVendor }));
  }, [searchVendor]);
  React.useEffect(() => {
    if (searchManufacturer) dispatch(fetchManufacturer({ search: searchManufacturer }));
  }, [searchManufacturer]);
  React.useEffect(() => {
    if (searchProductCategory) dispatch(fetchProductCategory({ search: searchProductCategory }));
  }, [searchProductCategory]);
  React.useEffect(() => {
    if (searchCurrency) dispatch(fetchCurrencies({ search: searchCurrency }));
  }, [searchCurrency]);
  React.useEffect(() => {
    if (searchTax) dispatch(fetchTaxSetup({ search: searchTax }));
  }, [searchTax]);
  useEffect(() => {
    dispatch(fetchVendors());
    dispatch(fetchManufacturer());
    dispatch(fetchCurrencies());
    dispatch(fetchTaxSetup());
    dispatch(fetchProductCategory());
  }, [dispatch]);

  const { vendor, loading: loadingVendor } = useSelector(
    (state) => state.vendor
  );
  const { manufacturers, loading: loadingMnf } = useSelector(
    (state) => state.manufacturers
  );
  const { currencies, loading: loadingCurrency } = useSelector(
    (state) => state.currency
  );
  const { taxs, loading: loadingTAx } = useSelector((state) => state.taxs);
  const { productCategories, loading: loadingCat } = useSelector(
    (state) => state.productCategories
  );

  const vendorList = vendor?.data?.map((emnt) => ({
    value: emnt.id,
    label: emnt.name,
  }));
  const manufacturerList = manufacturers?.data?.map((emnt) => ({
    value: emnt.id,
    label: emnt.name,
  }));
  const CurrencyList = currencies.map((emnt) => ({
    value: emnt.id,
    label: emnt.name,
  }));
  const TaxList = taxs.map((emnt) => ({
    value: emnt.id,
    label: emnt.name + " ( " + emnt.rate + "% )",
  }));
  const CategoryList = productCategories.map((emnt) => ({
    value: emnt.id,
    label: emnt.name,
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
        formData.append(key, data[key]);
      }
    });

    if (selectedAvatar) {
      formData.append("product_image", selectedAvatar);
    }
    // formData.append("email_opt_out",watch("email_opt_out") === true ? "Y" : "N")

    try {
      product
        ? await dispatch(
            updateProduct({ id: product?.id, productData: formData })
          )
        : await dispatch(addProduct(formData)).unwrap();
      closeButton.click();
      reset();
      setSelectedAvatar(null);
    } catch (error) {
      closeButton.click();
    }
  };
  React.useEffect(() => {
    const offcanvasElement = document.getElementById(
      "offcanvas_add_edit_product"
    );
    if (offcanvasElement) {
      const handleModalClose = () => {
        setSelectedAvatar(null);
        setProduct();
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
      id="offcanvas_add_edit_product"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="fw-semibold">
          {product ? "Update " : "Add New"} Product
        </h5>
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
              <div className="profile-pic-upload ">
                <div className="profile-pic">
                  {selectedAvatar ? (
                    <img
                      src={URL.createObjectURL(selectedAvatar)}
                      alt="Avatar Preview"
                      className="img-fluid h-100 w-100"
                    />
                  ) : product?.product_image ? (
                    <ImageWithDatabase
                      src={product?.product_image}
                      alt="image"
                      className="w-100 h-100"
                    />
                  ) : (
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
                  Product Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  {...register("name", {
                    required: "Name is required",
                  })}
                />
                {errors.name && (
                  <small className="text-danger">{errors.name.message}</small>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="col-md-6">
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="col-form-label">
                    Code <span className="text-danger">*</span>
                  </label>
                </div>
                <input
                  type="text"
                  className="form-control"
                  {...register("code", { required: "code is required" })}
                />
                {errors.code && (
                  <small className="text-danger">{errors.code.message}</small>
                )}
              </div>
            </div>
            {/* Category */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Category <span className="text-danger">*</span>
                </label>
                <Controller
                  name="category"
                  rules={{ required: "Category is required!" }} // Make the field required
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={CategoryList}
                       isLoading={loadingCat}
                      onInputChange={(e) => setSearchProductCategory(e)}
                      placeholder="Choose"
                      className="select2"
                      classNamePrefix="react-select"
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption?.value || null)
                      } // Send only value
                      value={
                        watch("category") &&
                        CategoryList?.find(
                          (option) => option.value === watch("category")
                        )
                      }
                      styles={{
                        menu: (provided) => ({
                          ...provided,
                          zIndex: 9999, // Ensure this value is higher than the icon's z-index
                        }),
                      }}
                    />
                  )}
                />
                {errors.category && (
                  <small className="text-danger">
                    {errors.category.message}
                  </small>
                )}
              </div>
            </div>
            {/* Vendor */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Vendor <span className="text-danger">*</span>
                </label>
                <Controller
                  name="vendor_id"
                  rules={{ required: "Vendor is required!" }} // Make the field required
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={vendorList}
                      isLoading={loadingVendor}
                      onInputChange={(e) => setSearchVendor(e)}
                      placeholder="Choose"
                      className="select2"
                      classNamePrefix="react-select"
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption?.value || null)
                      } // Send only value
                      value={
                        watch("vendor_id") &&
                        vendorList?.find(
                          (option) => option.value === watch("vendor_id")
                        )
                      }
                      styles={{
                        menu: (provided) => ({
                          ...provided,
                          zIndex: 9999, // Ensure this value is higher than the icon's z-index
                        }),
                      }}
                    />
                  )}
                />
                {errors.vendor_id && (
                  <small className="text-danger">
                    {errors.vendor_id.message}
                  </small>
                )}
              </div>
            </div>

            {/* Manufacturer */}
            <div className="col-md-6">
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
                       isLoading={loadingMnf}
                      onInputChange={(e) => setSearchManufacturer(e)}
                      placeholder="Choose"
                      className="select2"
                      classNamePrefix="react-select"
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption?.value || null)
                      } // Send only value
                      value={
                        watch("manufacturer_id") &&
                        manufacturerList?.find(
                          (option) => option.value === watch("manufacturer_id")
                        )
                      }
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
            </div>

            {/* unit_price */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Unit Price <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  {...register("unit_price", {
                    required: "unit_price is required",
                  })}
                />
                {errors.unit_price && (
                  <small className="text-danger">
                    {errors.unit_price.message}
                  </small>
                )}
              </div>
            </div>

            {/* Currency */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Currency <span className="text-danger">*</span>
                </label>
                <Controller
                  name="currency"
                  rules={{ required: "Currency is required!" }} // Make the field required
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={CurrencyList}
                       isLoading={loadingCurrency}
                      onInputChange={(e) => setSearchCurrency(e)}
                      placeholder="Choose"
                      className="select2"
                      classNamePrefix="react-select"
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption?.value || null)
                      } // Send only value
                      value={
                        watch("currency") &&
                        CurrencyList?.find(
                          (option) => option.value === watch("currency")
                        )
                      }
                      styles={{
                        menu: (provided) => ({
                          ...provided,
                          zIndex: 9999, // Ensure this value is higher than the icon's z-index
                        }),
                      }}
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

            {/* Tex id */}
            {/* <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">Tax (%)</label>
                <input
                  type="number"
                  className="form-control"
                  {...register("tax_id")}
                />
              </div>
                  </div> */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Tax <span className="text-danger">*</span>
                </label>
                <Controller
                  name="tax_id"
                  rules={{ required: "Tax is required!" }} // Make the field required
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={TaxList}
                       isLoading={loadingTAx}
                      onInputChange={(e) => setSearchTax(e)}
                      placeholder="Choose"
                      className="select2"
                      classNamePrefix="react-select"
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption?.value || null)
                      } // Send only value
                      value={
                        (watch("tax_id") &&
                          TaxList?.find(
                            (option) => option.value === watch("tax_id")
                          )) ||
                        ""
                      }
                      styles={{
                        menu: (provided) => ({
                          ...provided,
                          zIndex: 9999, // Ensure this value is higher than the icon's z-index
                        }),
                      }}
                    />
                  )}
                />
                {errors.tax_id && (
                  <small className="text-danger">{errors.tax_id.message}</small>
                )}
              </div>
            </div>

            {/* onhand */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">Onhand</label>
                <input
                  type="number"
                  className="form-control"
                  {...register("onhand")}
                />
              </div>
            </div>

            {/* ordered */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">Ordered</label>
                <input
                  type="number"
                  className="form-control"
                  {...register("ordered")}
                />
              </div>
            </div>
            {/* commited */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">Commited</label>
                <input
                  type="number"
                  className="form-control"
                  {...register("commited")}
                />
              </div>
            </div>

            {/* Reorder Level */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">Reorder Level</label>
                <input
                  type="number"
                  className="form-control"
                  {...register("reorder_level")}
                />
              </div>
            </div>

            {/* Description */}
            <div className="col-md-12">
              <div className="mb-0">
                <label className="col-form-label">Description</label>
                <textarea
                  className="form-control"
                  rows={5}
                  {...register("description")}
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
              {product
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

export default AddProductModal;
