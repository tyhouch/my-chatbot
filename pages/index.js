import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [model, setModel] = useState('gpt-4o');

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    // Add user's message to our local state conversation
    const newMessages = [
      ...messages,
      { role: 'user', content: inputValue },
    ];
    setMessages(newMessages);
    setInputValue('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, model }),
      });
      const data = await res.json();

      if (data.assistantMessage) {
        // Add the assistant's response to our local state conversation
        setMessages((prev) => [...prev, data.assistantMessage]);
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div style={{ 
      maxWidth: '1000px', 
      margin: '0 auto',
      padding: '20px 40px',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <h1>Chatbot Demo</h1>

      {/* Model Selector */}
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="model-selector" style={{ marginRight: '8px' }}>
          Select Model:
        </label>
        <select
          id="model-selector"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          style={{ 
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}
        >
          <option value="gpt-4o">gpt-4o</option>
          <option value="gpt-4o-mini">gpt-4o-mini</option>
        </select>
      </div>

      {/* Display conversation */}
      <div style={{ 
        flex: 1,
        overflowY: 'auto',
        marginBottom: '20px'
      }}>
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          return (
            <div key={index} style={{ 
              display: 'flex',
              justifyContent: isUser ? 'flex-end' : 'flex-start',
              marginBottom: '12px'
            }}>
              <div style={{
                maxWidth: '70%',
                backgroundColor: isUser ? '#2E8B57' : '#F0F0F0',
                color: isUser ? 'white' : 'black',
                padding: '12px 16px',
                borderRadius: '12px',
                borderBottomRightRadius: isUser ? '4px' : '12px',
                borderBottomLeftRadius: isUser ? '12px' : '4px',
              }}>
                <p style={{ 
                  whiteSpace: 'pre-wrap',
                  margin: 0,
                  fontSize: '15px',
                  lineHeight: '1.4'
                }}>
                  {msg.content}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input & Send button - Now sticky */}
      <div style={{ 
        position: 'sticky',
        bottom: 0,
        backgroundColor: 'white',
        padding: '20px 0',
        borderTop: '1px solid #eee',
        display: 'flex',
        gap: '8px'
      }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{ 
            flex: 1,
            padding: '12px',
            borderRadius: '24px',
            border: '1px solid #ddd',
            fontSize: '15px'
          }}
          placeholder="Type your message..."
        />
        <button 
          onClick={handleSend} 
          style={{ 
            padding: '12px 24px',
            backgroundColor: '#2E8B57',
            color: 'white',
            border: 'none',
            borderRadius: '24px',
            fontSize: '15px',
            cursor: 'pointer'
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
