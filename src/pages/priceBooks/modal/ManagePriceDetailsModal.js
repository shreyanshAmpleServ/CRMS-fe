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
        from_price: 0,
        to_price: 0,
        discount_per: 0,
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


  return (
    <div>
      <div className="col-md-12 ">
        <div className="mb-1 d-flex justify-content-between">
          <label className="col-form-label fw-bold">Pricing Details</label>
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
              <th>From Range</th>
              <th>To Range</th>
              <th>Discount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {itemNumber?.length &&
              itemNumber?.map((i, index) => (
                <tr>
                  
                  <td>
                    <div className="input-table">
                      <input
                        name="from_price"
                        type="number"
                        placeholder="0.0"
                        className="w-100"
                        value={i.from_price}
                        onChange={(e) => {
                          updateItem( index, "from_price",  e.target.value  );
                        }}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="input-table">
                      <input
                        name="to_price"
                        type="number"
                        className="w-100"
                        placeholder="0.0"
                        value={i?.to_price}
                        onChange={(e) => {
                          updateItem( index, "to_price",  e.target.value  );
                        }}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="input-table">
                      <input
                        name="discount_per"
                        type="number"
                        className="w-100"
                        placeholder="0.0"
                        value={i?.discount_per}
                        onChange={(e) => {
                          updateItem( index, "discount_per",  e.target.value  );
                        }}
                      />
                    </div>
                  </td>

                
                  <td>
                    <button
                      onClick={() => deleteRow(index)}
                      type="button"
                      disabled={itemNumber?.length <= 1}
                      className={`btn ${itemNumber?.length <= 1 ? "": "btn-danger-light"} `}
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
