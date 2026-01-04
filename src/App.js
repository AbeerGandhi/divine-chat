import { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import Homepage from "./pages/Homepage";
import ChatPage from "./pages/ChatPage";

function AppContent() {
  const [started, setStarted] = useState(false);

  if (!started) {
    return <Homepage onStart={() => setStarted(true)} />;
  }

  return <ChatPage onBack={() => setStarted(false)} />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
