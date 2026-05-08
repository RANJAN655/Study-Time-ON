import React, { useState } from "react";
import "./AIChat.css";

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // 🔊 Speak AI response
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";

    speechSynthesis.speak(utterance);
  };

  // 🎤 Voice Recognition
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Browser does not support voice recognition");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onresult = (event) => {
      const transcript =
        event.results[0][0].transcript;

      setInput(transcript);

      sendMessage(transcript);
    };

    recognition.start();
  };

  // 🤖 Send Message
  const sendMessage = async (voiceText = "") => {
    const msg = String(voiceText || input || "").trim();

    if (!msg) return;

    // Add user message
    const userMessage = {
      role: "user",
      text: msg,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setInput("");

    try {
      console.log("Sending:", msg);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: msg,
        }),
      });

      console.log("Status:", res.status);

      const data = await res.json();

      console.log("Response:", data);

      const botReply =
        data.reply || "No response from AI";

      const botMessage = {
        role: "bot",
        text: botReply,
      };

      setMessages((prev) => [
        ...prev,
        botMessage,
      ]);

      speak(botReply);

    } catch (err) {
      console.error("Frontend Error:", err);

      const errorMessage =
        "Error connecting server";

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: errorMessage,
        },
      ]);

      speak(errorMessage);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div
        className="ai-button"
        onClick={toggleChat}
      >
        🤖
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="ai-chat">

          {/* Header */}
          <div className="chat-header">
            AI Assistant

            <span onClick={toggleChat}>
              ✖
            </span>
          </div>

          {/* Messages */}
          <div className="chat-box">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`msg ${msg.role}`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="chat-input">

            <input
              type="text"
              value={input}
              placeholder="Ask something..."
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />

            {/* Mic Button */}
            <button onClick={startListening}>
              {listening ? "🎙️" : "🎤"}
            </button>

            {/* Send Button */}
            <button
              onClick={() => sendMessage()}
            >
              Send
            </button>

          </div>
        </div>
      )}
    </>
  );
};

export default AIChat;