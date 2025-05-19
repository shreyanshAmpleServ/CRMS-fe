import React from "react";
import { Link } from "react-router-dom";
const RightSideBar = ({ title }) => {
    return (
        <>
            <h4 className="fw-semibold mb-3">Lead Pipeline Status</h4>
            <div className="pipeline-list">
                <ul>
                    <li>
                        <Link to="#" className="bg-pending">
                            Not Contacted
                        </Link>
                    </li>
                    <li>
                        <Link to="#" className="bg-info">
                            Contacted
                        </Link>
                    </li>
                    <li>
                        <Link to="#" className="bg-success">
                            Closed
                        </Link>
                    </li>
                    <li>
                        <Link to="#" className="bg-danger">
                            Lost
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default RightSideBar;
