import React, { useState, useEffect, useRef } from 'react';
import './App.css'; // Import your CSS file for styling

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8080');
    ws.current.onmessage = (event) => {
      handleMessage(event.data);
    };
    return () => {
      ws.current.close();
    };
  }, []);

  const handleMessage = (message) => {
    if (typeof message === 'string') {
      try {
        const messageData = JSON.parse(message);
        const newMessage = { message: messageData.message, type: 'received' };
        setMessages(prevMessages => [...prevMessages, newMessage]);
      } catch (error) {
        console.error('Error parsing JSON message:', error);
      }
    } else if (message instanceof Blob) {
      const reader = new FileReader();
      reader.onload = function() {
        const text = reader.result;
        const newMessage = { message: text, type: 'received' }; // Assuming Blob contains text data
        setMessages(prevMessages => [...prevMessages, newMessage]);
      };
      reader.readAsText(message);
    } else {
      console.error('Unsupported message type:', typeof message);
    }
  };

  const sendMessage = () => {
    if (input.trim() !== '') {
      const newMessage = { message: input, type: 'sent' };
      ws.current.send(JSON.stringify({ message: input })); // Send message to server
      setMessages(prevMessages => [...prevMessages, newMessage]); // Display sent message locally
      setInput(''); // Clear input field
    }
  };

  return (
    <div className="app-container">
      <div className="message-container">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            {msg.message}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
