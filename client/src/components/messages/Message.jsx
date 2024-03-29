import "./message.css";
import Moment from "react-moment";
import propTypes from "prop-types";

const Message = ({ message, own }) => {
  return (
    <div className={own ? "message own" : "message"}>
      <div className="message-top">
        <img
          className="message-img"
          src={
            message.sender[0]?.pic ||
            `https://image.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg`
          }
          alt=""
        />
        <p className="message-text">{message.text}</p>
      </div>
      <div className="message-bottom">
        <Moment fromNow>{message.createdAt}</Moment>
      </div>
    </div>
  );
};

Message.propTypes = {
  message: propTypes.object.isRequired,
  own: propTypes.bool.isRequired,
};

export default Message;
