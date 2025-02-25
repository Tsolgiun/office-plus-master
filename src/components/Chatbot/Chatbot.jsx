import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';

const API_URL = 'http://127.0.0.1:5000/api/chat';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: 'Hello! How can I help you today?', isBot: true }
  ]);
  const [inputText, setInputText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const currentResponseRef = useRef('');

  // Scroll to bottom of messages
  // Debounced scroll function
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // Only scroll on complete messages or user input
  useEffect(() => {
    if (!isStreaming || messages[messages.length - 1]?.isBot === false) {
      // Small delay to ensure content is rendered
      const timeoutId = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [messages, isStreaming]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isStreaming) return;

    // Store messages locally to avoid state issues
    const updatedMessages = [...messages];
    
    // Add user message
    const userMessage = { text: inputText, isBot: false };
    updatedMessages.push(userMessage);
    setMessages(updatedMessages);
    
    // Add placeholder for bot response
    const botMessageIndex = updatedMessages.length;
    updatedMessages.push({ text: '', isBot: true });
    setMessages(updatedMessages);
    
    // Clear input and reset response
    setInputText('');
    currentResponseRef.current = '';
    setIsStreaming(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: inputText,
          sessionId: localStorage.getItem('chatSessionId') || 'default'
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                currentResponseRef.current += data.content;
                // Update only the bot message, keeping user messages intact
                const newMessages = [...updatedMessages];
                newMessages[botMessageIndex] = {
                  text: currentResponseRef.current,
                  isBot: true
                };
                setMessages(newMessages);
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      
      if (error.message.includes('404')) {
        errorMessage = 'Server is not responding. Please ensure the backend server is running.';
      } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage = 'Network connection error. Please check your internet connection.';
      }
      
      // Update only the bot message with the error, keeping other messages intact
      const newMessages = [...updatedMessages];
      newMessages[botMessageIndex] = {
        text: errorMessage,
        isBot: true
      };
      setMessages(newMessages);
    } finally {
      setIsStreaming(false);
      inputRef.current?.focus();
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      <button className="chatbot-toggle" onClick={handleToggle}>
        {isOpen ? '✕' : '💬'}
      </button>
      
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Office Plus Assistant</h3>
          </div>
          
          <div className="chatbot-messages">
            <div className="messages-container" ref={messagesEndRef}>
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.isBot ? 'bot' : 'user'}`}>
                  {msg.text}
                </div>
              ))}
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="chatbot-input-form">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder={isStreaming ? 'Please wait...' : 'Type your message...'}
              disabled={isStreaming}
              className="chatbot-input"
            />
            <button 
              type="submit" 
              className="chatbot-send"
              disabled={isStreaming || !inputText.trim()}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
