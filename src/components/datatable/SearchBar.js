import React from "react";

const SearchBar = ({ searchText, handleSearch, label }) => {
  return (
    <div className="col-sm-4">
      <div className="icon-form mb-3 mb-sm-0">
        <span className="form-icon">
          <i className="ti ti-search" />
        </span>
        <input
          type="text"
          className="form-control"
          placeholder={label}
          value={searchText}
          onChange={handleSearch}
        />
      </div>
    </div>
  );
};

export default SearchBar;
