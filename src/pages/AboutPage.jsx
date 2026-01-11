import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4 relative overflow-hidden">
            {/* Background Ambience */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center opacity-20"
                style={{ backgroundImage: "url('/bg-pattern.png')" }}
            />
            <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto space-y-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4"
                >
                    <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-amber-500">
                        Why Dharma Guide?
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Bridging ancient wisdom with modern technology to guide you through life's complexities.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    <FeatureCard
                        title="Our Mission"
                        content="To make the timeless wisdom of the Ramayan and Mahabharata accessible to everyone in moments of need, conflict, or reflection."
                    />
                    <FeatureCard
                        title="Why Use This?"
                        content="Unlike generic AI, Dharma Guide is tuned to speak with the compassion and ethical depth of a spiritual guide, offering perspective rather than just answers."
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="bg-white/5 border border-white/10 p-8 rounded-3xl text-center"
                >
                    <Quote className="w-8 h-8 text-yellow-500 mx-auto mb-4" />
                    <p className="text-lg font-serif italic text-gray-200">
                        "We have the right to work, but for the work's sake only. We have no right to the fruits of work."
                    </p>
                    <p className="mt-4 text-sm text-yellow-500">— Bhagavad Gita</p>
                </motion.div>
            </div>
        </div>
    );
}

function FeatureCard({ title, content }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gray-900/50 backdrop-blur border border-white/10 p-6 rounded-2xl hover:bg-gray-800/50 transition-colors"
        >
            <h3 className="text-2xl font-semibold text-white mb-3">{title}</h3>
            <p className="text-gray-400 leading-relaxed">{content}</p>
        </motion.div>
    );
}
