import React from "react"
import { MdOutlineDoNotDisturb } from "react-icons/md";

const UnauthorizedImage = () => {
    return (
        <div style={{width:"50%" ,height:'55vh'}} className="d-flex flex-column  align-items-center justify-content-center  w-100 py-5 gap-3">
        <MdOutlineDoNotDisturb  style={{fontSize:"10rem" }} className="text-danger"/>
        <div style={{fontSize:"2rem"  }} className="text-dark fw-medium">You don't have permission  !</div>
        <div style={{fontSize:"1rem" ,padding:"0 10rem"   }} className=" fw-medium text-center">🔒 Oops! It looks like you don’t have the necessary permissions to access this. Need help? Contact your admin for access.</div>

        {/* <p className="h3 font-weight-semibold">No Data Found</p> */}
      </div>
      
    )
}

export default UnauthorizedImage