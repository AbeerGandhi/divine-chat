import { motion } from "framer-motion";
import { Send, Mail } from "lucide-react";
import { useState } from "react";

export default function FeedbackPage() {
    const [submitted, setSubmitted] = useState(false);

    // Netlify Forms handling
    const handleSubmit = (e) => {
        e.preventDefault();
        const myForm = e.target;
        const formData = new FormData(myForm);

        // Debug Log for Local Testing
        console.log("📝 Feedback Submitting (Local Test):", Object.fromEntries(formData));

        // Encode for Netlify
        fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(formData).toString(),
        })
            .then(() => {
                console.log("✅ Feedback 'Sent' to Netlify Dev!");
                setSubmitted(true);
            })
            .catch((error) => {
                console.error("❌ Submission Error:", error);
                alert(error);
            });
    };

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4 relative">
            <div
                className="absolute inset-0 z-0 bg-cover bg-center opacity-20"
                style={{ backgroundImage: "url('/bg-pattern.png')" }}
            />
            <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/5 border border-white/10 p-8 rounded-3xl"
                >
                    <h1 className="text-3xl font-bold mb-2">Feedback</h1>
                    <p className="text-gray-400 mb-8">Help us improve the experience.</p>

                    {submitted ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-green-400">
                                <Send className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
                            <p className="text-gray-400">Your message has been sent to the universe (and our team).</p>
                            <button onClick={() => setSubmitted(false)} className="mt-6 text-sm text-gray-500 underline">Send another</button>
                        </div>
                    ) : (
                        <form
                            name="feedback"
                            method="POST"
                            data-netlify="true"
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >
                            <input type="hidden" name="form-name" value="feedback" />

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Your Name</label>
                                <input required type="text" name="name" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 focus:border-yellow-500 outline-none transition-colors" placeholder="Krishna" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Email (Optional)</label>
                                <input type="email" name="email" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 focus:border-yellow-500 outline-none transition-colors" placeholder="krishna@example.com" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                                <textarea required name="message" rows={4} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 focus:border-yellow-500 outline-none transition-colors" placeholder="Share your thoughts..." />
                            </div>

                            <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2">
                                Send Feedback <Send className="w-4 h-4" />
                            </button>

                            <div className="pt-6 border-t border-white/5 text-center">
                                <p className="text-sm text-gray-500 mb-2">Or reach us directly:</p>
                                <a href="mailto:dharmaguide.help@gmail.com" className="inline-flex items-center gap-2 text-yellow-500 hover:text-yellow-400">
                                    <Mail className="w-4 h-4" /> dharmaguide.help@gmail.com
                                </a>
                            </div>
                        </form>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
