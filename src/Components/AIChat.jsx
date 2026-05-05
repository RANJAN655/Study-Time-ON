import React, { useState } from "react";
import "./AIChat.css";

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  // 🔊 AI Speak
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  // 🎤 Voice input (AUTO SEND)
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Browser not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      // optional: show in input
      setInput(transcript);

      // ✅ auto send
      sendMessage(transcript);
    };

    recognition.start();
  };

  // 🤖 Send message (supports voice + input)
  const sendMessage = async (voiceText) => {
    const msg = voiceText || input;
    if (!msg.trim()) return;

    const userMsg = { role: "user", text: msg };

    // show instantly
    setMessages((prev) => [...prev, userMsg]);

    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: msg })
      });

      const data = await res.json();
      const reply = data.reply || "No response";

      const botMsg = { role: "bot", text: reply };

      setMessages((prev) => [...prev, botMsg]);

      // 🔊 speak response
      speak(reply);

    } catch {
      const err = "Error connecting server";

      setMessages((prev) => [
        ...prev,
        { role: "bot", text: err }
      ]);

      speak(err);
    }
  };

  return (
    <>
      {/* 🤖 Floating Button */}
      <div className="ai-button" onClick={toggleChat}>
        🤖
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="ai-chat">
          <div className="chat-header">
            AI Assistant
            <span onClick={toggleChat}>✖</span>
          </div>

          <div className="chat-box">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role}`}>
                {m.text}
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."

              // ✅ Enter to send
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />

            {/* 🎤 Mic */}
            <button onClick={startListening}>
              {listening ? "🎙️" : "🎤"}
            </button>

            {/* Send Button */}
            <button onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChat;