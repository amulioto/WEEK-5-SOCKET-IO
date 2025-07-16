import React, { useState } from "react";
import Chat from "./components/Chat";

function App() {
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);

  const handleJoin = (e) => {
    e.preventDefault();
    if (username.trim()) setJoined(true);
  };

  if (!joined) {
    return (
      <form onSubmit={handleJoin}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
        />
        <button type="submit">Join Chat</button>
      </form>
    );
  }

  return <Chat username={username} />;
}

export default App;