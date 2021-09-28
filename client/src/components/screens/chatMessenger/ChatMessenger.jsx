import React, { useContext, useEffect, useRef } from 'react';
import axios from 'axios';

 const ChatMessenger = () => {
return (
    <>
        <div className="messenger">
            <div className="conversationMenu">
                conversations
            </div>
            <div className="chatBox">
                chat
            </div>
            <div className="chatOnline">
                Online Chats
            </div>
        </div>
    </>
)
}

export default ChatMessenger;
