
const PermissionAccess = ({name}) => {
  const permissions =JSON?.parse(localStorage.getItem("permissions"))
  const isAdmin = localStorage?.getItem("role")
  const allPermissions = permissions?.filter((i)=>i?.module_name === name)?.[0]?.permissions
  // const isView = allPermissions?.view
  // const isCreate = allPermissions?.create
  // const isUpdate = allPermissions?.update
  // const isDelete = allPermissions?.delete
    return allPermissions
}

export default PermissionAccess