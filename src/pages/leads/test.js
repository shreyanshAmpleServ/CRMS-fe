{/* Add Note */ }
<div
    className="modal custom-modal fade modal-padding"
    id="add_notes"
    role="dialog"
>
    <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Add New Notes</h5>
                <button
                    type="button"
                    className="btn-close position-static"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                >
                    <span aria-hidden="true">×</span>
                </button>
            </div>
            <div className="modal-body">
                <form>
                    <div className="mb-3">
                        <label className="col-form-label">
                            Title <span className="text-danger"> *</span>
                        </label>
                        <input className="form-control" type="text" />
                    </div>
                    <div className="mb-3">
                        <label className="col-form-label">
                            Note <span className="text-danger"> *</span>
                        </label>
                        <textarea
                            className="form-control"
                            rows={4}
                            defaultValue={""}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="col-form-label">
                            Attachment <span className="text-danger"> *</span>
                        </label>
                        <div className="drag-attach">
                            <input type="file" />
                            <div className="img-upload">
                                <i className="ti ti-file-broken" />
                                Upload File
                            </div>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="col-form-label">Uploaded Files</label>
                        <div className="upload-file">
                            <h6>Projectneonals teyys.xls</h6>
                            <p>4.25 MB</p>
                            <div className="progress">
                                <div
                                    className="progress-bar bg-success"
                                    role="progressbar"
                                    style={{ width: "25%" }}
                                    aria-valuenow={25}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                />
                            </div>
                            <p className="black-text">45%</p>
                        </div>
                        <div className="upload-file upload-list">
                            <div>
                                <h6>tes.txt</h6>
                                <p>4.25 MB</p>
                            </div>
                            <Link to="#" className="text-danger">
                                <i className="ti ti-trash-x" />
                            </Link>
                        </div>
                    </div>
                    <div className="col-lg-12 text-end modal-btn">
                        <Link
                            to="#"
                            className="btn btn-light"
                            data-bs-dismiss="modal"
                        >
                            Cancel
                        </Link>
                        <button
                            className="btn btn-primary"
                            data-bs-dismiss="modal"
                            type="button"
                        >
                            Confirm
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
{/* /Add Note */ }
{/* Create Call Log */ }
<div
    className="modal custom-modal fade modal-padding"
    id="create_call"
    role="dialog"
>
    <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Create Call Log</h5>
                <button
                    type="button"
                    className="btn-close position-static"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                >
                    <span aria-hidden="true">×</span>
                </button>
            </div>
            <div className="modal-body">
                <form>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="mb-3">
                                <label className="col-form-label">
                                    Status <span className="text-danger"> *</span>
                                </label>
                                <Select
                                    className="select2"
                                    options={statusList}
                                    placeholder="Choose"
                                    classNamePrefix="react-select"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="col-form-label">
                                    Follow Up Date <span className="text-danger"> *</span>
                                </label>
                                <div className="icon-form">
                                    <span className="form-icon">
                                        <i className="ti ti-calendar-check" />
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control datetimepicker"
                                        placeholder=""
                                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="col-form-label">
                                    Note <span className="text-danger"> *</span>
                                </label>
                                <textarea
                                    className="form-control"
                                    rows={4}
                                    placeholder="Add text"
                                    defaultValue={""}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="checkboxs">
                                    <input type="checkbox" />
                                    <span className="checkmarks" /> Create a followup task
                                </label>
                            </div>
                            <div className="text-end modal-btn">
                                <Link
                                    to="#"
                                    className="btn btn-light"
                                    data-bs-dismiss="modal"
                                >
                                    Cancel
                                </Link>
                                <button
                                    className="btn btn-primary"
                                    data-bs-dismiss="modal"
                                    type="button"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
{/* /Create Call Log */ }
{/* Add File */ }
<div
    className="modal custom-modal fade custom-modal-two modal-padding"
    id="new_file"
    role="dialog"
