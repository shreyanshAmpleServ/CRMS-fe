import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { priceModelOptions } from "../../../components/common/selectoption/selectoption";
import { fetchCurrencies } from "../../../redux/currency";
import { fetchSalesType } from "../../../redux/order";
import { fetchTaxSetup } from "../../../redux/taxSetUp";
import { fetchVendors } from "../../../redux/vendor";
import ManageOrderItemModal from "./ManagePriceDetailsModal";
import { addSalesInvoice, fetchSalesInvoiceCode, updateSalesInvoice } from "../../../redux/salesInvoice";
import { addPurchaseInvoice, fetchPurchaseInvoiceCode, updatePurchaseInvoice } from "../../../redux/purchaseInvoice";
import { addPriceBook, updatePriceBook } from "../../../redux/priceBook";

const initialItem = [{
    parent_id: null,
    from_price: 0,
    to_price: 0,
    discount_per: 0,
  }]

const AddInvoiceModal = ({order,setOrder}) => {
  const dispatch = useDispatch();
  const [itemNumber, setItemNumber] = useState(initialItem);

  const {loading } = useSelector((state)=>state.priceBooks)

  const formatNumber = (num) => {
    if (num === 0 || isNaN(num)) { return '0';}
    const number = parseFloat(num);
    const [integerPart, decimalPart] = number.toString().split('.');
    const formattedInteger = parseInt(integerPart).toLocaleString('en-IN');
    if (decimalPart !== undefined) {
      const fixedDecimal = parseFloat(`0.${decimalPart}`).toFixed(2).split('.')[1];
      return `${formattedInteger}.${fixedDecimal}`;
    }
    return formattedInteger;
  };

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
      model: "",
      is_active: "Y",
      description: "",
      effectivate_from: new Date(),
      effectivate_to: new Date(),
    },
  });

React.useEffect(() => {
    if (order) {
      reset({
        name: order?.name || "",
        model: order?.model || "",
        is_active: order?.is_active || "Y",
        description: order?.description || "",
        effectivate_from: new Date(order?.effectivate_from) || new Date(),
        effectivate_to: new Date(order?.effectivate_to) || new Date(),
 });
setItemNumber(order?.price_book_details?.map((item)=>({
    parent_id:item?.parent_id || null,
    from_price:Number(item?.from_price) || 0,
    to_price:Number(item?.to_price) || 0,
    discount_per:Number(item?.discount_per) || 0,
  
})))
    } else {
      reset({
        name: "",
        model: "",
        is_active: "Y",
        description: "",
        effectivate_from: new Date(),
        effectivate_to: new Date(),
      });
    }
  }, [order]);


  const onSubmit = async (data) => {
    const closeButton = document.getElementById("close_add_edit_order");
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined) {
        let value = data[key];
        if ((key === "due_date" || key === "apr_date") && value instanceof Date) {
          value = value.toISOString();
        }
        formData.append(key, value);
      }
    });
  
    const FinalData = {
      ...data,
      priceDetails:itemNumber
    }
    if(order) FinalData.id = order?.id
    try {
      order ? await dispatch(updatePriceBook( FinalData))
      :  await dispatch(addPriceBook(FinalData)).unwrap();
      // order ? await dispatch(updateOrder({id :order?.id,orderData : { orderData: formData,orderItemsData:JSON.stringify(itemNumber)}}))
      // :  await dispatch(addOrder({orderData: formData,orderItemsData:JSON.stringify(itemNumber)})).unwrap();
      
      closeButton.click();
      reset();
      setItemNumber(initialItem)
    } catch (error) {
      closeButton.click();
    }
  };
  React.useEffect(() => {
        const offcanvasElement = document.getElementById("offcanvas_add_edit_price_book");
        if (offcanvasElement) {
          const handleModalClose = () => {
            setOrder();
            setItemNumber(initialItem)
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
    id="offcanvas_add_edit_price_book"
  >
    <div className="offcanvas-header border-bottom">
      <h4>{order ? "Update " :"Add New "} Price book</h4>
      <button
        type="button"
        className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
          id="close_add_edit_order"
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
                  Name<span className="text-danger"> *</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  {...register("name", {
                    required: "Contact person to is required",
                  })}
                />
                {errors.name && (
                  <small className="text-danger">
                    {errors.name.message}
                  </small>
                )}
              </div>
            </div>
            
            
                  {/* Sales Type  */}
            <div className="col-md-6">
              <div className="mb-1">
                <label className="col-form-label ">Pricing Model</label>
                <Select
                  className="select"
                  options={priceModelOptions}
                  placeholder="Choose"
                  classNamePrefix="react-select"
                  onChange={(selectedOption) => {
                    setValue("model",selectedOption.value)
                  }}
                  value={priceModelOptions?.find( (option) => option.value === watch("model") ) || "" }
                  styles={{
                    menu: (provided) => ({ ...provided,   zIndex: 9999,  }),
                  }}
                />
                  {errors.model && (
                  <small className="text-danger">
                    {errors.model.message}
                  </small>
                )}
              </div>
            </div>
          
                  {/* Effective From  */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Effective from<span className="text-danger">*</span>
                </label>
                <div className="icon-form">
                  <span className="form-icon">
                    <i className="ti ti-calendar-check" />
                  </span>
                  <DatePicker
                    className="form-control datetimepicker"
                    selected={watch("effectivate_from")}
                    onChange={(date)=>setValue("effectivate_from",date)}
                    dateFormat="dd-MM-yyyy"
                  />
                </div>
              </div>
            </div>
                  {/* Effective To  */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Effective to<span className="text-danger">*</span>
                </label>
                <div className="icon-form">
                  <span className="form-icon">
                    <i className="ti ti-calendar-check" />
                  </span>
                  <DatePicker
                    className="form-control datetimepicker"
                    selected={watch("effectivate_to")}
                    onChange={(date)=>setValue("effectivate_to",date)}
                    dateFormat="dd-MM-yyyy"
                  />
                </div>
              </div>
            </div>
             
                 {/* Order Items  */}
             <ManageOrderItemModal  itemNumber={itemNumber} setItemNumber={setItemNumber}/>
                
                
                 {/* Description */}
            <div className="col-md-12 mb-3">
                  <div className="mb-0">
                    <label className="col-form-label">
                      Description
                    </label>
                    <textarea
                      className="form-control"
                      rows={4}
                      {...register("description")}
                    />
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
          <button type="submit"  disabled={loading} className="btn btn-primary">
    
            {order ? loading ? "Updating ....": "Update" : loading ? "Creating..." : "Create"}
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

export default AddInvoiceModal;
