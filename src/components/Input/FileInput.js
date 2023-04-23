import React from "react";
import "./styles.css";

const FileInput = ({ accept, onFileSelected }) => {
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelected(e.target.files[0]);
    }
  };

  return (
    <>
      <input
        type="file"
        accept={accept}
        id="hidden-input-file"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <label htmlFor="hidden-input-file" className="custom-input-file-button">
        Upload File
      </label>
    </>
  );
};

export default FileInput;
