import React from "react";
import CollapseHeader from "../collapse-header";

const PageHeader = ({ title }) => {
    return (
        <div className="page-header">
            <div className="row align-items-center">
                <div className="col-8">
                    <h4 className="page-title">{title}</h4>
                </div>
                <div className="col-4 text-end">
                    <div className="head-icons">
                        <CollapseHeader />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageHeader;
