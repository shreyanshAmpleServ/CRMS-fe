import React, { useState } from "react";
import { Link } from "react-router-dom";
import CountryFilter from "./CountryFilter";

const FilterComponent = ({ countryList, applyFilters }) => {
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null); // Change to a single status

  const resetFilters = () => {
    setSelectedCountries([]);
    setSelectedStatus(null); // Reset selected status
  };

  const handleFilter = () => {
    const filters = {
      countries: selectedCountries,
      status: selectedStatus, // Pass selected status as a single value
    };
    applyFilters(filters); // Call parent or API to apply the filters
  };

  return (
    <div className="form-sorts dropdown me-2">
      <Link
        to="#"
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
      >
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
          <div className="accordion" id="accordionExample">
            {/* Country Filter */}
            <div className="filter-set-content">
              <div className="filter-set-content-head">
                <Link
                  to="#"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseTwo"
                  aria-expanded="true"
                  aria-controls="collapseTwo"
                >
                  Country
                </Link>
              </div>
              <div
                className="filter-set-contents accordion-collapse collapse show"
                id="collapseTwo"
                data-bs-parent="#accordionExample"
              >
                <CountryFilter
                  availableCountries={countryList}
                  onFilterChange={setSelectedCountries}
                />
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
                data-bs-parent="#accordionExample"
              >
                <div className="filter-content-list">
                  <ul>
                  {[{"Y": "Active"}, {"N": "Inactive"}].map((statusObj, index) => {
                      const [key, value] = Object.entries(statusObj)[0]; // Extract the key-value pair
                      return (
                        <li key={key}>
                          <div className="filter-checks">
                            <label className="checkboxs">
                              <input
                                type="radio" // Use radio for single selection
                                checked={selectedStatus === key} // Only one status can be selected
                                onChange={() => setSelectedStatus(key)} // Set the selected status key
                              />
                              <span className="checkmarks" />
                              {value} {/* Display the value (Active/Inactive) */}
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
              <div className="col-6">
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