>
    <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Create New File</h5>
                <button
                    type="button"
                    className="btn-close position-static"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                >
                    <span aria-hidden="true">×</span>
                </button>
            </div>
            <div className="modal-body">
                <div className="add-info-fieldset">
                    <div className="add-details-wizard">
                        <ul className="progress-bar-wizard">
                            <li className="active">
                                <span>
                                    <i className="ti ti-file" />
                                </span>
                                <div className="multi-step-info">
                                    <h6>Basic Info</h6>
                                </div>
                            </li>
                            <li>
                                <span>
                                    <i className="ti ti-circle-plus" />
                                </span>
                                <div className="multi-step-info">
                                    <h6>Add Recipient</h6>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <fieldset id="first-field-file">
                        <form>
                            <div className="contact-input-set">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="mb-3">
                                            <label className="col-form-label">
                                                Choose Deal <span className="text-danger">*</span>
                                            </label>
                                            <Select
                                                className="select2"
                                                options={dealsopen}
                                                placeholder="Choose"
                                                classNamePrefix="react-select"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="col-form-label">
                                                Document Type{" "}
                                                <span className="text-danger">*</span>
                                            </label>
                                            <Select
                                                className="select2"
                                                options={documentType}
                                                placeholder="Choose"
                                                classNamePrefix="react-select"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="col-form-label">
                                                Owner <span className="text-danger">*</span>
                                            </label>
                                            <SelectWithImage2 />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="col-form-label">
                                                Title <span className="text-danger"> *</span>
                                            </label>
                                            <input className="form-control" type="text" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="col-form-label">
                                                Locale <span className="text-danger">*</span>
                                            </label>
                                            <Select
                                                className="select2"
                                                options={LocaleData}
                                                placeholder="Choose"
                                                classNamePrefix="react-select"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="signature-wrap">
                                            <h4>Signature</h4>
                                            <ul className="nav sign-item">
                                                <li className="nav-item">
                                                    <span
                                                        className=" mb-0"
                                                        data-bs-toggle="tab"
                                                        data-bs-target="#nosign"
                                                    >
                                                        <input
                                                            type="radio"
                                                            className="status-radio"
                                                            id="sign1"
                                                            name="email"
                                                        />
                                                        <label htmlFor="sign1">
                                                            <span className="sign-title">
                                                                No Signature
                                                            </span>
                                                            This document does not require a signature
                                                            before acceptance.
                                                        </label>
                                                    </span>
                                                </li>
                                                <li className="nav-item">
                                                    <span
                                                        className="active mb-0"
                                                        data-bs-toggle="tab"
                                                        data-bs-target="#use-esign"
                                                    >
                                                        <input
                                                            type="radio"
                                                            className="status-radio"
                                                            id="sign2"
                                                            name="email"
                                                            defaultChecked
                                                        />
                                                        <label htmlFor="sign2">
                                                            <span className="sign-title">
                                                                Use e-signature
                                                            </span>
                                                            This document require e-signature before
                                                            acceptance.
                                                        </label>
                                                    </span>
                                                </li>
                                            </ul>
                                            <div className="tab-content">
                                                <div
                                                    className="tab-pane show active"
                                                    id="use-esign"
                                                >
                                                    <div className="input-block mb-0">
                                                        <label className="col-form-label">
                                                            Document Signers{" "}
                                                            <span className="text-danger">*</span>
                                                        </label>
                                                    </div>
                                                    <div className="sign-content">
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <input
                                                                        className="form-control"
                                                                        type="text"
                                                                        placeholder="Enter Name"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="d-flex align-items-center">
                                                                    <div className="float-none mb-3 me-3 w-100">
                                                                        <input
                                                                            className="form-control"
                                                                            type="text"
                                                                            placeholder="Email Address"
                                                                        />
                                                                    </div>
                                                                    <div className="input-btn mb-3">
                                                                        <Link to="#" className="add-sign">
                                                                            <i className="ti ti-circle-plus" />
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">
                                                Content <span className="text-danger"> *</span>
                                            </label>
                                            <textarea
                                                className="form-control"
                                                rows={3}
                                                placeholder="Add Content"
                                                defaultValue={""}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-12 text-end form-wizard-button modal-btn">
                                        <button className="btn btn-light" type="reset">
                                            Reset
                                        </button>
                                        <button
                                            className="btn btn-primary wizard-next-btn"
                                            type="button"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </fieldset>
                    <fieldset>
                        <form>
                            <div className="contact-input-set">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="signature-wrap">
                                            <h4 className="mb-2">
                                                Send the document to following signers
                                            </h4>
                                            <p>In order to send the document to the signers</p>
                                            <div className="input-block mb-0">
                                                <label className="col-form-label">
                                                    Recipients (Additional recipients)
                                                </label>
                                            </div>
                                            <div className="sign-content">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="mb-3">
                                                            <input
                                                                className="form-control"
                                                                type="text"
                                                                placeholder="Enter Name"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="d-flex align-items-center">
                                                            <div className="float-none mb-3 me-3 w-100">
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    placeholder="Email Address"
                                                                />
                                                            </div>
                                                            <div className="input-btn mb-3">
                                                                <Link to="#" className="add-sign">
                                                                    <i className="ti ti-circle-plus" />
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="mb-3">
                                            <label className="col-form-label">
                                                Message Subject{" "}
                                                <span className="text-danger"> *</span>
                                            </label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                placeholder="Enter Subject"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="col-form-label">
                                                Message Text{" "}
                                                <span className="text-danger"> *</span>
                                            </label>
                                            <textarea
                                                className="form-control"
                                                rows={3}
                                                placeholder="Your document is ready"
                                                defaultValue={""}
                                            />
                                        </div>
                                        <button className="btn btn-light mb-3">
                                            Send Now
                                        </button>
                                        <div className="send-success">
                                            <p>
                                                <i className="ti ti-circle-check" /> Document sent
                                                successfully to the selected recipients
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-lg-12 text-end form-wizard-button modal-btn">
                                        <button className="btn btn-light" type="reset">
                                            Cancel
                                        </button>
                                        <button
                                            className="btn btn-primary"
                                            type="button"
                                            data-bs-dismiss="modal"
                                        >
                                            Save &amp; Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </fieldset>
                </div>
            </div>
        </div>
    </div>
