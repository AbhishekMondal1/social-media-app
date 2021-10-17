import "./message.css";
import { format } from "timeago.js";
const Message = ({message, own}) => {
  return (
    <div className={own ? "message own" : "message"}>
      <div className="message-top">
        <img
          className="message-img"
          src={`https://image.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg`}
          alt=""
        />
        <p className="message-text">{message.text}</p>
      </div>
      <div className="message-bottom">{format(message.createdAt)}</div>
    </div>
  );
}

export default Message;
