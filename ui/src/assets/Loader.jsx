/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";

const Loader = ({ visible }) => {
  return (
    <>
      {visible ? (
        <div style={{ position: "absolute", top: "50%", left: "45%" }}>
          <div className="spinner-grow text-primary" role="status"></div>
          <div className="spinner-grow text-secondary" role="status"></div>
          <div className="spinner-grow text-success" role="status"></div>
          <div className="spinner-grow text-danger" role="status"></div>
          <div className="spinner-grow text-warning" role="status"></div>
          <div className="spinner-grow text-info" role="status"></div>
          <div className="spinner-grow text-dark" role="status"></div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Loader;
