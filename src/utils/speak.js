export function speak(text, language) {
  if (!text) return;

  // Short, safe text (2 sentences max)
  const safeText = text
    .split(/[.।]/)
    .slice(0, 2)
    .join(".")
    .trim();

  const utterance = new SpeechSynthesisUtterance(safeText);
  utterance.lang = language === "en" ? "en-US" : "hi-IN";
  utterance.rate = 0.95;
  utterance.pitch = 1;

  // ❌ DO NOT delay
  // ❌ DO NOT over-cancel
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}