</div>
{/* /Add File */ }
{/* Connect Account */ }
<div className="modal custom-modal fade" id="create_email" role="dialog">
    <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Connect Account</h5>
                <button
                    type="button"
                    className="btn-close position-static"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                >
                    <span aria-hidden="true">×</span>
                </button>
            </div>
            <div className="modal-body">
                <div className="mb-3">
                    <label className="col-form-label">
                        Account type <span className="text-danger"> *</span>
                    </label>
                    <Select
                        className="select2"
                        options={accountType}
                        placeholder="Choose"
                        classNamePrefix="react-select"
                    />
                </div>
                <div className="mb-3">
                    <h5 className="form-title">Sync emails from</h5>
                    <div className="sync-radio">
                        <div className="radio-item">
                            <input
                                type="radio"
                                className="status-radio"
                                id="test1"
                                name="radio-group"
                                defaultChecked
                            />
                            <label htmlFor="test1">Now</label>
                        </div>
                        <div className="radio-item">
                            <input
                                type="radio"
                                className="status-radio"
                                id="test2"
                                name="radio-group"
                            />
                            <label htmlFor="test2">1 Month Ago</label>
                        </div>
                        <div className="radio-item">
                            <input
                                type="radio"
                                className="status-radio"
                                id="test3"
                                name="radio-group"
                            />
                            <label htmlFor="test3">3 Month Ago</label>
                        </div>
                        <div className="radio-item">
                            <input
                                type="radio"
                                className="status-radio"
                                id="test4"
                                name="radio-group"
                            />
                            <label htmlFor="test4">6 Month Ago</label>
                        </div>
                    </div>
                </div>
                <div className="col-lg-12 text-end modal-btn">
                    <Link to="#" className="btn btn-light" data-bs-dismiss="modal">
                        Cancel
                    </Link>
                    <button
                        className="btn btn-primary"
                        data-bs-target="#success_mail"
                        data-bs-toggle="modal"
                        data-bs-dismiss="modal"
                    >
                        Connect Account
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
{/* /Connect Account */ }
{/* Success Contact */ }
<div className="modal custom-modal fade" id="success_mail" role="dialog">
    <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
            <div className="modal-header border-0 m-0 justify-content-end">
                <button
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                >
                    <i className="ti ti-x" />
                </button>
            </div>
            <div className="modal-body">
                <div className="success-message text-center">
                    <div className="success-popup-icon bg-light-blue">
                        <i className="ti ti-mail-opened" />
                    </div>
                    <h3>Email Connected Successfully!!!</h3>
                    <p>
                        Email Account is configured with “example@example.com”. Now
                        you can access email.
                    </p>
                    <div className="col-lg-12 text-center modal-btn">
                        <Link to={route.companyDetails} className="btn btn-primary">
                            Go to email
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
{/* /Success Contact */ }
{/* Add Contact */ }
<div className="modal custom-modal fade" id="add_contact" role="dialog">
    <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Add Contact</h5>
                <button
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                >
                    <i className="ti ti-x" />
                </button>
            </div>
            <div className="modal-body">
                <form>
                    <div className="mb-2 icon-form">
                        <span className="form-icon">
                            <i className="ti ti-search" />
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search"
                        />
                    </div>
                    <div className="access-wrap">
                        <ul>
                            <li className="select-people-checkbox">
                                <label className="checkboxs">
                                    <input type="checkbox" />
                                    <span className="checkmarks" />
                                    <span className="people-profile">
                                        <ImageWithBasePath
                                            src="assets/img/profiles/avatar-19.jpg"
                                            alt=""
                                        />
                                        <Link to="#">Darlee Robertson</Link>
                                    </span>
                                </label>
                            </li>
                            <li className="select-people-checkbox">
                                <label className="checkboxs">
                                    <input type="checkbox" />
                                    <span className="checkmarks" />
                                    <span className="people-profile">
                                        <ImageWithBasePath
                                            src="assets/img/profiles/avatar-20.jpg"
                                            alt=""
                                        />
                                        <Link to="#">Sharon Roy</Link>
                                    </span>
                                </label>
                            </li>
                            <li className="select-people-checkbox">
                                <label className="checkboxs">
                                    <input type="checkbox" />
                                    <span className="checkmarks" />
                                    <span className="people-profile">
                                        <ImageWithBasePath
                                            src="assets/img/profiles/avatar-21.jpg"
                                            alt=""
                                        />
                                        <Link to="#">Vaughan</Link>
                                    </span>
                                </label>
                            </li>
                            <li className="select-people-checkbox">
                                <label className="checkboxs">
                                    <input type="checkbox" />
                                    <span className="checkmarks" />
                                    <span className="people-profile">
                                        <ImageWithBasePath
                                            src="assets/img/profiles/avatar-01.jpg"
                                            alt=""
                                        />
                                        <Link to="#">Jessica</Link>
                                    </span>
                                </label>
                            </li>
                            <li className="select-people-checkbox">
                                <label className="checkboxs">
                                    <input type="checkbox" />
                                    <span className="checkmarks" />
                                    <span className="people-profile">
                                        <ImageWithBasePath
                                            src="assets/img/profiles/avatar-16.jpg"
                                            alt=""
                                        />
                                        <Link to="#">Carol Thomas</Link>
                                    </span>
                                </label>
                            </li>
                            <li className="select-people-checkbox">
                                <label className="checkboxs">
                                    <input type="checkbox" />
                                    <span className="checkmarks" />
                                    <span className="people-profile">
                                        <ImageWithBasePath
                                            src="assets/img/profiles/avatar-22.jpg"
                                            alt=""
                                        />
                                        <Link to="#">Dawn Mercha</Link>
                                    </span>
                                </label>
                            </li>
                        </ul>
                    </div>
                    <div className="modal-btn text-end">
                        <Link
                            to="#"
                            className="btn btn-light"
                            data-bs-dismiss="modal"
                        >
                            Cancel
                        </Link>
                        <button
                            type="button"
                            data-bs-dismiss="modal"
                            className="btn btn-primary"
                        >
                            Confirm
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
{/* /Add Contact */ }
{/* Add Owner */ }
<div className="modal custom-modal fade" id="owner" role="dialog">
    <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Add Deal Owner</h5>
                <button
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                >
                    <i className="ti ti-x" />
                </button>
            </div>
            <div className="modal-body">
                <form>
                    <div className="mb-2 icon-form">
                        <span className="form-icon">
                            <i className="ti ti-search" />
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search"
                        />
                    </div>
                    <div className="access-wrap">
                        <ul>
                            <li className="select-people-checkbox">
                                <label className="checkboxs">
                                    <input type="checkbox" defaultChecked />
                                    <span className="checkmarks" />
                                    <span className="people-profile">
                                        <ImageWithBasePath
                                            src="assets/img/profiles/avatar-19.jpg"
                                            alt=""
                                        />
                                        <Link to="#">Darlee Robertson</Link>
                                    </span>
                                </label>
                            </li>
                            <li className="select-people-checkbox">
                                <label className="checkboxs">
                                    <input type="checkbox" />
                                    <span className="checkmarks" />
                                    <span className="people-profile">
                                        <ImageWithBasePath
                                            src="assets/img/profiles/avatar-20.jpg"
                                            alt=""
                                        />
                                        <Link to="#">Sharon Roy</Link>
                                    </span>
                                </label>
                            </li>
                            <li className="select-people-checkbox">
                                <label className="checkboxs">
                                    <input type="checkbox" />
                                    <span className="checkmarks" />
                                    <span className="people-profile">
                                        <ImageWithBasePath
                                            src="assets/img/profiles/avatar-21.jpg"
                                            alt=""
                                        />
                                        <Link to="#">Vaughan</Link>
                                    </span>
                                </label>
                            </li>
                            <li className="select-people-checkbox">
                                <label className="checkboxs">
                                    <input type="checkbox" />
                                    <span className="checkmarks" />
                                    <span className="people-profile">
                                        <ImageWithBasePath
                                            src="assets/img/profiles/avatar-01.jpg"
                                            alt=""
                                        />
                                        <Link to="#">Jessica</Link>
                                    </span>
                                </label>
                            </li>
                            <li className="select-people-checkbox">
                                <label className="checkboxs">
                                    <input type="checkbox" />
                                    <span className="checkmarks" />
                                    <span className="people-profile">
                                        <ImageWithBasePath
                                            src="assets/img/profiles/avatar-16.jpg"
                                            alt=""
                                        />
                                        <Link to="#">Carol Thomas</Link>
                                    </span>
                                </label>
                            </li>
                            <li className="select-people-checkbox">
                                <label className="checkboxs">
                                    <input type="checkbox" />
                                    <span className="checkmarks" />
                                    <span className="people-profile">
                                        <ImageWithBasePath
                                            src="assets/img/profiles/avatar-22.jpg"
                                            alt=""
                                        />
                                        <Link to="#">Dawn Mercha</Link>
                                    </span>
                                </label>
                            </li>
                        </ul>
                    </div>
                    <div className="modal-btn text-end">
                        <Link
                            to="#"
                            className="btn btn-light"
                            data-bs-dismiss="modal"
                        >
                            Cancel
                        </Link>
                        <button
                            type="button"
                            data-bs-dismiss="modal"
                            className="btn btn-primary"
                        >
                            Confirm
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
{/* /Add Owner */ }
{/* Deal Status */ }
<div className="modal custom-modal fade" id="deal_status" role="dialog">
    <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Deal Status</h5>
                <button
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                >
                    <i className="ti ti-x" />
                </button>
            </div>
            <div className="modal-body">
                <form>
                    <div className="mb-3">
                        <label className="col-form-label">
                            Status <span className="text-danger">*</span>
                        </label>
                        <Select
                            className="select2"
                            classNamePrefix="react-select"
                            options={status}
                            placeholder="Choose"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="col-form-label">
                            Reason <span className="text-danger">*</span>
                        </label>
                        <textarea
                            className="form-control"
                            rows={5}
                            defaultValue={""}
                        />
                    </div>
                    <div className="modal-btn text-end">
                        <Link
                            to="#"
                            className="btn btn-light"
                            data-bs-dismiss="modal"
                        >
                            Cancel
                        </Link>
                        <button
                            type="button"
                            data-bs-dismiss="modal"
                            className="btn btn-primary"
                        >
                            Confirm
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
{/* /Deal Status */ }
{/* Add New Pipeline */ }
<div
    className="offcanvas offcanvas-end offcanvas-large"
    tabIndex={-1}
    id="offcanvas_pipeline"
