<Modal show={openModal2} onHide={() => setOpenModal2(false)}>
              <div className="modal-header border-0 m-0 justify-content-end">
                <button
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setOpenModal2(false)}
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <div className="modal-body">
                <div className="success-message text-center">
                  <div className="success-popup-icon bg-light-blue">
                    <i className="ti ti-user-plus" />
                  </div>
                  <h3>Contact Created Successfully!!!</h3>
                  <p>View the details of contact, created</p>
                  <div className="col-lg-12 text-center modal-btn">
                    <Link
                      to="#"
                      className="btn btn-light"
                      onClick={() => setOpenModal2(false)}
                    >
                      Cancel
                    </Link>
                    <Link to={route.contactDetails} className="btn btn-primary">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </Modal>