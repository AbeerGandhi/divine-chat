import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, Info, MessageCircle, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const isChat = location.pathname === "/chat";

    // Hide Navbar completely on Chat page? Or make it minimal?
    // Usually chat apps hide the main nav to focus on the chat.
    // Let's hide it on /chat to avoid cluttering the immersive interface.
    if (isChat) return null;

    const links = [
        { to: "/", label: "Home", icon: <Home className="w-4 h-4" /> },
        { to: "/about", label: "About", icon: <Info className="w-4 h-4" /> },
        { to: "/guide", label: "Guide", icon: <BookOpen className="w-4 h-4" /> },
        { to: "/feedback", label: "Feedback", icon: <MessageCircle className="w-4 h-4" /> },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 p-4">
            <div className="max-w-5xl mx-auto">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 flex items-center justify-between shadow-lg relative">

                    {/* Logo */}
                    <Link to="/" className="text-white font-bold text-lg tracking-tight flex items-center gap-2">
                        <span className="text-2xl">🕉️</span> Dharma Guide
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {links.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-medium ${location.pathname === link.to
                                        ? "bg-white text-black shadow-md"
                                        : "text-white/80 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                {link.icon}
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 text-white hover:bg-white/10 rounded-full"
                    >
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className="absolute top-20 left-4 right-4 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl md:hidden overflow-hidden"
                        >
                            <div className="flex flex-col gap-2">
                                {links.map((link) => (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-base font-medium ${location.pathname === link.to
                                                ? "bg-white text-black"
                                                : "text-white/80 hover:bg-white/10"
                                            }`}
                                    >
                                        {link.icon}
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </nav>
    );
}
