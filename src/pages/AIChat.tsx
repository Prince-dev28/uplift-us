import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const quickPrompts = [
  "I'm feeling anxious today",
  "Help me with stress management",
  "I can't sleep well lately",
  "Give me a mindfulness exercise",
  "I feel overwhelmed at work",
];

// Simple rule-based responses until Lovable Cloud is enabled
function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("anxious") || lower.includes("anxiety"))
    return "I hear you. Anxiety can feel overwhelming, but remember it's temporary. Try the 4-7-8 breathing technique: breathe in for 4 seconds, hold for 7, exhale for 8. You can also try our Guided Breathing tool. 💙\n\nWould you like to talk more about what's triggering your anxiety?";
  if (lower.includes("stress"))
    return "Stress is your body's way of signaling it needs care. Here are some quick strategies:\n\n1. **Take a break** — Even 5 minutes of stepping away helps\n2. **Deep breathing** — Try our Breathing exercise\n3. **Move your body** — A short walk can reduce stress hormones\n4. **Journal** — Writing down your feelings can provide clarity\n\nRemember: you don't have to handle everything at once. 🌿";
  if (lower.includes("sleep") || lower.includes("insomnia"))
    return "Sleep issues are tough. Here's what might help:\n\n• **Consistent schedule** — Try going to bed and waking up at the same time\n• **No screens** — Avoid phones 30 mins before bed\n• **Relaxation** — Try our Meditation mode before sleeping\n• **Limit caffeine** — Especially after 2 PM\n\nIf sleep problems persist, please consider speaking with a healthcare provider. 🌙";
  if (lower.includes("overwhelm"))
    return "Feeling overwhelmed is valid. Let's break things down:\n\n1. **Pause** — Take 3 deep breaths right now\n2. **Prioritize** — What's the ONE most important thing?\n3. **Delegate** — Can someone help with any tasks?\n4. **Be kind to yourself** — You're doing more than you think\n\nTry writing in your journal about what feels most pressing. 💛";
  if (lower.includes("mindful") || lower.includes("exercise") || lower.includes("meditation"))
    return "Here's a quick mindfulness exercise:\n\n🧘 **5-4-3-2-1 Grounding Technique:**\n• **5** things you can see\n• **4** things you can touch\n• **3** things you can hear\n• **2** things you can smell\n• **1** thing you can taste\n\nThis brings you back to the present moment. You can also try our Meditation Mode for a guided session! ✨";
  if (lower.includes("sad") || lower.includes("depress") || lower.includes("lonely"))
    return "I'm sorry you're feeling this way. Your emotions are valid. 💙\n\nSome things that might help:\n• **Reach out** — Talk to someone you trust\n• **Small steps** — Even getting out of bed is an achievement\n• **Self-care** — Do one small thing that brings you comfort\n• **Professional help** — A therapist can provide personalized support\n\nIf you're in crisis, please check our Emergency section for helpline numbers. You matter. 🌟";
  if (lower.includes("happy") || lower.includes("good") || lower.includes("great"))
    return "That's wonderful to hear! 🎉 Celebrate the good moments. Consider:\n\n• **Journal** — Write down what's making you feel good\n• **Share** — Tell someone about your positive experience\n• **Remember** — Save this feeling for tougher days\n\nKeep nurturing what brings you joy! ✨";

  return "Thank you for sharing. I'm here to listen and support you. 💙\n\nYou can tell me about:\n• How you're feeling today\n• Specific concerns (stress, anxiety, sleep)\n• Request mindfulness exercises\n• Ask for coping strategies\n\nRemember, I'm an AI companion — for serious concerns, please reach out to a mental health professional or check our Emergency section.";
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi there! 👋 I'm your MindCare wellness companion. I'm here to listen, offer support, and share coping strategies.\n\nHow are you feeling today?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = getResponse(text);
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] lg:h-[calc(100vh-4rem)] max-w-3xl mx-auto">
      <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2 mb-4">
        <MessageCircle className="w-6 h-6 text-primary" /> AI Chat Support
      </h1>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4">
        {messages.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && (
              <div className="w-8 h-8 rounded-full gradient-calm flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-line ${
              m.role === "user"
                ? "gradient-calm text-primary-foreground rounded-br-md"
                : "bg-muted text-foreground rounded-bl-md"
            }`}>
              {m.content}
            </div>
            {m.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full gradient-calm flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
              <motion.div className="flex gap-1"
                animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.2, repeat: Infinity }}>
                <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                <span className="w-2 h-2 rounded-full bg-muted-foreground" />
              </motion.div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <div className="flex gap-2 overflow-x-auto pb-3">
          {quickPrompts.map(p => (
            <button key={p} onClick={() => send(p)}
              className="shrink-0 px-3 py-1.5 rounded-full bg-calm-lavender text-foreground text-xs font-medium hover:shadow-soft transition-shadow flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-accent" /> {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2 pt-2 border-t border-border">
        <input type="text" value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send(input)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-3 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
        <button onClick={() => send(input)} disabled={!input.trim()}
          className="w-12 h-12 rounded-xl gradient-calm text-primary-foreground flex items-center justify-center shadow-soft hover:opacity-90 transition-opacity disabled:opacity-50">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
