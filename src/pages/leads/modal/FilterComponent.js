import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  // status,
  priorityList,
} from "../../../components/common/selectoption/selectoption";
import { fetchLostReasons } from "../../../redux/lostReasons";
import { useDispatch, useSelector } from "react-redux";
const FilterComponent = ({ applyFilters }) => {
  const [selectedPriority, setSelectedPriorty] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null); // Change to a single status

    const dispatch = useDispatch();

  const resetFilters = () => {
    setSelectedPriorty(null);
    setSelectedStatus(null); // Reset selected status
    const filters = {
      priority: null,
      status: null, // Pass selected status as a single value
    };
    applyFilters(filters);
  };

    React.useEffect(() => {
      dispatch(fetchLostReasons());
    },[])
const { lostReasons } = useSelector((state) => state.lostReasons);

const status = lostReasons?.map((i)=>({label:i?.name,value:i?.id}))

  const handleFilter = () => {
    const filters = {
      priority: selectedPriority,
      status: selectedStatus, // Pass selected status as a single value
    };
    applyFilters(filters); // Call parent or API to apply the filters
  };

  return (
    <div className="form-sorts dropdown me-2">
      <Link to="#" data-bs-toggle="dropdown" data-bs-auto-close="outside">
        <i className="ti ti-filter-share" />
        Filter
      </Link>
      <div className="filter-dropdown-menu dropdown-menu dropdown-menu-md-end p-3">
        <div className="filter-set-view">
          <div className="filter-set-head">
            <h4>
              <i className="ti ti-filter-share" />
              Filter
            </h4>
          </div>
          <div className="accordion" id="accordionDealFilter">
            {/* Priorty Filter */}
            {/* <div className="filter-set-content">
              <div className="filter-set-content-head">
                <Link
                  to="#"
                  className="collapsed"
                  data-bs-toggle="collapse"
                  data-bs-target="#Priority"
                  aria-expanded="false"
                  aria-controls="Priority"
                >
                  Priority
                </Link>
              </div>
              <div
                className="filter-set-contents accordion-collapse collapse"
                id="Priority"
                data-bs-parent="#accordionDealFilter"
              >
                <div className="filter-content-list">
                  <ul>
                    {priorityList.map((statusObj, index) => {
                      const { value, label } = statusObj; // Extract the key-value pair
                      return (
                        <li key={index}>
                          <div className="filter-checks">
                            <label className="checkboxs">
                              <input
                                name="priority"
                                type="radio" // Use radio for single selection
                                checked={selectedPriority === value} // Only one status can be selected
                                onChange={() => setSelectedPriorty(value)} // Set the selected status key
                              />
                              <span className="checkmarks" />
                              {label}{" "}

                            </label>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div> */}

            {/* Status Filter */}
            <div className="filter-set-content">
              <div className="filter-set-content-head">
                <Link
                  to="#"
                  className="collapsed"
                  data-bs-toggle="collapse"
                  data-bs-target="#Status"
                  aria-expanded="false"
                  aria-controls="Status"
                >
                  Status
                </Link>
              </div>
              <div
                className="filter-set-contents accordion-collapse collapse"
                id="Status"
                data-bs-parent="#accordionDealFilter"
              >
                <div className="filter-content-list">
                  <ul>
                    {status.map((statusObj, index) => {
                      const { value, label } = statusObj; // Extract the key-value pair
                      return (
                        <li key={index}>
                          <div className="filter-checks">
                            <label className="checkboxs">
                              <input
                                name="status"
                                type="radio" // Use radio for single selection
                                checked={selectedStatus === value} // Only one status can be selected
                                onChange={() => setSelectedStatus(value)} // Set the selected status key
                              />
                              <span className="checkmarks" />
                              {label}{" "}
                              {/* Display the value (Active/Inactive) */}
                            </label>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Reset and Filter Buttons */}
          <div className="filter-reset-btns">
            <div className="row">
              <div className="col-6">
                <button onClick={resetFilters} className="btn btn-light">
                  Reset
                </button>
              </div>
              <div className="col-6  d-flex justify-content-end">
                <button onClick={handleFilter} className="btn btn-primary">
                  Filter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterComponent;
