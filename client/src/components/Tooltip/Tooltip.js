import React from "react";
import propTypes from "prop-types";
import "./tooltip.css";

const Tooltip = (props) => {
  return (
    <div className="con-tooltip down">
      <div className="tooltip">
        <p>{props.title}</p>
      </div>
    </div>
  );
};

Tooltip.propTypes = {
  title: propTypes.string.isRequired,
};

export default Tooltip;
