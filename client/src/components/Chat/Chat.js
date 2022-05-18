import React from "react";
import ChatEntry from "./ChatEntry";

const Chat = ({ user, socket, room }) => {
  const chatEntrySubmit = e => {
    e.preventDefault();
    e.bl
  }

  return (
    <div className="Chat">
      <div className="Chat-body">

      </div>
      <ChatEntry chatEntrySubmit={chatEntrySubmit}/>
    </div>
  )
}

export default Chat;