'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [name, setName] = useState('');
  const [isAllowed, setIsAllowed] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false); // Added loading state

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    const res = await fetch('/api/check-name', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });

    const data = await res.json();

    if (data.isMohini) {
      setIsAllowed(true);

      // Get compliment as the first message
      const complimentRes = await fetch('/api/compliment');
      const complimentData = await complimentRes.json();
      setMessages([{ sender: 'ai', text: complimentData.compliment }]);
    } else {
      setError('Sorry, You are not allowed to enter this magical space 🌸');
    }

    setLoading(false); // Stop loading after name check
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    setLoading(true); // Start loading when sending the message

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    setMessages((prev) => [...prev, { sender: 'ai', text: data.reply }]);

    setLoading(false); // Stop loading after receiving response
  };

  return (
    <main className="min-h-screen bg-teal-50 flex flex-col items-center justify-center px-4 py-8">
      {!isAllowed ? (
        <form
          onSubmit={handleNameSubmit}
          className="w-full max-w-sm bg-white shadow-lg p-6 rounded-2xl text-center space-y-4"
        >
          <h1 className="text-xl font-semibold text-teal-600">
            Hello there! 🌼 What is your first name?
          </h1>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full p-2 text-black rounded-lg border border-teal-300"
          />
          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600"
          >
            Enter 🌟
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {loading && <p className="text-teal-500">Checking name...</p>} {/* Display loading text */}
        </form>
      ) : (
        <div className="w-full max-w-lg bg-white rounded-xl shadow-xl p-4 flex flex-col h-[80vh]">
          <h2 className="text-2xl text-teal-600 font-bold mb-2 text-center">Hi Mohini (k haal hai)</h2>
          <div className="flex-1 overflow-y-auto space-y-3 px-1">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg max-w-[80%] ${
                  msg.sender === 'user'
                    ? 'bg-teal-200 self-end text-right'
                    : 'bg-teal-100 self-start text-left'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && <p className="text-teal-500">wait...</p>} {/* Display loading while waiting for AI response */}
          </div>
          <div className="flex mt-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 border border-teal-300 rounded-l-lg p-2 focus:outline-none"
            />
            <button
              onClick={handleSend}
              className="bg-teal-500 text-white px-4 rounded-r-lg hover:bg-teal-600"
            >
              Send 💌
            </button>
          </div>
        </div>
      )}
    </main>
  );
}