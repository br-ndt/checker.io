import React, { useState, useEffect } from "react";
import socketIO from "socket.io-client";
const ENDPOINT = "http://localhost:3000";

const SocketClock = (props) => {
  const [time, setTime] = useState("Awaiting server connection...");

  useEffect(() => {
    const socket = socketIO(ENDPOINT);
    let socketTimeout;
    socket.on("connect", () => console.log(socket.id, " connected"));
    socket.on("connect_error", () => {
      socketTimeout = setTimeout(() => socket.connect(), 5000);
    });
    socket.on("time", (data) => {
      setTime(data);
    });
    socket.on("disconnect", () => {
      setTime("server disconnected");
    });

    return () => {
      console.log(socket.id, " disconnected");
      if (socketTimeout) clearTimeout(socketTimeout);
      socket.disconnect();
    };
  }, []);

  return (
    <p>
      <time dateTime={time}>{time}</time>
    </p>
  );
};

export default SocketClock;
