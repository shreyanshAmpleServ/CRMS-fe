import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Select from "react-select";
import { fetchCurrencies } from "../../../redux/currency";
import {
  fetchProducts
} from "../../../redux/products";
import { fetchTaxSetup } from "../../../redux/taxSetUp";

const ManageOrderItemModal = ({ itemNumber, setItemNumber}) => {
  const dispatch = useDispatch();
  const formatNumber = (num) => {
    if (num === 0 || isNaN(num)) {
      return '0';
    }
    const number = parseFloat(num);
    if (Number.isInteger(number)) {
      return number;
    }
    return number.toFixed(2);
  };
  

  const addNewColumn = () => {
    setItemNumber((prev) => [
      ...prev,
      {
        parent_id: null,
        item_id: null,
        item_name: "",
        quantity: 1,
        delivered_qty: 0,
        unit_price: 0,
        currency: null,
        rate: 0,
        disc_prcnt: 0,
        disc_amount: 0,
        tax_id: null,
        tax_per: 0.0,
        line_tax: 0,
        total_bef_disc: 0,
        total_amount:0
      },
    ]);
  };

  const updateItem = (index, field, value) => {
    setItemNumber((prev) => {
      const updatedItems = [...prev];
      updatedItems[index][field] = value;
      return updatedItems;
    });
  };

  const deleteRow = (index) => {
    setItemNumber((prev) => prev.filter((_, i) => i !== index));
  };
  const { loading } = useSelector((state) => state.products);

  const { control } = useForm();
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchTaxSetup());
    dispatch(fetchCurrencies());
    dispatch(fetchTaxSetup());
  }, [dispatch]);

  const { products } = useSelector((state) => state.products);
  const { manufacturers, loading: loadingTax } = useSelector(
    (state) => state.manufacturers
  );
  const { currencies, loading: loadingCurrency } = useSelector(
    (state) => state.currency
  );
  const { taxs, loading: loadingTAx } = useSelector((state) => state.taxs);

  const productList = products?.data?.map((emnt) => ({
    value: emnt.id,
    label: emnt.name,
    unit_price: emnt.unit_price,
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
    label: emnt.name + " (" + emnt.rate + "%)",
    tax:emnt.rate
  }));

//   const onSubmit = async (data) => {
//     const closeButton = document.getElementById("close_add_edit_order");
//     const formData = new FormData();
//     Object.keys(data).forEach((key) => {
//       if (data[key] !== null) {
//         formData.append(key, data[key]);
//       }
//     });
//     // formData.append("email_opt_out",watch("email_opt_out") === true ? "Y" : "N")

