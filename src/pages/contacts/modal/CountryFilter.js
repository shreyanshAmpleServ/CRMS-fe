import React, { useState } from "react";

const CountryFilter = ({ availableCountries, onFilterChange }) => {
  const [countrySearchText, setCountrySearchText] = useState("");
  const [selectedCountries, setSelectedCountries] = useState([]);

  const toggleCountrySelection = (country) => {
    const updatedSelection = selectedCountries.includes(country)
      ? selectedCountries.filter((c) => c !== country)
      : [...selectedCountries, country];

    setSelectedCountries(updatedSelection);
    onFilterChange(updatedSelection); // Notify parent about the change
  };

  return (
    <div className="filter-content-list">
      <div className="mb-2 icon-form">
        <span className="form-icon">
          <i className="ti ti-search" />
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="Search Country"
          value={countrySearchText}
          onChange={(e) => setCountrySearchText(e.target.value)}
        />
      </div>
      <ul>
        {availableCountries
          .filter((country) =>
            country.toLowerCase().includes(countrySearchText.toLowerCase())
          )
          .map((country) => (
            <li key={country}>
              <div className="filter-checks">
                <label className="checkboxs">
                  <input
                    type="checkbox"
                    checked={selectedCountries.includes(country)}
                    onChange={() => toggleCountrySelection(country)}
                  />
                  <span className="checkmarks" />
                  {country}
                </label>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default CountryFilter;
