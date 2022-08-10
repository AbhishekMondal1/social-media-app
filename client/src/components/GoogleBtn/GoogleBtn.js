import React from "react";
import propTypes from "prop-types";
import "./googleBtn.css";

const GoogleBtn = (props) => {
  const { title } = props;
  return (
    <button type="button" className="login-with-google-btn">
      {title}
    </button>
  );
};

GoogleBtn.propTypes = {
  title: propTypes.string.isRequired,
};

export default GoogleBtn;
