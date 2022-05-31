import React, { useEffect, useRef, useState } from "react";
import ChatEntry from "./ChatEntry";

const Chat = ({ user, socket, room }) => {
  const [messages, setMessages] = useState([]);
  const messageListRef = useRef([]);

  messageListRef.current = messages;

  useEffect(() => {
    socket.on("notification", (data) => {
      setMessages([...messageListRef.current, { text: data.description}]);
    });

    socket.on("newMessage", (data) => {
      setMessages([...messageListRef.current, data]);
    });
  }, []);

  const messageList = messages.map((message) => {
    if(message.user) {
      return (
        <li className="message">
          <p>
            <span className={message.color}>{message.user}</span>: {message.text}
          </p>
        </li>
      );
    } else {
      return (
        <li className="notification">
          <p>
            {message.text}
          </p>
        </li>
      )
    }
  });

  console.log(messageList);

  const chatEntrySubmit = (message) => {
    socket.emit("sendMessage", room, user, message, () => {});
  };

  return (
    <div className="Chat">
      <div className="Chat-body">
        <ul className="messages">{messageList}</ul>
      </div>
      <ChatEntry chatEntrySubmit={chatEntrySubmit} />
    </div>
  );
};

export default Chat;
