import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function Homepage({ onStart }) {
  const { epic, setEpic, language, setLanguage } =
    useContext(ThemeContext);

  return (
    <div className="h-screen w-full bg-gradient-to-b from-[#f3f1e7] to-[#e6e3d3] flex items-center justify-center">
      <div className="max-w-4xl w-full px-6 text-center">

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-serif text-gray-800 mb-4">
          DharmaGuide
        </h1>

        <p className="text-lg md:text-xl text-gray-600 mb-10">
          Seek calm, clarity, and guidance from the timeless wisdom of
          the Ramayan and the Mahabharata.
        </p>

        {/* Epic Selection */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Ramayan */}
          <button
            onClick={() => setEpic("ramayan")}
            className={`p-6 rounded-2xl border transition-all ${
              epic === "ramayan"
                ? "border-yellow-400 bg-yellow-50 scale-[1.02]"
                : "border-gray-200 bg-white hover:scale-[1.01]"
            }`}
          >
            <h3 className="text-2xl font-semibold mb-2">
              🪔 Ramayan
            </h3>
            <p className="text-gray-600">
              Learn about devotion, duty, sacrifice, and righteousness
              through the life of Shri Ram.
            </p>
          </button>

          {/* Mahabharata */}
          <button
            onClick={() => setEpic("mahabharata")}
            className={`p-6 rounded-2xl border transition-all ${
              epic === "mahabharata"
                ? "border-yellow-400 bg-yellow-50 scale-[1.02]"
                : "border-gray-200 bg-white hover:scale-[1.01]"
            }`}
          >
            <h3 className="text-2xl font-semibold mb-2">
              🦚 Mahabharata
            </h3>
            <p className="text-gray-600">
              Understand karma, dharma, and life’s conflicts through
              Shri Krishna’s wisdom.
            </p>
          </button>
        </div>

        {/* Language Selection */}
        <div className="flex justify-center gap-4 mb-10">
          {["en", "hi"].map((l) => (
            <button
              key={l}
              onClick={() => setLanguage(l)}
              className={`px-6 py-2 rounded-full border text-sm ${
                language === l
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-600"
              }`}
            >
              {l === "en" ? "English" : "Hindi / Hinglish"}
            </button>
          ))}
        </div>
        
        {/* CTA */}
        <button
          disabled={!epic}
          onClick={onStart}
          className={`px-10 py-4 rounded-full text-lg transition-all ${
            epic
              ? "bg-yellow-400 text-black hover:scale-105"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Begin Guidance
        </button>

        {/* Footer */}
        <p className="mt-10 text-sm text-gray-500">
          A calm space for reflection • No judgments • No distractions
        </p>
      </div>
    </div>
  );
}
