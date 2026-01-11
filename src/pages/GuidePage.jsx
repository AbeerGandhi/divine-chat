import { motion } from "framer-motion";
import { Save, Trash2, Edit2 } from "lucide-react";

export default function GuidePage() {
    const clearData = () => {
        if (window.confirm("Are you sure? This will delete ALL your chat history permanently.")) {
            localStorage.clear();
            alert("All data has been reset.");
            window.location.reload();
        }
    };

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4 relative">
            <div
                className="absolute inset-0 z-0 bg-cover bg-center opacity-20"
                style={{ backgroundImage: "url('/bg-pattern.png')" }}
            />
            <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-4xl font-bold mb-8 text-white"
                >
                    User Guide
                </motion.h1>

                <div className="space-y-8">
                    {/* Section 1: Features */}
                    <Section title="Features">
                        <ul className="space-y-4 text-gray-300">
                            <Li icon={<Save className="text-green-400" />} title="Auto-Save">
                                Your conversations are automatically saved to your browser's Local Storage. We do not store them on any server.
                            </Li>
                            <Li icon={<Edit2 className="text-blue-400" />} title="Rename Chats">
                                Click the pencil icon in the history sidebar to rename your sessions for better organization.
                            </Li>
                            <Li icon={<Trash2 className="text-red-400" />} title="Delete History">
                                Remove individual chats using the trash icon, or reset everything below.
                            </Li>
                        </ul>
                    </Section>

                    {/* Section 2: Privacy */}
                    <Section title="Privacy & Data">
                        <p className="text-gray-300 leading-relaxed">
                            Dharma Guide is privacy-first. All your chat history lives <strong>only on this device</strong> (in your browser).
                            If you clear your browser cookies/data, your history will be lost. We cannot recover it for you.
                        </p>
                    </Section>

                    {/* Section 3: Reset */}
                    <Section title="Danger Zone">
                        <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-2xl">
                            <h4 className="text-red-400 font-bold mb-2">Reset Application</h4>
                            <p className="text-sm text-gray-400 mb-4">
                                This will wipe all history and settings from this browser. This action cannot be undone.
                            </p>
                            <button
                                onClick={clearData}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                Clear All Data
                            </button>
                        </div>
                    </Section>
                </div>
            </div>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 border border-white/10 p-6 rounded-2xl"
        >
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-2">{title}</h2>
            {children}
        </motion.div>
    );
}

function Li({ icon, title, children }) {
    return (
        <li className="flex items-start gap-3">
            <div className="mt-1 bg-white/10 p-1.5 rounded-lg">{icon}</div>
            <div>
                <strong className="block text-white mb-1">{title}</strong>
                {children}
            </div>
        </li>
    );
}
