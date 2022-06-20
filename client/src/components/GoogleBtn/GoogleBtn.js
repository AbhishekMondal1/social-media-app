import React from "react";
import "./googleBtn.css";

const GoogleBtn = (props) => {
    const { title } = props;
    return (
        <button type="button" class="login-with-google-btn" >
            {title}
        </button>
    )

}

export default GoogleBtn;