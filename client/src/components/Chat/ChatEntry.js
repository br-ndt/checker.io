import React, { useState } from "react";

const ChatEntry = ({ user, socket, room, chatEntrySubmit }) => {
  const [message, setMessage] = useState("");

  const onChange = e => {
    e.preventDefault();
    setMessage(e.currentTarget.value);
  };

  const onSubmit = e => {
    e.preventDefault();
    if(e.currentTarget.message.value.trim()) {
      chatEntrySubmit(e.currentTarget.message.value);
      clearForm();
    }
  }

  const clearForm = () => {
    setMessage("");
  }

  return (
    <form className="ChatEntry" onSubmit={onSubmit}>
      <input className="button menu-button" type="submit" />
      <input name="message" onChange={onChange} type="text" value={message} />
    </form>
  );
};

export default ChatEntry;
