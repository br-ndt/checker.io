import React, { Children, useEffect, useRef, useState } from "react";
import socketIO from "socket.io-client";
import socketEndpoint from "../services/socketEndpoint.js";

const SocketContext = ({ children, user }) => {
  const [message, setMessage] = useState("connecting...");
  const [userInSocketSesh, setUserInSocketSesh] = useState(false);
  const socket = useRef(socketIO(socketEndpoint));

  useEffect(() => {
    if (user) {
      let socketTimeout;
      socket.current.emit("addUser", () => {
        console.log(`User ${user.id} logged in`);
        setMessage("");
        setUserInSocketSesh(true);
      });

      socket.current.on("getUsers", (users, context) => {
        console.log("Current users", users, `(${context})`);
      });

      socket.current.on("connect_error", () => {
        socketTimeout = setTimeout(() => socket.current.connect(), 5000);
      });

      socket.current.on("disconnect", () => {
        setMessage("server disconnected");
      });

      return () => {
        console.log(socket.current.id, " disconnected");
        if (socketTimeout) clearTimeout(socketTimeout);
        socket.current.disconnect();
      };
    } else {
      setUserInSocketSesh(false);
      socket.current.disconnect();
    }
  }, [user]);

  const messageSpace = message ? <h3 className="system-message">{message}</h3> : null;

  const childrenRender = userInSocketSesh
    ? React.Children.map(children, (child) =>
        React.cloneElement(child, {
          socket: socket.current,
        })
      )
    : null;

  if (user) {
    return (
      <>
        {messageSpace}
        {childrenRender}
      </>
    );
  }
};

export default SocketContext;
