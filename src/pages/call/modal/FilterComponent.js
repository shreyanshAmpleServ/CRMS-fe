import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { category, DocumentRelatedType } from "../../../components/common/selectoption/selectoption";
const FilterComponent = ({ applyFilters }) => {
  const [selectedType, setSelectedType] = useState(null);
  const [selectedCategory,setSelectedCategory] = useState()
  const [selectedStatus, setSelectedStatus] = useState(null); // Change to a single status

  const { callStatuses } = useSelector((state) => state.callStatuses);
  const callStatusList = callStatuses.map((emnt) => ({
    value: emnt.id,
    label: emnt.name,
  }));

  const resetFilters = () => {
    setSelectedStatus(null); // Reset selected status
    const filters = {
      type: null,
      category:"",
      status: null, // Pass selected status as a single value
    };
    applyFilters(filters);
  };

  const handleFilter = () => {
    const filters = {
      type: selectedType,
      category:selectedCategory,
      status: selectedStatus, // Pass selected status as a single value
    };
    applyFilters(filters); // Call parent or API to apply the filters
  };

  const callTypeList = [{
    label:"Completed",
    value:"Completed"
  },
{
  label:"Scheduled",
  value:"Scheduled"
}]

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
            {/* Call Type Filter */}
            <div className="filter-set-content">
              <div className="filter-set-content-head">
                <Link
                  to="#"
                  className="collapsed"
                  data-bs-toggle="collapse"
                  data-bs-target="#Priority"
                  aria-expanded="false"
                  aria-controls="Priority"
                >
                  Call Type
                </Link>
              </div>
              <div
                className="filter-set-contents accordion-collapse collapse"
                id="Priority"
                data-bs-parent="#accordionDealFilter"
              >
                <div className="filter-content-list">
                  <ul>
                    {callTypeList.map((type, index) => {
                      return (
                        <li key={type?.value}>
                          <div className="filter-checks">
                            <label className="checkboxs">
                              <input
                                name="call_type"
                                type="radio" // Use radio for single selection
                                checked={selectedType === type?.value} // Only one status can be selected
                                onChange={() => setSelectedType(type?.value)} // Set the selected status key
                              />
                              <span className="checkmarks" />
                              {type?.label}{" "}
                            </label>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>

            {/* Call Categories */}
            <div className="filter-set-content">
                                      <div className="filter-set-content-head">
                                        <Link
                                          to="#"
                                          className="collapsed"
                                          data-bs-toggle="collapse"
                                          data-bs-target="#Categories"
                                          aria-expanded="false"
                                          aria-controls="Categories"
                                        >
                                          Call Category
                                        </Link>
                                      </div>
                                      <div
                                        className="filter-set-contents accordion-collapse collapse"
                                        id="Categories"
                                        data-bs-parent="#accordionDealFilter"
                                      >
                                        <div className="filter-content-list">
                                          <ul className="d-flex flex-wrap"  >
                                            {DocumentRelatedType.map((type, index) => {
                                              return (
                                                <li key={type?.value} className="col-md-4">
                                                  <div className="filter-checks">
                                                    <label className="checkboxs">
                                                      <input
                                                        name="call_type"
                                                        type="radio" // Use radio for single selection
                                                        checked={selectedCategory === type?.value} // Only one status can be selected
                                                        onChange={() => setSelectedCategory(type?.value)} // Set the selected status key
                                                      />
                                                      <span className="checkmarks" />
                                                      {type?.label}{" "}
                                                    </label>
                                                  </div>
                                                </li>
                                              );
                                            })}
                                          </ul>
                                        </div>
                                      </div>
                                    </div>

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
                    {callStatusList.map((statusObj, index) => {
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
