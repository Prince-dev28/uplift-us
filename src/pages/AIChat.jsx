import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Send, Bot, User, Sparkles } from "lucide-react";
const quickPrompts = [
  "I'm feeling anxious today",
  "Help me with stress management",
  "I can't sleep well lately",
  "Give me a mindfulness exercise",
  "I feel overwhelmed at work"
];
function getResponse(input) {
  const lower = input.toLowerCase();
  if (lower.includes("anxious") || lower.includes("anxiety"))
    return "I hear you. Anxiety can feel overwhelming, but remember it's temporary. Try the 4-7-8 breathing technique: breathe in for 4 seconds, hold for 7, exhale for 8. You can also try our Guided Breathing tool. \u{1F499}\n\nWould you like to talk more about what's triggering your anxiety?";
  if (lower.includes("stress"))
    return "Stress is your body's way of signaling it needs care. Here are some quick strategies:\n\n1. **Take a break** \u2014 Even 5 minutes of stepping away helps\n2. **Deep breathing** \u2014 Try our Breathing exercise\n3. **Move your body** \u2014 A short walk can reduce stress hormones\n4. **Journal** \u2014 Writing down your feelings can provide clarity\n\nRemember: you don't have to handle everything at once. \u{1F33F}";
  if (lower.includes("sleep") || lower.includes("insomnia"))
    return "Sleep issues are tough. Here's what might help:\n\n\u2022 **Consistent schedule** \u2014 Try going to bed and waking up at the same time\n\u2022 **No screens** \u2014 Avoid phones 30 mins before bed\n\u2022 **Relaxation** \u2014 Try our Meditation mode before sleeping\n\u2022 **Limit caffeine** \u2014 Especially after 2 PM\n\nIf sleep problems persist, please consider speaking with a healthcare provider. \u{1F319}";
  if (lower.includes("overwhelm"))
    return "Feeling overwhelmed is valid. Let's break things down:\n\n1. **Pause** \u2014 Take 3 deep breaths right now\n2. **Prioritize** \u2014 What's the ONE most important thing?\n3. **Delegate** \u2014 Can someone help with any tasks?\n4. **Be kind to yourself** \u2014 You're doing more than you think\n\nTry writing in your journal about what feels most pressing. \u{1F49B}";
  if (lower.includes("mindful") || lower.includes("exercise") || lower.includes("meditation"))
    return "Here's a quick mindfulness exercise:\n\n\u{1F9D8} **5-4-3-2-1 Grounding Technique:**\n\u2022 **5** things you can see\n\u2022 **4** things you can touch\n\u2022 **3** things you can hear\n\u2022 **2** things you can smell\n\u2022 **1** thing you can taste\n\nThis brings you back to the present moment. You can also try our Meditation Mode for a guided session! \u2728";
  if (lower.includes("sad") || lower.includes("depress") || lower.includes("lonely"))
    return "I'm sorry you're feeling this way. Your emotions are valid. \u{1F499}\n\nSome things that might help:\n\u2022 **Reach out** \u2014 Talk to someone you trust\n\u2022 **Small steps** \u2014 Even getting out of bed is an achievement\n\u2022 **Self-care** \u2014 Do one small thing that brings you comfort\n\u2022 **Professional help** \u2014 A therapist can provide personalized support\n\nIf you're in crisis, please check our Emergency section for helpline numbers. You matter. \u{1F31F}";
  if (lower.includes("happy") || lower.includes("good") || lower.includes("great"))
    return "That's wonderful to hear! \u{1F389} Celebrate the good moments. Consider:\n\n\u2022 **Journal** \u2014 Write down what's making you feel good\n\u2022 **Share** \u2014 Tell someone about your positive experience\n\u2022 **Remember** \u2014 Save this feeling for tougher days\n\nKeep nurturing what brings you joy! \u2728";
  return "Thank you for sharing. I'm here to listen and support you. \u{1F499}\n\nYou can tell me about:\n\u2022 How you're feeling today\n\u2022 Specific concerns (stress, anxiety, sleep)\n\u2022 Request mindfulness exercises\n\u2022 Ask for coping strategies\n\nRemember, I'm an AI companion \u2014 for serious concerns, please reach out to a mental health professional or check our Emergency section.";
}
export default function AIChat() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi there! \u{1F44B} I'm your MindCare wellness companion. I'm here to listen, offer support, and share coping strategies.\n\nHow are you feeling today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const send = (text) => {
    if (!text.trim()) return;
    const userMsg = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      const response = getResponse(text);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };
  return <div className="flex flex-col h-[calc(100vh-8rem)] lg:h-[calc(100vh-4rem)] max-w-3xl mx-auto">
      <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2 mb-4">
        <MessageCircle className="w-6 h-6 text-primary" /> AI Chat Support
      </h1>

      {
    /* Messages */
  }
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4">
        {messages.map((m, i) => <motion.div
    key={i}
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
  >
            {m.role === "assistant" && <div className="w-8 h-8 rounded-full gradient-calm flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-line ${m.role === "user" ? "gradient-calm text-primary-foreground rounded-br-md" : "bg-muted text-foreground rounded-bl-md"}`}>
              {m.content}
            </div>
            {m.role === "user" && <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>}
          </motion.div>)}
        {isTyping && <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full gradient-calm flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
              <motion.div
    className="flex gap-1"
    animate={{ opacity: [0.4, 1, 0.4] }}
    transition={{ duration: 1.2, repeat: Infinity }}
  >
                <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                <span className="w-2 h-2 rounded-full bg-muted-foreground" />
              </motion.div>
            </div>
          </div>}
        <div ref={endRef} />
      </div>

      {
    /* Quick Prompts */
  }
      {messages.length <= 1 && <div className="flex gap-2 overflow-x-auto pb-3">
          {quickPrompts.map((p) => <button
    key={p}
    onClick={() => send(p)}
    className="shrink-0 px-3 py-1.5 rounded-full bg-calm-lavender text-foreground text-xs font-medium hover:shadow-soft transition-shadow flex items-center gap-1"
  >
              <Sparkles className="w-3 h-3 text-accent" /> {p}
            </button>)}
        </div>}

      {
    /* Input */
  }
      <div className="flex gap-2 pt-2 border-t border-border">
        <input
    type="text"
    value={input}
    onChange={(e) => setInput(e.target.value)}
    onKeyDown={(e) => e.key === "Enter" && send(input)}
    placeholder="Type your message..."
    className="flex-1 px-4 py-3 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
  />
        <button
    onClick={() => send(input)}
    disabled={!input.trim()}
    className="w-12 h-12 rounded-xl gradient-calm text-primary-foreground flex items-center justify-center shadow-soft hover:opacity-90 transition-opacity disabled:opacity-50"
  >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>;
}