>
    <div className="offcanvas-header border-bottom">
        <h4>Add New Pipeline</h4>
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
            <div>
                <div className="mb-3">
                    <label className="col-form-label">
                        Pipeline Name <span className="text-danger">*</span>
                    </label>
                    <input className="form-control" type="text" />
                </div>
                <div className="mb-3">
                    <div className="pipe-title d-flex align-items-center justify-content-between">
                        <h5 className="form-title">Pipeline Stages</h5>
                        <Link
                            to="#"
                            className="add-stage"
                            data-bs-toggle="modal"
                            data-bs-target="#add_stage"
                        >
                            <i className="ti ti-square-rounded-plus" />
                            Add New
                        </Link>
                    </div>
                    <div className="pipeline-listing">
                        <div className="pipeline-item">
                            <p>
                                <i className="ti ti-grip-vertical" /> Inpipeline
                            </p>
                            <div className="action-pipeline">
                                <Link
                                    to="#"
                                    data-bs-toggle="modal"
                                    data-bs-target="#edit_stage"
                                >
                                    <i className="ti ti-edit text-blue" />
                                    Edit
                                </Link>
                                <Link to="#" onClick={() => setOpenModal(true)}>
                                    <i className="ti ti-trash text-danger" />
                                    Delete
                                </Link>
                            </div>
                        </div>
                        <div className="pipeline-item">
                            <p>
                                <i className="ti ti-grip-vertical" /> Follow Up
                            </p>
                            <div className="action-pipeline">
                                <Link
                                    to="#"
                                    data-bs-toggle="modal"
                                    data-bs-target="#edit_stage"
                                >
                                    <i className="ti ti-edit text-blue" />
                                    Edit
                                </Link>
                                <Link to="#" onClick={() => setOpenModal(true)}>
                                    <i className="ti ti-trash text-danger" />
                                    Delete
                                </Link>
                            </div>
                        </div>
                        <div className="pipeline-item">
                            <p>
                                <i className="ti ti-grip-vertical" /> Schedule Service
                            </p>
                            <div className="action-pipeline">
                                <Link
                                    to="#"
                                    data-bs-toggle="modal"
                                    data-bs-target="#edit_stage"
                                >
                                    <i className="ti ti-edit text-blue" />
                                    Edit
                                </Link>
                                <Link to="#" onClick={() => setOpenModal(true)}>
                                    <i className="ti ti-trash text-danger" />
                                    Delete
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mb-3">
                    <h5 className="form-title">Access</h5>
                    <div className="d-flex flex-wrap access-item nav">
                        <div
                            className="radio-btn"
                            data-bs-toggle="tab"
                            data-bs-target="#all"
                        >
                            <input
                                type="radio"
                                className="status-radio"
                                id="all"
                                name="status"
                                defaultChecked
                            />
                            <label htmlFor="all">All</label>
                        </div>
                        <div
                            className="radio-btn"
                            data-bs-toggle="tab"
                            data-bs-target="#select-person"
                        >
                            <input
                                type="radio"
                                className="status-radio"
                                id="select"
                                name="status"
                            />
                            <label htmlFor="select">Select Person</label>
                        </div>
                    </div>
                    <div className="tab-content mb-3">
                        <div className="tab-pane fade" id="select-person">
                            <div className="access-wrapper">
                                <div className="access-view">
                                    <div className="access-img">
                                        <ImageWithBasePath
                                            src="assets/img/profiles/avatar-21.jpg"
                                            alt="Image"
                                        />
                                        Vaughan
                                    </div>
                                    <Link to="#">Remove</Link>
                                </div>
                                <div className="access-view">
                                    <div className="access-img">
                                        <ImageWithBasePath
                                            src="assets/img/profiles/avatar-01.jpg"
                                            alt="Image"
                                        />
                                        Jessica
                                    </div>
                                    <Link to="#">Remove</Link>
                                </div>
                            </div>
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
                <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#create_pipeline"
                >
                    Create
                </button>
            </div>
        </form>
    </div>
