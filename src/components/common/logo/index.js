import React from "react";

const Logo = ({base_path}) => {
    return (
        <>
            <img src={`${base_path}/assets/img/logo/logo-2.png`} alt="Logo" style={{ width: "65px" }} className="p-2 p-lg-1" />

            <img style={{ width: "65px" ,background:"rgba(255,255,255,.2)" ,marginTop:"10px",marginBottom:"10px", borderRadius:"10px" }}
                src={`${base_path}/assets/img/logo/logo-2.png`}
                className="white-logo p-1"
                alt="Logo"
            />
        </>
    );
};

export default Logo;
