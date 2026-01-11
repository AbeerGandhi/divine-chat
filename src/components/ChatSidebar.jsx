import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MessageSquare, Trash2, X, Menu, ChevronLeft, Edit2, Check } from "lucide-react";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function ChatSidebar({
    isOpen,
    onClose,
    sessions,
    currentSessionId,
    onSelectSession,
    onCreateSession,
    onDeleteSession,
    onUpdateSession // Ensure this is passed from parent now
}) {
    const { epic } = useContext(ThemeContext);
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");

    // Pass updateSession from useChatSessions hook in ChatPage
    const handleSaveTitle = (id) => {
        if (onUpdateSession && editTitle.trim()) {
            onUpdateSession(id, { title: editTitle });
        }
        setEditingId(null);
    };

    const sidebarVariants = {
        open: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
        closed: { x: "-100%", opacity: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay for mobile */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    />

                    <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={sidebarVariants}
                        className="fixed md:static inset-y-0 left-0 w-72 bg-white/95 backdrop-blur-xl border-r border-gray-200 z-50 flex flex-col shadow-2xl md:shadow-none"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <ButtonNewChat onClick={onCreateSession} />
                            <button onClick={onClose} className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-2">
                            {sessions.length === 0 ? (
                                <div className="text-center text-gray-400 text-sm mt-10">
                                    <p>No history yet.</p>
                                    <p className="text-xs">Start a journey to see it here.</p>
                                </div>
                            ) : (
                                sessions.map((session) => (
                                    <div
                                        key={session.id}
                                        className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${currentSessionId === session.id
                                            ? "bg-yellow-50 border border-yellow-200 shadow-sm"
                                            : "hover:bg-gray-50 border border-transparent"
                                            }`}
                                        onClick={() => {
                                            if (editingId !== session.id) {
                                                onSelectSession(session.id);
                                                if (window.innerWidth < 768) onClose();
                                            }
                                        }}
                                    >
                                        <span className="text-xl">
                                            {session.epic === "ramayan" ? "🪔" : "🦚"}
                                        </span>

                                        <div className="flex-1 min-w-0">
                                            {editingId === session.id ? (
                                                <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                                    <input
                                                        autoFocus
                                                        type="text"
                                                        value={editTitle}
                                                        onChange={(e) => setEditTitle(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") handleSaveTitle(session.id);
                                                            if (e.key === "Escape") setEditingId(null);
                                                        }}
                                                        onBlur={() => handleSaveTitle(session.id)}
                                                        className="w-full text-sm border-b border-blue-500 outline-none bg-transparent"
                                                    />
                                                </div>
                                            ) : (
                                                <>
                                                    <h4 className={`text-sm font-medium truncate ${currentSessionId === session.id ? "text-gray-900" : "text-gray-700"
                                                        }`}>
                                                        {session.title || "New Chat"}
                                                    </h4>
                                                    <p className="text-xs text-gray-400 truncate">
                                                        {new Date(session.timestamp).toLocaleDateString()}
                                                    </p>
                                                </>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1">
                                            {editingId === session.id ? (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSaveTitle(session.id);
                                                    }}
                                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingId(session.id);
                                                            setEditTitle(session.title || "New Chat");
                                                        }}
                                                        className="p-1.5 text-red-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                                                        title="Rename Chat"
                                                    >
                                                        <Edit2 className="w-3 h-3" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onDeleteSession(session.id);
                                                        }}
                                                        className="p-1.5 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Delete Chat"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-100 text-xs text-center text-gray-400">
                            Dharma Guide Chat History
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

function ButtonNewChat({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white px-4 py-2.5 rounded-xl transition-all shadow hover:shadow-lg text-sm font-medium"
        >
            <Plus className="w-4 h-4" /> New Chat
        </button>
    );
}
