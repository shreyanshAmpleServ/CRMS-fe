<div
          className="offcanvas offcanvas-end offcanvas-large"
          tabIndex={-1}
          id="offcanvas_edit"
        >
          <div className="offcanvas-header border-bottom">
            <h5 className="fw-semibold">Edit Contact</h5>
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
              <div className="accordion" id="main_accordion_2">
                {/* Basic Info */}
                <div className="accordion-item rounded mb-3">
                  <div className="accordion-header">
                    <Link
                      to="#"
                      className="accordion-button accordion-custom-button bg-white rounded fw-medium text-dark"
                      data-bs-toggle="collapse"
                      data-bs-target="#basic-2"
                    >
                      <span className="avatar avatar-md rounded text-dark border me-2">
                        <i className="ti ti-user-plus fs-20" />
                      </span>
                      Basic Info
                    </Link>
                  </div>
                  <div
                    className="accordion-collapse collapse show"
                    id="basic-2"
                    data-bs-parent="#main_accordion_2"
                  >
                    <div className="accordion-body border-top">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="mb-3">
                            <div className="profile-upload">
                              <div className="profile-upload-img">
                                <span>
                                  <i className="ti ti-photo" />
                                </span>
                                <img
                                  src="assets/img/profiles/avatar-20.jpg"
                                  alt="img"
                                  className="preview1"
                                />
                                <button
                                  type="button"
                                  className="profile-remove"
                                >
                                  <i className="ti ti-x" />
                                </button>
                              </div>
                              <div className="profile-upload-content">
                                <label className="profile-upload-btn">
                                  <i className="ti ti-file-broken" /> Upload
                                  File
                                  <input type="file" className="input-img" />
                                </label>
                                <p>JPG, GIF or PNG. Max size of 800K</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="col-form-label">
                              First Name <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue="Darlee"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="col-form-label">
                              Last Name <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue="Robertson"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="col-form-label">
                              Job Title <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue="Facility Manager"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="col-form-label">
                              Company Name
                            </label>
                            <Select
                                className="select2" 
                                classNamePrefix="react-select"
                                options={companyName}
                                defaultValue={companyName[1]}
                                placeholder="Choose"
                              />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center">
                              <label className="col-form-label">
                                Email <span className="text-danger">*</span>
                              </label>
                              <div className="status-toggle small-toggle-btn d-flex align-items-center">
                                <span className="me-2 label-text">
                                  Email Opt Out
                                </span>
                                <input
                                  type="checkbox"
                                  id="user2"
                                  className="check"
                                  defaultChecked
                                  defaultValue="robertson@example.com"
                                />
                                <label
                                  htmlFor="user2"
                                  className="checktoggle"
                                />
                              </div>
                            </div>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="col-form-label">
                              Phone 1 <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={6234567890}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="col-form-label">Phone 2</label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={7234567899}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="col-form-label">
                              Fax <span className="text-danger">*</span>
                            </label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <div className="d-flex align-items-center justify-content-between">
                              <label className="col-form-label">Deals</label>
                              <Link
                                to="#"
                                className="label-add"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvas_add_2"
                              >
                                <i className="ti ti-square-rounded-plus" />
                                Add New
                              </Link>
                            </div>
                            <Select
                                className="select2" 
                                 classNamePrefix="react-select"
                                options={dealsopen}
                                defaultValue={dealsopen[2]}
                                placeholder="Choose"
                              />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="col-form-label">
                              Date of Birth
                            </label>
                            <div className="icon-form-end">
                              <span className="form-icon">
                                <i className="ti ti-calendar-event" />
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
                            <label className="col-form-label">Reviews </label>
                            <div className="icon-form-end">
                              <span className="form-icon">
                                <i className="ti ti-star" />
                              </span>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="4.2"
                                defaultValue="4.2"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="fmb-3">
                            <label className="col-form-label">Owner</label>
                            <SelectWithImage />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="col-form-label">Tags </label>
                            <TagsInput
                                value={owner}
                                onChange={setOwner}
                              />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="col-form-label">
                              Source <span className="text-danger">*</span>
                            </label>
                            <Select
                                className="select2" 
                                 classNamePrefix="react-select"
                                options={activities}
                                placeholder="Select an option"
                              />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="col-form-label">
                              Industry <span className="text-danger">*</span>
                            </label>
                            <Select
                                className="select"
                                 classNamePrefix="react-select"
                                options={industries}
                                placeholder="Banking"
                              />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="col-form-label">
                              Currency <span className="text-danger">*</span>
                            </label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="col-form-label">
                              Language <span className="text-danger">*</span>
                            </label>
                            <Select
                                className="select" 
                                 classNamePrefix="react-select"
                                options={languages}
                                placeholder="English"
                              />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="mb-0">
                            <label className="col-form-label">
                              Description <span className="text-danger">*</span>
                            </label>
                            <textarea
                              className="form-control"
                              rows={5}
                              defaultValue={""}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Basic Info */}
                {/* Address Info */}
                <div className="accordion-item border-top rounded mb-3">
                  <div className="accordion-header">
                    <Link
                      to="#"
                      className="accordion-button accordion-custom-button rounded bg-white fw-medium text-dark"
                      data-bs-toggle="collapse"
                      data-bs-target="#address-2"
                    >
                      <span className="avatar avatar-md rounded text-dark border me-2">
                        <i className="ti ti-map-pin-cog fs-20" />
                      </span>
                      Address Info
                    </Link>
                  </div>
                  <div
                    className="accordion-collapse collapse"
                    id="address-2"
                    data-bs-parent="#main_accordion_2"
                  >
                    <div className="accordion-body border-top">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="mb-3">
                            <label className="col-form-label">
                              Street Address{" "}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue="22, Ave Street"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="col-form-label">City </label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue="Denver"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="col-form-label">
                              State / Province{" "}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue="Colorado"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3 mb-md-0">
                            <label className="col-form-label">Country</label>
                            <Select
                                className="select" 
                                 classNamePrefix="react-select"
                                options={countries}
                                defaultValue={countries[2]}
                                placeholder="Choose"
                              />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-0">
                            <label className="col-form-label">Zipcode </label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={546}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Address Info */}
                {/* Social Profile */}
                <div className="accordion-item border-top rounded mb-3">
                  <div className="accordion-header">
                    <Link
                      to="#"
                      className="accordion-button accordion-custom-button rounded bg-white fw-medium text-dark"
                      data-bs-toggle="collapse"
                      data-bs-target="#social-2"
                    >
                      <span className="avatar avatar-md rounded text-dark border me-2">
                        <i className="ti ti-social fs-20" />
                      </span>
                      Social Profile
                    </Link>
                  </div>
                  <div
                    className="accordion-collapse collapse"
                    id="social-2"
                    data-bs-parent="#main_accordion_2"
                  >
                    <div className="accordion-body border-top">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="col-form-label">Facebook</label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="col-form-label">Skype </label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="col-form-label">Linkedin </label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="col-form-label">Twitter</label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3 mb-md-0">
                            <label className="col-form-label">Whatsapp</label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-0">
                            <label className="col-form-label">Instagram</label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Social Profile */}
                {/* Access */}
                <div className="accordion-item border-top rounded mb-3">
                  <div className="accordion-header">
                    <Link
                      to="#"
                      className="accordion-button accordion-custom-button rounded bg-white fw-medium text-dark"
                      data-bs-toggle="collapse"
                      data-bs-target="#access-info-2"
                    >
                      <span className="avatar avatar-md rounded text-dark border me-2">
                        <i className="ti ti-accessible fs-20" />
                      </span>
                      Access
                    </Link>
                  </div>
                  <div
                    className="accordion-collapse collapse"
                    id="access-info-2"
                    data-bs-parent="#main_accordion_2"
                  >
                    <div className="accordion-body border-top">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="mb-3">
                            <label className="col-form-label">Visibility</label>
                            <div className="d-flex flex-wrap">
                              <div className="me-2">
                                <input
                                  type="radio"
                                  className="status-radio"
                                  id="public2"
                                  name="visible"
                                />
                                <label htmlFor="public2">Public</label>
                              </div>
                              <div className="me-2">
                                <input
                                  type="radio"
                                  className="status-radio"
                                  id="private2"
                                  name="visible"
                                />
                                <label htmlFor="private2">Private</label>
                              </div>
                              <div
                                data-bs-toggle="modal"
                                data-bs-target="#access_view"
                              >
                                <input
                                  type="radio"
                                  className="status-radio"
                                  id="people2"
                                  name="visible"
                                />
                                <label htmlFor="people2">Select People</label>
                              </div>
                            </div>
                          </div>
                          <div className="mb-0">
                            <label className="col-form-label">Status</label>
                            <div className="d-flex flex-wrap">
                              <div className="me-2">
                                <input
                                  type="radio"
                                  className="status-radio"
                                  id="active2"
                                  name="status"
                                  defaultChecked
                                />
                                <label htmlFor="active2">Active</label>
                              </div>
                              <div>
                                <input
                                  type="radio"
                                  className="status-radio"
                                  id="inactive2"
                                  name="status"
                                />
                                <label htmlFor="inactive2">Inactive</label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Access */}
              </div>
              <div className="d-flex align-items-center justify-content-end">
                <button
                  type="button"
                  data-bs-dismiss="offcanvas"
                  className="btn btn-light me-2"
                >
                  Cancel
                </button>
                <button type="button" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>