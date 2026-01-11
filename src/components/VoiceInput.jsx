import { useContext, useRef, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function VoiceInput({ onResult }) {
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);

  const startListening = () => {
    // 🛑 prevent multiple sessions
    if (listening) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    // 🔁 clean old instance
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch { }
      recognitionRef.current = null;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    // Use en-US to force Roman characters (Hinglish) instead of Devanagari
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      const text = event.results?.[0]?.[0]?.transcript?.trim();

      if (text && text.length > 1) {
        onResult(text);
      } else {
        console.warn("Empty voice result ignored");
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      // 🔑 VERY IMPORTANT
      setListening(false);
      recognitionRef.current = null;
    };

    try {
      recognition.start();
    } catch (e) {
      console.error("Recognition start failed:", e);
      setListening(false);
    }
  };

  return (
    <button
      onClick={startListening}
      disabled={listening}
      className={`text-gray-500 hover:text-black ${listening ? "opacity-50 cursor-not-allowed" : ""
        }`}
      title={listening ? "Listening..." : "Speak"}
    >
      🎤
    </button>
  );
}
