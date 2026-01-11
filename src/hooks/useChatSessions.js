import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "divine_sessions";

export function useChatSessions() {
    const [sessions, setSessions] = useState([]);

    // Load sessions on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setSessions(JSON.parse(saved).sort((a, b) => b.timestamp - a.timestamp));
            } catch (e) {
                console.error("Failed to parse sessions", e);
            }
        }
    }, []);

    const saveSessions = (newSessions) => {
        setSessions(newSessions);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSessions));
    };

    const createSession = useCallback((epic, firstMessage = null) => {
        const newSession = {
            id: uuidv4(),
            epic,
            title: "New Conversation",
            preview: firstMessage || "Start a new journey...",
            timestamp: Date.now(),
        };

        // Use functional update to ensure latest state
        setSessions(prev => {
            const updated = [newSession, ...prev];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });

        return newSession.id;
    }, []);

    const deleteSession = useCallback((id) => {
        setSessions(prev => {
            const updated = prev.filter(s => s.id !== id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            // Also remove the actual chat messages
            localStorage.removeItem(`divine_chat_${id}`);
            return updated;
        });
    }, []);

    const updateSession = useCallback((id, updates) => {
        setSessions(prev => {
            const updated = prev.map(s => s.id === id ? { ...s, ...updates, timestamp: Date.now() } : s);
            // Sort by newest
            updated.sort((a, b) => b.timestamp - a.timestamp);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    }, []);

    return { sessions, createSession, deleteSession, updateSession };
}
