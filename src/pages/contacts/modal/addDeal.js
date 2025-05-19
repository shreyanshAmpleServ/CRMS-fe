<div
          className="offcanvas offcanvas-end offcanvas-large"
          tabIndex={-1}
          id="offcanvas_add_2"
        >
          <div className="offcanvas-header border-bottom">
            <h5 className="fw-semibold">Add New Deals</h5>
            <button
              type="button"
              className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <div className="offcanvas-body">
            <form>
              <div className="row">
                <div className="col-md-12">
                  <div className="mb-3">
                    <label className="col-form-label">
                      Deal Name <span className="text-danger">*</span>
                    </label>
                    <input type="text" className="form-control" />
                  </div>
                </div>
                <div className="col-md-6">
                    <div className="mb-3">
                      <div className="d-flex align-items-center justify-content-between">
                        <label className="col-form-label">
                          Pipeine <span className="text-danger">*</span>
                        </label>
                      </div>
                      <Select
                        className="select2"
                        options={salestypelist}
                        placeholder="Choose"
                        classNamePrefix="react-select"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="col-form-label">
                        Status <span className="text-danger">*</span>
                      </label>
                      <Select
                        className="select2"
                        options={status}
                        placeholder="Choose"
                        classNamePrefix="react-select"
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <div className="mb-3">
                      <label className="col-form-label">
                        Deal Value<span className="text-danger"> *</span>
                      </label>
                      <input className="form-control" type="text" />
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <div className="mb-3">
                      <label className="col-form-label">
                        Currency <span className="text-danger">*</span>
                      </label>
                      <Select
                        className="select2"
                        options={optionssymbol}
                        placeholder="Choose"
                         classNamePrefix="react-select"
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <div className="mb-3">
                      <label className="col-form-label">
                        Period <span className="text-danger">*</span>
                      </label>
                      <Select
                        className="select2"
                        options={duration}
                        placeholder="Choose"
                        classNamePrefix="react-select"
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <div className="mb-3">
                      <label className="col-form-label">
                        Period Value <span className="text-danger">*</span>
                      </label>
                      <input className="form-control" type="text" />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="col-form-label">
                        Contact <span className="text-danger">*</span>
                      </label>
                      <SelectWithImage2 />
                    </div>
                    <div className="mb-3">
                      <label className="col-form-label">
                        Project <span className="text-danger">*</span>
                      </label>
                      <Select
                        className="select2"
                        options={project}
                        defaultValue={tagInputValues}
                        isMulti
                         classNamePrefix="react-select"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="col-form-label">
                        Due Date <span className="text-danger">*</span>
                      </label>
                      <div className="icon-form">
                        <span className="form-icon">
                          <i className="ti ti-calendar-check" />
                        </span>
                        <DatePicker
                          className="form-control datetimepicker deals-details"
                          selected={selectedDate}
                          onChange={handleDateChange}
                          dateFormat="dd-MM-yyyy"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="col-form-label">
                        Expected Closing Date{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <div className="icon-form">
                        <span className="form-icon">
                          <i className="ti ti-calendar-check" />
                        </span>

                        <DatePicker
                          className="form-control datetimepicker deals-details"
                          selected={selectedDate1}
                          onChange={handleDateChange1}
                          dateFormat="dd-MM-yyyy"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="col-form-label">
                        Assignee <span className="text-danger">*</span>
                      </label>
                      <SelectWithImage2 />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="col-form-label">
                        Follow Up Date <span className="text-danger">*</span>
                      </label>
                      <div className="icon-form">
                        <span className="form-icon">
                          <i className="ti ti-calendar-check" />
                        </span>
                        <DatePicker
                          className="form-control datetimepicker deals-details"
                          selected={selectedDate}
                          onChange={handleDateChange}
                          dateFormat="dd-MM-yyyy"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="col-form-label">
                        Source <span className="text-danger">*</span>
                      </label>

                      <Select
                        className="select2"
                        options={socialMedia}
                        placeholder="Choose"
                         classNamePrefix="react-select"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="col-form-label">
                        Tags <span className="text-danger">*</span>
                      </label>
                      <TagsInput
                                // className="input-tags form-control"
                                value={owner}
                                onChange={setOwner}
                              />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="col-form-label">
                        Priority <span className="text-danger">*</span>
                      </label>
                      <Select
                        className="select2"
                        options={priorityList}
                        placeholder="Choose"
                         classNamePrefix="react-select"
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="mb-3">
                      <label className="col-form-label">
                        Description <span className="text-danger">*</span>
                      </label>
                      <DefaultEditor className="summernote" />
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
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setOpenModal(true)}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>