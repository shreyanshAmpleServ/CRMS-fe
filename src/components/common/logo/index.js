import React from "react";
import logo_path from "../../../assets/logo-2.png";


const Logo = ({base_path}) => {
    return (
        <>
            <img src={logo_path || `${base_path}/assets/img/logo/logo-2.png`} alt="Logo" style={{ width: "65px" }} className="p-2 " />

            <img style={{ width: "60px" ,background:"rgba(255,255,255,.2)" ,marginTop:"10px",marginBottom:"10px", borderRadius:"10px" }}
                src={logo_path || `${base_path}/assets/img/logo/logo-2.png`}
                className="white-logo p-1"
                alt="Logo"
            />
        </>
    );
};

export default Logo;
