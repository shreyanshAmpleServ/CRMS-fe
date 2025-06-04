import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import CollapseHeader from "../../../components/common/collapse-header";
import ImageWithDatabase from "../../../components/common/ImageFromDatabase";
import { fetchUserByToken, updateUser } from "../../../redux/manage-user";
import { Link } from "react-router-dom";
import { useState } from "react";

const Profile = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState();
  const [phone, setPhone] = useState();
  const [address, setAddress] = useState();
  const [selectedAvatar, setSelectedAvatar] = useState();
  const [isReset, setIsReset] = useState(false);

  useEffect(() => {
    dispatch(fetchUserByToken());
  }, [dispatch]);
  const { userDetail, loading } = useSelector((state) => state.users);

  useEffect(() => {
    setName(userDetail?.full_name);
    setPhone(userDetail?.phone);
    setAddress(userDetail?.address);
  }, [userDetail]);

  useEffect(() => {
    if (isReset) {
      setSelectedAvatar(null);
      setName(userDetail?.full_name);
      setPhone(userDetail?.phone);
      setAddress(userDetail?.address);
      setIsReset(false);
    }
  }, [isReset]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedAvatar(file);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("full_name", name);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("username", userDetail?.username);
    formData.append("email", userDetail?.email);
    formData.append("is_active", userDetail?.is_active);
    formData.append(
      "role_id",
      userDetail?.crms_d_user_role?.[0]?.crms_m_role?.id
    );
    if (selectedAvatar) {
      formData.append("profile_img", selectedAvatar);
    }
    console.log("FormData : ", ...formData);
    try {
      await dispatch(
        updateUser({ id: userDetail.id, userData: formData })
      ).unwrap();
      //   closeButton.click();
      setSelectedAvatar(null);
    } catch (error) {
      //   closeButton.click();
    }
  };

  // const renderNavTabs = () => (
  //     <ul className="nav nav-tabs nav-tabs-bottom">
  //         {[
  //             { to: route.profile, icon: "ti-settings-cog", text: "General Settings", active: true },
  //             { to: route.companySettings, icon: "ti-world-cog", text: "Website Settings" },
  //             { to: route.invoiceSettings, icon: "ti-apps", text: "App Settings" },
  //             { to: route.emailSettings, icon: "ti-device-laptop", text: "System Settings" },
  //             { to: route.paymentGateways, icon: "ti-moneybag", text: "Financial Settings" },
  //             { to: route.storage, icon: "ti-flag-cog", text: "Other Settings" },
  //         ].map((tab, index) => (
  //             <li className="nav-item me-3" key={index}>
  //                 <Link to={tab.to} className={`nav-link px-0 ${tab.active ? "active" : ""}`}>
  //                     <i className={`ti ${tab.icon}`} /> {tab.text}
  //                 </Link>
  //             </li>
  //         ))}
  //     </ul>
  // );

  // const renderSidebarLinks = () => (
  //     <div className="list-group list-group-flush settings-sidebar">
  //         {[
  //             { to: route.profile, text: "Profile", active: true },
  //             { to: route.security, text: "Security" },
  //             { to: route.notification, text: "Notifications" },
  //             { to: route.connectedApps, text: "Connected Apps" },
  //         ].map((link, index) => (
  //             <Link
  //                 to={link.to}
  //                 key={index}
  //                 className={`fw-medium ${link.active ? "active" : ""}`}
  //             >
  //                 {link.text}
  //             </Link>
  //         ))}
  //     </div>
  // );

  const renderProfileForm = () => (
    <form onSubmit={handleSubmit}>
      {/* Employee Info */}
      {/* <SectionHeader title="Employee Information" description="Provide the information below" /> */}
      <div className="mb-3">
        <div className="profile-upload ">
          {selectedAvatar ? (
            <div className="profile-upload-img  mx-auto">
              <ImageWithDatabase
                className="h-100 rounded"
                src={URL.createObjectURL(selectedAvatar)}
              />
            </div>
          ) : userDetail?.profile_img ? (
            <div className="profile-upload-img  mx-auto">
              <ImageWithDatabase
                className="h-100 rounded"
                src={userDetail?.profile_img}
              />
            </div>
          ) : (
            <div className="profile-upload-img mx-auto">
              <span>
                <i className="ti ti-photo" />
              </span>
              <img
                id="ImgPreview"
                src="assets/img/profiles/avatar-03.jpg"
                alt="img"
                className="preview1"
              />
              <button
                type="button"
                id="removeImage1"
                className="profile-remove"
              >
                <i className="feather-x" />
              </button>
            </div>
          )}
          <div className="profile-upload-content">
            <label className="profile-upload-btns">
              <i className="ti ti-pencil" />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                id="imag"
                className="input-img"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="border-bottom mb-3">
        <div className="row">
          {[
            {
              label: "Full Name",
              required: true,
              value: name,
              onChanges: (e) => {
                setName(e.target.value);
                console.log("Hiiii: ", e);
              },
            },
            {
              label: "Username/Email",
              required: true,
              disable: true,
              value: userDetail?.email,
              onChanges: (e) => {},
            },
            {
              label: "Role",
              required: true,
              disable: true,
              value: userDetail?.role,
              onChanges: (e) => {},
            },
            {
              label: "Phone",
              required: true,
              value: phone,
              onChanges: (e) => setPhone(e.target.value),
            },
            {
              label: "Address",
              required: true,
              value: address,
              onChanges: (e) => setAddress(e.target.value),
            },
          ].map((field, index) => (
            <div className="col-md-6" key={index}>
              <FormField
                label={field.label}
                required={field.required}
                disable={field.disable}
                onChange={field.onChanges}
                value={field?.value}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Address Info */}
      {/* <SectionHeader title="Address" description="Please enter the address details" />
            <div className="row">
                <div className="col-md-12">
                    <FormField label="Address" required />
                </div>
                {[
                    { label: "Country", required: true },
                    { label: "State / Province", required: true },
                    { label: "City", required: true },
                    { label: "Postal Code", required: true },
                ].map((field, index) => (
                    <div className="col-lg-3 col-md-6" key={index}>
                        <FormField label={field.label} required={field.required} />
                    </div>
                ))}
            </div> */}

      {/* Buttons */}
      <div className="text-end">
        <Link onClick={() => setIsReset(true)} className="btn btn-light me-2">
          Cancel
        </Link>
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? "Updating ...." : " Save Changes"}
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
  );

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>DCC CRMS - My Profile</title>
        <meta
          name="My Profile"
          content="This is My Profile page of DCC CRMS."
        />
      </Helmet>
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            {/* Page Header */}
            <PageHeader title="Settings">
              <CollapseHeader />
            </PageHeader>

            {/* Settings Menu */}
            {/* <div className="card">
                            <div className="card-body pb-0 pt-2">{renderNavTabs()}</div>
                        </div> */}

            <div className="row">
              {/* Sidebar */}
              {/* <div className="col-xl-3 col-lg-12 theiaStickySidebar">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="fw-semibold mb-3">General Settings</h4>
                                        {renderSidebarLinks()}
                                    </div>
                                </div>
                            </div> */}

              {/* Content */}
              <div className="position-relative col-xl-12 col-lg-12">
                {loading ? (
                  <div
                    style={{
                      zIndex: 9999,
                      paddingTop: "30vh",
                      minHeight: "70vh",
                      backgroundColor: "rgba(255, 255, 255, 0.33)",
                    }}
                    className=" position-absolute d-flex  w-100 top-0   h-100 bg-gray justify-content-center "
                  >
                    <div
                      className="spinner-border position-absolute d-flex justify-content-center  text-primary"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <div className="card">
                    <div className="card-body">
                      <h4 className="fw-semibold mb-3">Profile Settings</h4>
                      {renderProfileForm()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const PageHeader = ({ title, children }) => (
  <div className="page-header">
    <div className="row align-items-center">
      <div className="col-sm-4">
        <h4 className="page-title">{title}</h4>
      </div>
      <div className="col-sm-8 text-sm-end">
        <div className="head-icons">{children}</div>
      </div>
    </div>
  </div>
);

const SectionHeader = ({ title, description }) => (
  <div className="border-bottom mb-3 pb-3">
    <h5 className="fw-semibold mb-1">{title}</h5>
    <p>{description}</p>
  </div>
);

const FormField = ({ label, required, value, onChange, disable }) => (
  <div className="mb-3">
    <label className="form-label">
      {label} {required && <span className="text-danger">*</span>}
    </label>
    <input
      type="text"
      className="form-control"
      onChange={onChange}
      disabled={disable}
      value={value}
    />
  </div>
);

export default Profile;