</div>
{/* /Add New Pipeline */ }
{/* Add New Stage */ }
<div className="modal custom-modal fade" id="add_stage" role="dialog">
    <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Add New Stage</h5>
                <button
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                >
                    <i className="ti ti-x" />
                </button>
            </div>
            <div className="modal-body">
                <form>
                    <div className="mb-3">
                        <label className="col-form-label">Stage Name *</label>
                        <input type="text" className="form-control" />
                    </div>
                    <div className="modal-btn text-end">
                        <Link
                            to="#"
                            className="btn btn-light"
                            data-bs-dismiss="modal"
                        >
                            Cancel
                        </Link>
                        <button
                            type="button"
                            data-bs-dismiss="modal"
                            className="btn btn-danger"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
{/* /Add New Stage */ }
{/* Create Pipeline */ }
<div
    className="modal custom-modal fade"
    id="create_pipeline"
    role="dialog"
>
    <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
            <div className="modal-header border-0 m-0 justify-content-end">
                <button
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                >
                    <i className="ti ti-x" />
                </button>
            </div>
            <div className="modal-body">
                <div className="success-message text-center">
                    <div className="success-popup-icon bg-light-blue">
                        <i className="ti ti-building" />
                    </div>
                    <h3>Pipeline Created Successfully!!!</h3>
                    <p>View the details of pipeline, created</p>
                    <div className="col-lg-12 text-center modal-btn">
                        <Link
                            to="#"
                            className="btn btn-light"
                            data-bs-dismiss="modal"
                        >
                            Cancel
                        </Link>
                        <Link to={route.dealsDetails} className="btn btn-primary">
                            View Details
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
{/* /Create Pipeline*/ }
{/* Edit Stage */ }
<div className="modal custom-modal fade" id="edit_stage" role="dialog">
    <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Edit Stage</h5>
                <button
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                >
                    <i className="ti ti-x" />
                </button>
            </div>
            <div className="modal-body">
                <form>
                    <div className="mb-3">
                        <label className="col-form-label">Stage Name *</label>
                        <input
                            type="text"
                            className="form-control"
                            defaultValue="Inpipeline"
                        />
                    </div>
                    <div className="modal-btn text-end">
                        <Link
                            to="#"
                            className="btn btn-light"
                            data-bs-dismiss="modal"
                        >
                            Cancel
                        </Link>
                        <button
                            type="button"
                            data-bs-dismiss="modal"
                            className="btn btn-danger"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
{/* /Edit Stage */ }
{/* Delete Stage */ }
<Modal show={openModal} onHide={() => setOpenModal(false)}>
    <div className="modal-body">
        <div className="text-center">
            <div className="avatar avatar-xl bg-danger-light rounded-circle mb-3">
                <i className="ti ti-trash-x fs-36 text-danger" />
            </div>
            <h4 className="mb-2">Remove Stage?</h4>
            <p className="mb-0">
                Are you sure you want to remove <br /> stage you selected.
            </p>
            <div className="d-flex align-items-center justify-content-center mt-4">
                <Link
                    to="#"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                >
                    Cancel
                </Link>
                <Link to={route.contactList} className="btn btn-danger">
                    Yes, Delete it
                </Link>
            </div>
        </div>
    </div>
</Modal>
{/* /Delete Stage */ }