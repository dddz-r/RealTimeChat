import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App({ socket }) {
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (username) {
      socket.emit("join_room", room, username);
    }
  }, [username, room]);

  const joinRoom = () => {
    if (room !== "") {
      setUsername(prompt("Please enter your name"));
    }
  };

  const sendMessage = () => {
    if (message.trim() !== "") {
      socket.emit("send_message", { message, room, username });
      setMessage("");
      setMessages([...messages, { message, username: "Me" }]);
    }
  };

  const leaveRoom = () => {
    socket.emit("leave_room", room, username);
    setRoom("");
    setMessages([]);
    setUsername("");
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="App">
      {!username && (
        <div>
          <input
            placeholder="Room Number..."
            value={room}
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Join Room</button>
        </div>
      )}
      {username && (
        <div>
          <h2>Welcome, {username}!</h2>
          <button onClick={leaveRoom}>Leave Room</button>
          <div className="message-container">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.username === 'Me' ? 'my-message' : 'other-message'}`}
              >
                <strong>{msg.username}:</strong> {msg.message}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="input-container">
            <input
              type="text"
              placeholder="Message..."
              value={message}
              onChange={(event) => {
                setMessage(event.target.value);
              }}
            />
            <button onClick={sendMessage}>Send Message</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
