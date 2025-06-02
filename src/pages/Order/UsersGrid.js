import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ImageWithBasePath from "../../components/common/imageWithBasePath";
import { deleteUser } from "../../redux/manage-user";
// import EditUserModal from "./modal/EditUserModal"; // Update modal for editing users
import DeleteAlert from "./alert/DeleteAlert";
import moment from "moment";
import { deleteProduct } from "../../redux/products";
import AddProductModal from "./modal/AddOrderModal";

const UsersGrid = ({ data }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedProduct, setSelectedProduct] = useState(null); // For modal context
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Delete confirmation
  const [visibleItems, setVisibleItems] = useState(3); // Default number of users visible
  const [loading, setLoading] = useState(false); // State for Load More button

  // Handles showing the delete modal for a user
  const handleDeleteProduct = (user) => {
    setSelectedProduct(user); // Set the user to delete
    setShowDeleteModal(true); // Show confirmation modal
  };

  // Confirm and delete the user
  const deleteData = () => {
    if (selectedProduct) {
      dispatch(deleteProduct(selectedProduct.id)); // Call delete action with user ID
      setShowDeleteModal(false); // Close modal
    }
  };

  // Load more users dynamically
  const handleLoadMore = () => {
    setLoading(true); // Show loading state
    setTimeout(() => {
      setVisibleItems((prev) => prev + 3); // Load 3 more users
      setLoading(false); // Hide loading state
    }, 1000); // Simulated loading delay
  };

  return (
    <>
      <div className="row p-2">
        {data.slice(0, visibleItems).map((product, index) => (
          <div className="col-xxl-4 col-xl-4 col-md-6" key={product.id || index}>
            <div className="card border" style={{ height: "auto" }}>
              <div className="card-body pb-1">
                {/* product Details Header */}
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center">
                    {/* product Avatar */}
                    <Link
                      to={`#`}
                      className="avatar avatar-md flex-shrink-0 me-2"
                    >
                      {product?.product_image ? (
                        <img
                          src={product?.product_image}
                          alt="product Avatar"
                          className="preview"
                        />
                      ) : (
                        <ImageWithBasePath
                          src="assets/img/profiles/default-avatar.jpg"
                          alt="Default Avatar"
                        />
                      )}
                    </Link>
                    {/* product Info */}
                    <div>
                      <h6>
                        <Link to={`#`} className="fw-medium">
                          {product.name || "N/A"}
                        </Link>
                      </h6>
                      {/* <p className="text-default">{product.code || "N/A"}</p> */}
                      <div className="d-flex align-items-center">
                      {/* <span className="avatar avatar-xs bg-light-300 p-0 flex-shrink-0 rounded-circle text-dark me-2">
                        <i className="ti ti-map-pin" />
                      </span> */}
                      <p>{`${product?.code}`}</p>
                    </div>
                    </div>
                  </div>
                  {/* Actions Dropdown */}
                  <div className="dropdown table-action">
                    <Link
                      to="#"
                      className="action-icon"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="fa fa-ellipsis-v" />
                    </Link>
                    <div className="dropdown-menu dropdown-menu-right">
                      {/* Edit Action */}
                      <Link
                        className="dropdown-item"
                        to="#"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvas_add_edit_product"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <i className="ti ti-edit text-blue" /> Edit
                      </Link>
                      {/* Delete Action */}
                      <Link
                        className="dropdown-item"
                        to="#"
                        onClick={() => handleDeleteProduct(product)}
                      >
                        <i className="ti ti-trash text-danger" /> Delete
                      </Link>
                    </div>
                  </div>
                </div>

                {/* product Additional Details */}
                <div className="d-block">
                  <div className="d-flex flex-column mb-3">
                    
                    <p className="text-default d-inline-flex align-items-center mb-2">
                      <i className="ti ti-user-filled text-dark me-1" />
                      <span className="d-flex gap-3">
                        <span className="text-black fw-medium">Manufacturer</span>
                        <span>   {product.manufacturer?.name || "No Manufacturer"}</span>
                      </span>
                   
                    </p>
                    <p className="text-default d-inline-flex align-items-center mb-2">
                      <i className="ti ti-user-filled text-dark me-1" />
                      <span className="d-flex gap-3">
                        <span className="text-black fw-medium">Vendor</span>
                        <span>  {product?.vendor?.name || "No Vendor"}</span>
                      </span>
                    </p>
                    <p className="text-default d-inline-flex align-items-center mb-2">
                      <i className="ti ti-receipt-2 text-dark me-1" />
                      <span className="d-flex gap-3">
                        <span className="text-black fw-medium">Unit Price</span>
                        <span> {product.unit_price || "N/A"}</span>
                      </span>
                    </p>
                    <p className="text-default d-inline-flex align-items-center mb-2">
                      <i className="ti ti-receipt-dollar text-dark me-1" />
                      <span className="d-flex gap-3">
                        <span className="text-black fw-medium">Currency</span>
                        <span>  {product.Currency.code ||  "N/A"}</span>
                      </span>

                    </p>
                    <p className="text-default d-inline-flex align-items-center mb-2">
                      <i className="ti ti-receipt text-black me-1" />
                      <span className="d-flex gap-3">
                        <span className="text-black fw-medium">OnHand</span>
                        <span>  {product.onhand ||  "N/A"}</span>
                      </span>
                    </p>
                    <p className="text-default d-inline-flex align-items-center mb-2">
                      <i className="ti ti-cash text-dark me-1" />
                      <span className="d-flex gap-3">
                        <span className="text-black fw-medium">Ordered</span>
                        <span>  {product.ordered ||  "N/A"}</span>
                      </span>
                    </p>
                    <p className="text-default d-inline-flex align-items-center mb-2">
                      <i className="ti ti-cash text-dark me-1" />
                      <span className="d-flex gap-3">
                        <span className="text-black fw-medium">Commited</span>
                        <span>  {product.commited ||  "N/A"}</span>
                      </span>
                    </p>
                    <p className="text-default d-inline-flex align-items-center mb-2">
                      <i className="ti ti-cash text-dark me-1" />
                      <span className="d-flex gap-3">
                        <span className="text-black fw-medium">Reorder Level</span>
                        <span>  {product.reorder_level ||  "N/A"}</span>
                      </span>
                      {product.reorder_level || "No Code"}
                    </p>
                    <p className="text-default d-inline-flex align-items-center mb-2">
                      <i className="ti ti-calendar-time text-dark me-1" />
                      <span className="d-flex gap-3">
                        <span className="text-black fw-medium">Created at</span>
                        <span>  {moment(product.createdate).format("ll") }</span>
                      </span>
                     
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Load More Button */}
      {visibleItems < data.length && (
        <div className="load-btn text-center pb-4">
          <button onClick={handleLoadMore} className="btn btn-primary">
            {loading ? (
              <>
                Loading... <i className="ti ti-loader" />
              </>
            ) : (
              "Load More Users"
            )}
          </button>
        </div>
      )}
      {/* Modals */}
       <AddProductModal product={selectedProduct} setProduct={setSelectedProduct} />
      {/* <EditUserModal user={selectedProduct} /> */}
      <DeleteAlert
        label="User"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        onDelete={deleteData}
      />{" "}
      {/* Delete confirmation modal */}
    </>
  );
};

export default UsersGrid;
