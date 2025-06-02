<Modal show={openModal} onHide={() => setOpenModal(false)}>

              <div className="modal-header border-0 m-0 justify-content-end">
                <button
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setOpenModal(false)}
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <div className="modal-body">
                <div className="success-message text-center">
                  <div className="success-popup-icon bg-light-blue">
                    <i className="ti ti-medal" />
                  </div>
                  <h3>Deal Created Successfully!!!</h3>
                  <p>View the details of deal, created</p>
                  <div className="col-lg-12 text-center modal-btn">
                    <Link
                      to="#"
                      className="btn btn-light"
                      onClick={() => setOpenModal(false)}
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