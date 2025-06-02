import React from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../components/common/imageWithBasePath";

const AccessUserModel = () => {
  const users = [
    { id: 1, name: "Vaughan", image: "assets/img/profiles/avatar-21.jpg" },
    { id: 2, name: "Jessica", image: "assets/img/profiles/avatar-01.jpg" },
  ];

  return (
    <div className="tab-content">
      <div className="tab-pane fade" id="select-person">
        <div className="access-wrapper">
          {users?.data?.map((user) => (
            <div className="access-view" key={user.id}>
              <div className="access-img">
                <ImageWithBasePath src={user.image} alt="User Avatar" />
                {user.name}
              </div>
              <Link to="#">Remove</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccessUserModel;
