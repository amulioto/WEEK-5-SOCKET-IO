import React, { useState, useEffect } from "react";
import socket from "../socket";

function Chat({ username }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    socket.emit("join", username);

    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("typing", ({ user, isTyping }) => {
      setTyping(isTyping ? `${user} is typing...` : "");
    });

    socket.on("userList", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("message");
      socket.off("typing");
      socket.off("userList");
    };
  }, [username]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("message", message);
      setMessage("");
      socket.emit("typing", false);
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    socket.emit("typing", e.target.value.length > 0);
  };

  return (
    <div>
      <div>
        <strong>Online:</strong> {onlineUsers.join(", ")}
      </div>
      <div style={{ height: 200, overflowY: "auto", border: "1px solid #ccc" }}>
        {messages.map((msg, idx) => (
          <div key={idx}>
            <b>{msg.user}</b> [{msg.time}]: {msg.text}
          </div>
        ))}
      </div>
      <div>{typing}</div>
      <form onSubmit={sendMessage}>
        <input
          value={message}
          onChange={handleTyping}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;