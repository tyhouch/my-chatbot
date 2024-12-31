#!/usr/bin/env bash

# This script should be run from your my-chatbot project root directory.

###############################
# Overwrite pages/api/chat.js
###############################
cat <<EOF > pages/api/chat.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, model } = req.body;

    // Prepend a 'developer' instruction to the conversation
    // (This ensures the model has a consistent persona or style.)
    const conversation = [
      { role: "developer", content: "You are a helpful assistant." },
      ...messages,
    ];

    // Call the OpenAI chat completion endpoint with full conversation
    const response = await openai.chat.completions.create({
      model: model || "gpt-4o",
      messages: conversation,
    });

    const assistantMessage = response.choices[0].message;

    // Return the new assistant message
    return res.status(200).json({ assistantMessage });
  } catch (error) {
    console.error("Error generating completion:", error);
    return res.status(500).json({ error: "Error generating text" });
  }
}
EOF

##############################
# Overwrite pages/index.js
##############################
cat <<EOF > pages/index.js
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
    <div style={{ margin: 20 }}>
      <h1>Multi-turn Chatbot</h1>

      {/* Model Selector */}
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="model-selector" style={{ marginRight: '8px' }}>
          Select Model:
        </label>
        <select
          id="model-selector"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          style={{ padding: '4px' }}
        >
          <option value="gpt-4o">gpt-4o</option>
          <option value="gpt-4o-mini">gpt-4o-mini</option>
        </select>
      </div>

      {/* Display conversation */}
      <div style={{ marginBottom: '20px' }}>
        {messages.map((msg, index) => {
          return (
            <div key={index} style={{ marginBottom: '8px' }}>
              <strong>{msg.role === 'user' ? 'You:' : 'Assistant:'}</strong>
              <p style={{ whiteSpace: 'pre-wrap', margin: '4px 0 0 0' }}>
                {msg.content}
              </p>
            </div>
          );
        })}
      </div>

      {/* Input & Send button */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{ flex: 1, padding: '8px' }}
          placeholder="Type your question or message..."
        />
        <button onClick={handleSend} style={{ padding: '8px' }}>
          Send
        </button>
      </div>
    </div>
  );
}
EOF

########################
# Finish
########################
echo "Successfully updated chat functionality for multi-turn conversations and model selection!"
echo "You can now run 'npm run dev' to test it out."
