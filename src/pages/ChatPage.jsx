import { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import ChatInterface from "../components/ChatInterface";
import ChatSidebar from "../components/ChatSidebar";
import { useNavigate } from "react-router-dom";
import { Menu, ChevronLeft } from "lucide-react";
import { useChatSessions } from "../hooks/useChatSessions";

export default function ChatPage() {
  const { epic } = useContext(ThemeContext);
  const navigate = useNavigate();

  // Sidebar State: Default open on desktop, closed on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);
  const { sessions, createSession, deleteSession, updateSession } = useChatSessions();

  // Current Session ID
  const [currentSessionId, setCurrentSessionId] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!epic) {
      navigate("/");
    }
  }, [epic, navigate]);

  const handleCreateSession = () => {
    if (currentSessionId === null) return;
    setCurrentSessionId(null);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleSelectSession = (id) => {
    setCurrentSessionId(id);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  // Callback from ChatInterface when a message is sent in a "new" session
  const handleSessionStart = () => {
    const newId = createSession(epic);
    setCurrentSessionId(newId);
    return newId;
  };

  if (!epic) return null;

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-black/90">

      {/* SIDEBAR */}
      <ChatSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        sessions={sessions.filter(s => s.epic === epic)}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onCreateSession={handleCreateSession}
        onDeleteSession={deleteSession}
        onUpdateSession={updateSession}
      />

      {/* MAIN CONTENT */}
      <div
        className="flex-1 relative flex flex-col h-full bg-cover bg-center transition-all duration-300"
        style={{
          backgroundImage: epic === "ramayan" ? "url('/ram.png')" : "url('/krishna.png')"
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-0" />

        {/* HEADER */}
        <div className="relative z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
          {/* Sidebar Toggle */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-white/80 hover:bg-white/10 rounded-full transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* End Session */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all font-medium text-sm shadow-lg"
          >
            <ChevronLeft className="w-4 h-4" /> End Session
          </button>
        </div>

        {/* CHAT INTERFACE */}
        <div className="relative z-10 flex-1 w-full max-w-3xl mx-auto flex flex-col px-2 sm:px-4 pb-0 overflow-hidden">
          <ChatInterface
            sessionId={currentSessionId}
            onSessionStart={handleSessionStart}
          />
        </div>

      </div>
    </div>
  );
}
