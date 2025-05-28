import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addCallResult, updateCallResult } from "../../../../redux/callResult";
import { useState } from "react";
import { updateUser } from "../../../../redux/manage-user";

const ChangePassword = (  ) => {
  const { loading } = useSelector((state) => state.callStatuses);
  const [userDetails , setUserDetails ] = useState()

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const dispatch = useDispatch();

  useEffect(()=>{
setUserDetails(JSON.parse(localStorage.getItem("user")))
  },[])
  // Prefill form in edit mode
  useEffect(() => {
    if ( userDetails) {
      reset({
        full_name: userDetails.full_name || "",
        phone: userDetails.phone || "",
        address: userDetails.address || "",
        username: userDetails.username || "",
        email: userDetails.email || "",
        role_id: userDetails.crms_d_user_role?.[0]?.crms_m_role?.id || "",
        is_active: userDetails.is_active,
      });
    }
  }, [userDetails, reset]);

  const onSubmit = async(data) => {
    const closeButton = document.getElementById( "close_btn_change_password_modal",);
 try{ 
     await dispatch(updateUser({id: userDetails.id,
          userData: data} )).unwrap();
    reset(); // Clear the form
    closeButton.click();
}catch (error){
     closeButton.click();
}
  };

  return (
    <div className="modal fade" id="change_password_modal" tabindex="-1" role="dialog" >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              Change Password
            </h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close_btn_change_password_modal"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              {/* Call Result Name */}
              <div className="mb-3">
                <label className="col-form-label">
                  Current Password<span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  className={`form-control ${errors.currentPassword ? "is-invalid" : ""}`}
                  {...register("currentPassword", {
                    required: "Current password is required.",
                  })}
                />
                {errors.currentPassword && (
                  <small className="text-danger">{errors.currentPassword.message}</small>
                )}
              </div>
              {/* Call Result Name */}
              <div className="mb-3">
                <label className="col-form-label">
                  New Password <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  {...register("password", {
                    required: "Password is required.",
                    minLength: {
                      value: 3,
                      message: "Password must be at least 3 characters.",
                    },
                  })}
                />
                {errors.password && (
                  <small className="text-danger">{errors.password.message}</small>
                )}
              </div>
              {/* Call Result Name */}
              <div className="mb-3">
                <label className="col-form-label">
                  Confirm Password <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  className={`form-control ${errors.repeatPassword ? "is-invalid" : ""}`}
                  {...register("repeatPassword", {
                    required: "Confirm password is required.",
                    validate: (value) =>
                        value === watch("password") || "Passwords is not matched !",
                  })}
                />
                {errors.repeatPassword && (
                  <small className="text-danger">{errors.repeatPassword.message}</small>
                )}
              </div>

            
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <div className="d-flex align-items-center justify-content-end m-0">
                <Link
                  to="#"
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </Link>
                <button
                  disabled={loading}
                  type="submit"
                  className="btn btn-primary"
                >
                  {loading
                      ? "Updating"
                      : "Update"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
