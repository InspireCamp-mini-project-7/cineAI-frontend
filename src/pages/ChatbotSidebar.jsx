import React, { useState, useEffect, useRef } from 'react';
import './ChatbotSidebar.css';
import axios from 'axios';

const ChatbotSidebar = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const imagePath = import.meta.env.VITE_IMAGE_PATH;

  const chatContainerRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // 사용자 메시지 추가
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user'
    };
    
    setMessages([...messages, userMessage]);
    setInputMessage('');

    try {
      const response = await axios.post('/api/movies/qa',
        {question: inputMessage}
      );

      // 임시 봇 응답
      setTimeout(() => {
        const botMessage = {
          id: messages.length + 2,
          text: response.data.data.answer,
          sender: 'bot'
        };
        setMessages(prev => [...prev, botMessage]);
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]); // messages가 변경될 때마다 실행

  return (
    <div className={`chatbot-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="chatbot-header">
        <img className='chatbot-logo' src={`${imagePath}/cineaiIcon.png`}/>
        <div className='chatbot-text'>CineAI Chatbot</div>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="messages-container" ref={chatContainerRef} style={{ overflowY: "auto", height: "400px" }}>
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            {message.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="input-container">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="챗봇과 대화를 시작하세요"
          className="message-input"
        />
        <button type="submit" className="send-button">전송</button>
      </form>
    </div>
  );
};

export default ChatbotSidebar;