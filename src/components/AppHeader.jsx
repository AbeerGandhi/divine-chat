import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function AppHeader({ onBack }) {
  const { epic, setEpic, language, setLanguage } =
    useContext(ThemeContext);

  return (
    <div className="max-w-3xl mx-auto">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 py-3 gap-3">

      {/* LEFT */}
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="text-xs sm:text-sm px-3 py-1 rounded-full bg-white/80 shadow"
          >
            ← Back
          </button>
        )}
        <h1 className="text-lg sm:text-2xl font-serif">
          DharmaGuide
        </h1>
      </div>

      {/* RIGHT */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">

        {/* Epic toggle */}
        <div className="bg-white/80 rounded-full p-1 flex gap-1 justify-center">
          <button
            onClick={() => setEpic("ramayan")}
            className={`px-3 py-1 text-xs sm:text-sm rounded-full transition ${
              epic === "ramayan" ? "bg-yellow-400" : ""
            }`}
          >
            Ramayan
          </button>
          <button
            onClick={() => setEpic("mahabharata")}
            className={`px-3 py-1 text-xs sm:text-sm rounded-full transition ${
              epic === "mahabharata" ? "bg-yellow-400" : ""
            }`}
          >
            Mahabharata
          </button>
        </div>

        {/* Language toggle */}
        <div className="bg-white/80 rounded-full p-1 flex gap-1 justify-center">
          <button
            onClick={() => setLanguage("en")}
            className={`px-3 py-1 text-xs sm:text-sm rounded-full transition ${
              language === "en" ? "bg-black text-white" : ""
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage("hi")}
            className={`px-3 py-1 text-xs sm:text-sm rounded-full transition ${
              language === "hi" ? "bg-black text-white" : ""
            }`}
          >
            HI
          </button>
        </div>

      </div>
    </div>
    </div>
  );
}
