import React, { useState } from "react";
import { Link } from "react-router-dom";

const AddNewStage = ({ onAddStage, modelID }) => {
  const [stageName, setStageName] = useState("");
  const [colorCode, setColorCode] = useState("#000");
  const [stageNameError, setStageNameError] = useState(null);

  const handleSaveChanges = (e) => {
    const closeModel = document.getElementById(`btn-${modelID}`);
    if (stageName.trim() === "") {
      setStageNameError("Stage Name is required!");
      return;
    }
    closeModel.click();
    onAddStage(stageName, colorCode);
    setStageName("");
  };
  const handleNameChange = (name) => {
    if (name.trim() == "") {
      setStageNameError("Stage Name is required!");
    } else {
      setStageNameError("");
    }
    setStageName(name);
  };

  const handleColorChange = (color) => {
    setColorCode(color);
  };

  return (
    <div className="modal custom-modal fade" id={modelID} role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add New Stage</h5>
            <button
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              id={`btn-${modelID}`}
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="col-form-label">Stage Name *</label>
              <input
                type="text"
                className="form-control"
                value={stageName}
                onChange={(e) => handleNameChange(e.target.value)}
              />
              {stageNameError && (
                <small className="text-danger">{stageNameError}</small>
              )}
            </div>
            <div className="mb-3">
              <label className="col-form-label">Stage Color</label>
              <input
                type="color"
                className="form-control form-control-color"
                value={colorCode}
                onChange={(e) => handleColorChange(e.target.value)}
              />
            </div>
            <div className="modal-btn text-end">
              <Link to="#" className="btn btn-light" data-bs-dismiss="modal">
                Cancel
              </Link>
              <button
                type="buton"
                onClick={handleSaveChanges}
                className="btn btn-danger"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewStage;
