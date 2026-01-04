import { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import ChatInterface from "../components/ChatInterface";

export default function ChatPage({ onBack }) {
  const { epic } = useContext(ThemeContext);
  const [showBack, setShowBack] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      // hide on scroll down, show on scroll up
      if (currentY > lastScrollY && currentY > 50) {
        setShowBack(false);
      } else {
        setShowBack(true);
      }

      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center"
      style={{
        backgroundImage:
          epic === "ramayan"
            ? "url('/ram.png')"
            : "url('/krishna.png')"
      }}
    >
      {/* Dark overlay */}
      <div className="min-h-screen w-full bg-black/60 relative">

        {/* 🌟 FLOATING GOLD BACK BUTTON */}
        <button
          onClick={onBack}
          className={`
            fixed top-[env(safe-area-inset-top)] left-4 mt-3 z-30
            px-4 py-1.5 rounded-full
            text-sm font-medium
            bg-yellow-400/90 hover:bg-yellow-400
            text-black shadow-lg backdrop-blur
            transition-all duration-300
            ${showBack ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}
          `}
        >
          ← Back
        </button>

        {/* CHAT */}
        <div className="flex justify-center min-h-screen">
          <div className="w-full max-w-3xl flex flex-col">
            <ChatInterface />
          </div>
        </div>

      </div>
    </div>
  );
}
