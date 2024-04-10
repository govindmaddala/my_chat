/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

const Pill = ({ name, clickFun }) => {
  return (
    <span className="pill">
      <span className="first-name">{name[0]}</span>
      <span>{name} <span className="pill-cross" onClick={clickFun}>&times;</span> </span>
    </span>
  );
};

export default Pill;
