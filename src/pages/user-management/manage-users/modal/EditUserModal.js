import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { updateUser } from "../../../../redux/manage-user";
import { fetchRoles } from "../../../../redux/roles";

const EditUserModal = ({ user }) => {
  const dispatch = useDispatch();
  const [isChangePassword,setIsChangePassword] = useState("N")

  // Access roles and user update state from Redux
  const { roles, loading: rolesLoading } = useSelector((state) => state.roles);
  const { loading } = useSelector((state) => state.users);

  const [selectedAvatar, setSelectedAvatar] = useState(null); // For profile image upload

  // React Hook Form setup
  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      password: "",
      repeatPassword: "",
      full_name: user?.full_name || "",
      phone: user?.phone || "",
      address: user?.address || "",
      role_id:user?.crms_d_user_role?.[0]?.crms_m_role?.id || null,
      is_active: user?.is_active || "Y",
    },
  });

  useEffect(() => {
    dispatch(fetchRoles());
    // Pre-fill form values with user data
    if (user) {
      Object.keys(user).forEach((key) => {
        setValue(key, user[key]);
      });
    }
  }, [dispatch, user, setValue]);

  // Handle avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedAvatar(file);
    }
  };
useEffect(()=>{
  if (user) {
    reset({
      username: user?.username || "",
      email: user?.email || "",
      password: "",
      repeatPassword: "",
      full_name: user?.full_name || "",
      phone: user?.phone || "",
      address: user?.address || "",
      role_id:user?.crms_d_user_role?.[0]?.crms_m_role?.id || null,
      is_active: user?.is_active || "Y",
});}
},[user])
  // Map roles for react-select
  const roleOptions = roles?.map((role) => ({
    value: role.id,
    label: role.role_name,
  }));

  const onSubmit = async (data) => {
    const closeButton = document.getElementById("close_edit_user");
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== null) {
        formData.append(key, data[key]);
      }
    });

    if (selectedAvatar) {
      formData.append("profile_img", selectedAvatar);
    }

    try {
      await dispatch(updateUser({ id: user.id, userData: formData })).unwrap();
      closeButton.click();
      reset();
      setSelectedAvatar(null);
    } catch (error) {
      closeButton.click();
    }
  };
  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_edit_user");
    if (offcanvasElement) {
      const handleModalClose = () => {
        reset()
        setSelectedAvatar(null);
      };
      offcanvasElement.addEventListener(
        "hidden.bs.offcanvas",
        handleModalClose
      );
      return () => {
        offcanvasElement.removeEventListener(
          "hidden.bs.offcanvas",
          handleModalClose
        );
      };
    }
  }, []);

  return (
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="offcanvas_edit_user"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="fw-semibold">Edit User</h5>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          id="close_edit_user"
        >
          <i className="ti ti-x" />
        </button>
      </div>
      <div className="offcanvas-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register("entityType", { value: "user" })} />
          <input type="hidden" {...register("username", { value: "sjsdj" })} />
          <div className="row">
            {/* Profile Image Upload */}
            <div className="col-md-12">
              <div className="profile-pic-upload">
                <div className="profile-pic">
                  {selectedAvatar ? (
                    <img
                      src={URL.createObjectURL(selectedAvatar)}
                      alt="Avatar Preview"
                      className="img-fluid"
                    />
                  ) : user?.profile_img ? (
                    <img
                      src={user.profile_img}
                      alt="Current Avatar"
                      className="img-fluid"
                    />
                  ) : (
                    <span>
                      <i className="ti ti-photo" />
                    </span>
                  )}
                </div>
                <div className="upload-content">
                  <div className="upload-btn">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                    <span>
                      <i className="ti ti-file-broken" />
                      Upload File
                    </span>
                  </div>
                  <p>JPG, GIF, or PNG. Max size of 800K</p>
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Full Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  {...register("full_name", {
                    required: "Full Name is required",
                  })}
                />
                {errors.full_name && (
                  <small className="text-danger">
                    {errors.full_name.message}
                  </small>
                )}
              </div>
            </div>

            {/* Username */}
            {/* <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Username <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  {...register("username", {
                    required: "Username is required",
                  })}
                />
                {errors.username && (
                  <small className="text-danger">
                    {errors.username.message}
                  </small>
                )}
              </div>
            </div> */}

            {/* Email */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Username/Email <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <small className="text-danger">{errors.email.message}</small>
                )}
              </div>
            </div>

            {/* Role */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Role <span className="text-danger">*</span>
                </label>

                <Select
                  className="react-select"
                  options={roleOptions}
                  isLoading={rolesLoading}
                  onChange={(selectedOption) => {
                    // Update the value of "role_id" in the form state
                    setValue("role_id", selectedOption?.value);
                  }}
                  value={
                    roleOptions?.find((option) => option.value === watch("role_id") ) || ""
                  }
                  placeholder="Select Role"
                />
                {errors.role_id && (
                  <small className="text-danger">
                    {errors.role_id.message}
                  </small>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Phone <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  {...register("phone", {
                    required: "Phone number is required",
                  })}
                />
                {errors.phone && (
                  <small className="text-danger">{errors.phone.message}</small>
                )}
              </div>
            </div>
            <div className="col-md-12">
                  <div className="status-toggle small-toggle-btn d-flex align-items-center justify-content-end ">
                    <span className="me-2 fw-semibold label-text">Change Password</span>
                    <Controller
                      name="is_reminder"
                      control={control}
                      render={({ field }) => (
                        <>
                          <input
                            type="checkbox"
                            id="emailOptOut"
                            className="check"
                            {...field}
                            checked={isChangePassword === "Y"}
                            onChange={(e) =>
                              e.target.checked ? setIsChangePassword("Y") : setIsChangePassword("N")
                        }
                          />
                          <label htmlFor="emailOptOut" className="checktoggle" style={{height:"18px ",width:"32px"}} >
                            
                          </label>
                        </>
                      )}
                    />
                  </div>
                </div>
                 {/* Password */}
               {isChangePassword === "Y" &&  <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  {...register("password")}
                />
                {errors.password && (
                  <small className="text-danger">
                    {errors.password.message}
                  </small>
                )}
              </div>
            </div>}

              {/* Repeat password */}
          {isChangePassword === "Y" &&  <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Confirm password
                </label>
                <input
                  type="password"
                  className="form-control"
                  {...register("repeatPassword", {
                    required: "Confirm password  is not matched !",
                    validate: (value) =>
                      value === watch("password") || "Passwords is not match",
                  })}
                />
                {errors.repeatPassword && (
                  <small className="text-danger">
                    {errors.repeatPassword.message}
                  </small>
                )}
              </div>
            </div>}

            {/* Address */}
            <div className="col-md-12">
              <div className="mb-3">
                <label className="col-form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  {...register("address")}
                />
              </div>
            </div>

            {/* Status */}
            <div className="col-md-6">
              <div className="radio-wrap">
                <label className="col-form-label">Status</label>
                <div className="d-flex align-items-center gap-4">
                  <div className="d-flex align-items-center gap-2">
                    <input
                      type="radio"
                      id="active"
                      name="status"
                      value="Y"
                      defaultChecked={user?.is_active === "Y"}
                      {...register("is_active")}
                    />
                    <label htmlFor="active">Active</label>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <input
                      type="radio"
                      id="inactive"
                      name="status"
                      value="N"
                      defaultChecked={user?.is_active === "N"}
                      {...register("is_active")}
                    />
                    <label htmlFor="inactive">Inactive</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center justify-content-end">
            <button
              type="button"
              className="btn btn-light me-2"
              data-bs-dismiss="offcanvas"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
              {loading && (
                  <div
                    style={{
                      height: "15px",
                      width: "15px",
                    }}
                    className="spinner-border ml-2 text-light"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
