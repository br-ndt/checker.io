import React, { useEffect, useRef, useState } from "react";
import ChatEntry from "./ChatEntry";

const Chat = ({ user, socket, room }) => {
  const [messages, setMessages] = useState([]);
  const messageListRef = useRef([]);
  const messageEndRef = useRef(null);

  messageListRef.current = messages;

  useEffect(() => {
    socket.on("notification", (data) => {
      setMessages([...messageListRef.current, { text: data.description }]);
    });

    socket.on("newMessage", (data) => {
      setMessages([...messageListRef.current, data]);
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length])

  const messageList = messages.map((message, index) => {
    if (message.user) {
      return (
        <li key={`${message}-${index}`} className="message">
          <p>
            <span className={message.color}>{message.user}</span>: {message.text}
          </p>
        </li>
      );
    } else {
      return (
        <li className="notification">
          <p>{message.text}</p>
        </li>
      );
    }
  });

  const chatEntrySubmit = (message) => {
    socket.emit("sendMessage", room, user, message, () => {});
  };

  const scrollToBottom = () => {
    messageEndRef.current.scrollIntoView({ block: 'start', behavior: "smooth" });
  };

  return (
    <div className="Chat">
      <div className="Chat-body">
        <ul className="messages">
          {messageList}
          <div ref={messageEndRef} />
        </ul>
      </div>
      <ChatEntry chatEntrySubmit={chatEntrySubmit} />
    </div>
  );
};

export default Chat;
