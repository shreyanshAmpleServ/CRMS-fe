import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { fetchUsers } from "../../../redux/manage-user";
import { fetchProducts } from "../../../redux/products";
import { addSolutions, updateSolutions } from "../../../redux/solutions";
import { OrderStatusOptions } from "../../../components/common/selectoption/selectoption";

const AddSolutionModal = ({solution,setSolution}) => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);
  const {  loading } = useSelector((state) => state.solutions);

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
      title: "",
      is_active: "Y",
      solution_owner: null,
      product_id:null,
      status: "",
      question:"",
      answer:""
    },
  });
React.useEffect(() => {
    if (solution) {
      reset({
        title: solution?.title || "",
        is_active: solution?.is_active || "Y",
        solution_owner: solution?.solution_owner || null,
        product_id: solution?.product_id || null,
        status: solution?.status || "",
        question: solution?.question || "",
        answer: solution?.answer || "",
      });
    } else {
      reset({
        title: "",
        is_active: "Y",
        solution_owner: null,
        product_id:null,
        status: "",
        question:"",
        answer:""
       
      });
    }
  }, [solution]);

  useEffect(() => {
     dispatch(fetchProducts());
     dispatch(fetchUsers())
  }, [dispatch]);

  const { products } = useSelector((state) => state.products);

  const usersList = users?.data?.map((emnt) => ({
    value: emnt.id,
    label: emnt.full_name,
  }));
  const productsList = products?.data?.map((emnt) => ({
    value: emnt.id,
    label: emnt.name,
  }));

console.log("Solution : ", solution)
  const onSubmit = async (data) => {
    const closeButton = document.getElementById("close_add_user");
    const FinalData = {...data}
    if (solution)  FinalData.id = solution.id 
    try {
      solution ? await dispatch(updateSolutions(FinalData))
      : await dispatch(addSolutions(FinalData)).unwrap();
      closeButton.click();
      reset();
    } catch (error) {
      closeButton.click();
    }
  };
  React.useEffect(() => {
        const offcanvasElement = document.getElementById("offcanvas_add_edit_solution");
        if (offcanvasElement) {
          const handleModalClose = () => {
            setSolution();
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
      id="offcanvas_add_edit_solution"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="fw-semibold">{solution ? "Update " : "Add New"} Solution</h5>
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
        
            {/* Title */}
            <div className="col-md-6">
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
                {errors.title && (
                  <small className="text-danger">
                    {errors.title.message}
                  </small>
                )}
              </div>
            </div>

            {/* Case Number
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
            </div> */}
         
            {/* Solution Owner */}
            <div className="col-md-6">
                <div className="mb-3">
                  <label className="col-form-label">
                   Solution Owner 
                   <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="solution_owner"
                    rules={{ required: "Solution Owner is required!" }} // Make the field required
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
                        value={ watch("solution_owner") && usersList?.find(
                          (option) => option.value === watch("solution_owner")
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
                  {errors.solution_owner && (
                    <small className="text-danger">
                      {errors.solution_owner.message}
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

                 {/* Status */}
                 <div className="col-md-6">
              <div className="mb-1">
                <label className="col-form-label ">Status</label>
                <Select
                  className="select"
                  options={OrderStatusOptions}
                  placeholder="Choose"
                  classNamePrefix="react-select"
                  onChange={(selectedOption) => {
                    setValue("status",selectedOption.value)
                  }}
                  value={OrderStatusOptions?.find( (option) => option.value === watch("status") ) || "" }
                />
              </div>
            </div>
            {/* Question */}
            <div className="col-md-12">
              <div className="mb-3">
                <label className="col-form-label">Question <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  {...register("question" , {
                    required: "Case type is required",
                  })}
                />
                 {errors.question && (
                  <small className="text-danger">
                    {errors.question.message}
                  </small>
                )}
              </div>
            </div>
            {/* Answer */}
            <div className="col-md-12">
              <div className="mb-3">
                <label className="col-form-label">Answer<span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  {...register("answer", {
                    required: "Case priority is required",
                  } )}
                />
                 {errors.answer && (
                  <small className="text-danger">
                    {errors.answer.message}
                  </small>
                )}
              </div>
            </div>
          
             {/* Description */}
            {/* <div className="col-md-12">
                      <div className="mb-0">
                        <label className="col-form-label">
                          Description
                        </label>
                        <textarea
                          className="form-control"
                          rows={5}
                          {...register("description", 
                            // { required: "Description is required",}
                          )}
                        />
                      </div>
                    </div> */}
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
              {solution ? loading ? "Updating ....": "Update" : loading ? "Creating..." : "Create"}
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

export default AddSolutionModal;
