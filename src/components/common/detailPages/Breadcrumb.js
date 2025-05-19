import React from "react";
import { Link } from "react-router-dom";

const Breadcrumb = ({ links }) => {
    return (
        <div className="contact-head">
            <div className="row align-items-center">
                <div className="col-sm-8">
                    <ul className="contact-breadcrumb">
                        {links.map((link, index) => (
                            <li key={index}>
                                {link.path ? (
                                    <Link to={link.path}>
                                        {link.icon && <i className={link.icon} />} {link.label}
                                    </Link>
                                ) : (
                                    link.label
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Breadcrumb;
