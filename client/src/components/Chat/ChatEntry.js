import React from "react";

const ChatEntry = ({ user, socket, room, chatEntrySubmit }) => {
  return (
    <form className="ChatEntry" onSubmit={chatEntrySubmit}>
      <input className="button menu-button" type="submit"/>
      <input type="text"/>
    </form>
  )
}

export default ChatEntry;