//     try {
//       product
//         ? await dispatch(
//             updateProduct({ id: product?.id, productData: formData })
//           )
//         : await dispatch(addProduct(formData)).unwrap();
//       closeButton.click();
//     } catch (error) {
//       closeButton.click();
//     }
//   };

  return (
    <div>
      <div className="col-md-12 ">
        <div className="mb-1 d-flex justify-content-between">
          <label className="col-form-label fw-bold">Purchase Order items</label>
          <Link
            to="#"
            className="label-add"
            // data-bs-toggle="modal"
            //  data-bs-target="#myOrderItemModal"
            onClick={addNewColumn}
          >
            <i className="ti ti-square-rounded-plus" />
            Add New
          </Link>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-view">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Rate</th>
              <th>Discount(%)</th>
              <th>Price aft disc</th>
              <th>Tax</th>
              <th>Total Tax</th>
              <th>Total Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {itemNumber?.length &&
              itemNumber?.map((i, index) => (
                <tr>
                  <td>
                    <div className="input-table input-table-descripition">
                      <Controller
                        name="item_id"
                        rules={{ required: "Vendor is required!" }} // Make the field required
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={productList}
                            placeholder="Choose"
                            className="select2"
                            classNamePrefix="react-select"
                            onChange={(selectedOption) => {
                              let rate = selectedOption?.unit_price * i?.quantity || 0 ;
                              let disc_amount = (rate * i.disc_prcnt)/100
                              let total_bef_disc = rate - disc_amount
                              let line_tax = (total_bef_disc * i?.tax_per)/100  || 0 ;
                              updateItem(index, "item_id", selectedOption?.value || null  );
                              updateItem(index, "item_name", selectedOption?.label || null  );
                              updateItem(index, "unit_price",  selectedOption?.unit_price || 0 );
                              updateItem(index, "rate",rate );
                              updateItem(index, "line_tax", line_tax);
                              updateItem(index, "total_bef_disc",total_bef_disc);
                              updateItem(index, "total_amount",total_bef_disc + line_tax);
                              updateItem(index, "disc_amount",disc_amount );
                              field.onChange(selectedOption?.value || null);
                            }}
                            value={   productList?.find( (option) => option.value === i?.item_id ) || "" }
                            // value={i?.item_id}
                            styles={{
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                              menu: (provided) => ({ ...provided,   zIndex: 9999,  }),
                            }}
                            menuPortalTarget={document.body}
                          />
                        )}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="input-table">
                      <input
                        name="quantity"
                        type="number"
                        value={i.quantity}
                        onChange={(e) => {
                          let value = e.target.value;
                          // Remove leading zeros, but keep a single zero if it's the only value
                          if (/^0\d+/.test(value)) {
                            value = value.replace(/^0+/, "");
                            if (value === "") value = "0";
                          }
                          let rate = i?.unit_price * value || 0
                          let disc_amount = (rate * i.disc_prcnt)/100
                          let total_bef_disc =  rate - disc_amount|| 0
                          let line_tax = (total_bef_disc * i?.tax_per)/100  || 0;
                          updateItem(  index, "total_amount",total_bef_disc - line_tax );
                          updateItem(  index, "disc_amount",disc_amount );
                          updateItem(index, "quantity", value || 0);
                          updateItem(index, "rate",rate );
                          updateItem( index, "line_tax",  line_tax  );
                          updateItem( index, "total_bef_disc",  total_bef_disc || 0  );
                        }}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="input-table">
                      <input
                        name="unit_price"
                        type="number"
                        placeholder="0.0"
                        value={i?.unit_price}
                        disabled
                      />
                    </div>
                  </td>

                  <td>
                    <div className="input-table">
                      <input name="rate" type="text" disabled value={i?.rate} />
                    </div>
                  </td>
                  
                  <td>
                    <div className="input-table">
                    <input name="disc_prcnt" type="number" value={i?.disc_prcnt} onChange={(e) => {
                        let value = Number(e.target.value);
                        if (value < 0) value = 0;
                        if (value > 100) value = i.disc_prcnt;
                        e.target.value = value; 

                        let disc_amount = (i.rate * e.target.value)/100
                        let total_bef_disc = i.rate - disc_amount
                        let line_tax = (total_bef_disc * i?.tax_per)/100  || 0;
                        updateItem(  index, "total_amount",total_bef_disc + line_tax );
                        updateItem(  index, "disc_amount",disc_amount );
                        updateItem( index,"disc_prcnt",e.target.value || 0);
                        updateItem( index,"total_bef_disc",total_bef_disc);
                        updateItem( index,"line_tax",line_tax);

                    }} />
                    </div>
                  </td>
                  <td>
                    <div className="input-table">
                      <input name="total_bef_disc"  type="number" value={i?.total_bef_disc} disabled />
                    </div>
                  </td>
                  <td>
                    <div className="input-table">
                    <Controller
                        name="tax_id"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={TaxList}
                            placeholder="Select Tax"
                            className="select2"
                            classNamePrefix="react-select"
                            onChange={(selectedOption) => {
                              
                              let line_tax = (i.total_bef_disc * selectedOption?.tax)/100  || 0 ;
                              updateItem(  index, "total_amount",i.total_bef_disc + line_tax );
                              updateItem(index,"tax_id",selectedOption?.value || null );
                              updateItem(index,"line_tax",line_tax);
                              updateItem( index,"tax_per",selectedOption?.tax || 0);
                              field.onChange(selectedOption?.value || null);
                            }}
                            value={ TaxList?.find(  (option) => option.value === i?.tax_id ) || "" }
                            styles={{
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                              menu: (provided) => ({ ...provided, zIndex: 9999}),
                            }}
                            menuPortalTarget={document.body}
                          />
                        )}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="input-table">
                      <input name="line_tax" type="text" value={ formatNumber(i?.line_tax)} disabled/>
                    </div>
                  </td>
                  <td style={{width:"auto"}}>
                    <div className="input-table">
                      <input width={{width:"auto"}} type="text" value={formatNumber(i?.total_amount)} disabled  />
                    </div>
                  </td>
                  <td>
                    <button
                      onClick={() => deleteRow(index)}
                      type="button"
                      className="btn btn-danger-light "
                    >
                      <i
                        className="ti ti-trash "
                        style={{ fontSize: "15px" }}
                      />
                    </button>
                    {/* <Link to="#" className="btn btn-success-light">
                        <i className="ti ti-check" />
                      </Link> */}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOrderItemModal;
