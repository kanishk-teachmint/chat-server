// ChatClient.js (React component)

import React, { useState, useEffect } from 'react';

const ChatClient = () => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    setWs(ws);

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    ws.onmessage = (event) => {
      setMessages(prevMessages => [...prevMessages, event.data]);
    };

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws && messageInput.trim() !== '') {
      ws.send(messageInput);
      setMessageInput('');
    }
  };

  const handleChange = (event) => {
    setMessageInput(event.target.value);
  };

  return (
    <div>
      <h2>Chat App</h2>
      <div>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <input
        type="text"
        value={messageInput}
        onChange={handleChange}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatClient;
