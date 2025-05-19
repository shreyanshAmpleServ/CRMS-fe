import { Switch, Checkbox, ConfigProvider } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "../../../../components/common/dataTable/index";
import {
  addPermissions,
  fetchPermissions,
} from "../../../../redux/permissions";
import { Link } from "react-router-dom";

export const PermissionModal = ({
  permissionModal,
  setPermissionModal,
  moduleId,
}) => {
  const dispatch = useDispatch();
  const [updatedData, setUpdatedData] = useState([]);

  const { permissions, loading, error, success } = useSelector(
    (state) => state.permissions
  );
  useEffect(() => {
    setUpdatedData(permissions);
  }, [permissions]);
  React.useEffect(() => {
    moduleId?.id && dispatch(fetchPermissions(moduleId?.id));
  }, [dispatch, moduleId?.id]);

  // Handle switch change
  const handleSwitchChange = (record, permissionType, checked) => {
    console.log("chacked", checked, record);
    const newData = updatedData?.permissions?.map((item) =>
      item.module_name === record.module_name
        ? {
            ...item,
            permissions:
              permissionType === "all"
                ? {
                    view: checked,
                    update: checked,
                    delete: checked,
                    create: checked,
                  }
                : {
                    ...item.permissions,
                    [permissionType]: checked,
                  },
          }
        : item
    );
    setUpdatedData({
      role_id: updatedData?.role_id,
      permissions: newData,
    });
  };

  const handleSwitchChangeWhole = (permissionType, checked) => {
    console.log("chacked", checked);
    const newData = updatedData?.permissions?.map((item) => ({
      ...item,
      permissions: {
        ...item.permissions,
        [permissionType]: checked,
      },
    }));
    setUpdatedData({
      role_id: updatedData?.role_id,
      permissions: newData,
    });
  };

  const handleSubmit = () => {
    dispatch(addPermissions(updatedData));
    setPermissionModal(false);
  };

  const columns = [
    {
      title: "Module",
      ellipsis: true,
      width:"30%",
      dataIndex: "module_name",
      render: (text, record) => (
        <div className="d-flex gap-2" >
          <Checkbox
            size="small"
            className=""
            checked={
              record?.permissions?.update &&
              record?.permissions?.delete &&
              record?.permissions?.view &&
              record?.permissions?.create
                ? true
                : false
            }
            onChange={(e) => {
              handleSwitchChange(record, "all", e?.target?.checked);
            }}
          />
          <div className="d-flex flex-wrap text-wrap">{text}</div>
        </div>
      ),
    },
    {
      title: (
        <div className="w-100 ">
          {"View"}{" "}
          <Checkbox
            size="small"
            onChange={(e) => {
              console.log("Checked", e);
              handleSwitchChangeWhole("view", e?.target?.checked);
            }}
          />
        </div>
      ),
      dataIndex: "permissions",
      render: (text, record) => (<div className="text-center">
        <ConfigProvider theme={{ token: { colorPrimary: "#22bb33" } }}>
          <Switch
            size="default"
            className="1"
            checked={text.view || false}
            onChange={(checked) => handleSwitchChange(record, "view", checked)}
          />
        </ConfigProvider>
        </div>
      ),
    },
    {
      title: (
        <div className="w-100">
          {"Create"}{" "}
          <Checkbox
            size="small"
            onChange={(e) => {
              console.log("Checked", e);
              handleSwitchChangeWhole("create", e?.target?.checked);
            }}
          />
        </div>
      ),
      dataIndex: "permissions",
      render: (text, record) => (<div className="text-center">
        <ConfigProvider theme={{ token: { colorPrimary: "#22bb33" } }}>
          <Switch
            size="default"
            className="1"
            checked={text.create || false}
            onChange={(checked) =>
              handleSwitchChange(record, "create", checked)
            }
          />
        </ConfigProvider>
        </div>
      ),
    },
    {
      title: (
        <div className="w-100 ">
          {"Update"}{" "}
          <Checkbox
            size="small"
            onChange={(e) => {
              console.log("Checked", e);
              handleSwitchChangeWhole("update", e?.target?.checked);
            }}
          />
        </div>
      ),
      dataIndex: "permissions",
      render: (text, record) => (<div className="text-center">
        <ConfigProvider theme={{ token: { colorPrimary: "#22bb33" } }}>
          <Switch
            size="default"
            className="1"
            checked={text.update || false}
            onChange={(checked) =>
              handleSwitchChange(record, "update", checked)
            }
          />
        </ConfigProvider>
        </div>
      ),
    },
    {
      title: (
        <div className="w-100 text-center">
          {"Delete"}{" "}
          <Checkbox
            size="small"
            onChange={(e) => {
              console.log("Checked", e);
              handleSwitchChangeWhole("delete", e?.target?.checked);
            }}
          />
        </div>
      ),
      dataIndex: "permissions",
      render: (text, record) => (<div className="text-center">
        <ConfigProvider theme={{ token: { colorPrimary: "#22bb33" } }}>
          <Switch
            size="default"
            className="1"
            checked={text.delete || false}
            onChange={(checked) =>
              handleSwitchChange(record, "delete", checked)
            }
          />
        </ConfigProvider>
        </div>
      ),
    },
  ];
  return (
    <>
      {permissionModal && (
        <div
          className="modal fade show"
          id="delete_contact"
          role="dialog"
          style={{ display: "block" }}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ width: "100%" }}
          >
            <div className="modal-content" style={{ width: "100%" }}>
              <div className="modal-body" style={{ width: "100%" }}>
                <div>
                <div className="d-flex justify-content-between align-content-center">
                  <h4 className="mb-1">
                    Map Role To Module
                    <span
                      className="text-success"
                      style={{ fontWeight: "500", fontSize: "15px" }}
                    >
                      {" "}
                      ({moduleId?.name})
                    </span>
                  </h4>
                  <Link to="#" >
                  <i className="ti ti-circle-x h2 text-primary "  onClick={() => setPermissionModal(false)} />
                  </Link>
                  </div>
                  <hr className="border-dark" />
                  <div className="d-flex  flex-wrap " style={{height:"70vh",overflow:"auto"}}>
                    <ConfigProvider
                      theme={{
                        components: {
                          Table: {
                            // headerBg: "#f0f0f0",
                            headerPadding: "4px 0px",
                            padding: "16px 10px",
                            fontSize: 14,
                          },
                        },
                      }}
                    >
                      <Table
                        className="customs-table border-dark"
                        dataSource={updatedData?.permissions}
                        columns={columns}
                        loading={loading}
                        border={true}
                        paginaiton={false}
                        isPermission={true}
                      />
                    </ConfigProvider>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mt-2">
                    <button
                      className="btn btn-light me-2"
                      onClick={() => setPermissionModal(false)} // Close the modal without deleting
                    >
                      Cancel
                    </button>
                    <button className="btn btn-danger" onClick={handleSubmit}>
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
