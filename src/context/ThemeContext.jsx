import { createContext, useState } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [epic, setEpic] = useState(null); // ramayan | mahabharata
  const [language, setLanguage] = useState("en"); // en | hi
  const [locked, setLocked] = useState(false); // 🔒

  return (
    <ThemeContext.Provider
      value={{
        epic,
        setEpic,
        language,
        setLanguage,
        locked,
        setLocked
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
