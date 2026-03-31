import { motion } from "framer-motion";
import { Phone, MessageCircle, Globe, Heart } from "lucide-react";
const resources = [
  { name: "National Suicide Prevention Lifeline", number: "988", desc: "24/7 free & confidential support", icon: Phone, color: "bg-calm-rose" },
  { name: "Crisis Text Line", number: "Text HOME to 741741", desc: "Free 24/7 crisis counseling via text", icon: MessageCircle, color: "bg-calm-lavender" },
  { name: "SAMHSA Helpline", number: "1-800-662-4357", desc: "Free referrals & information 24/7", icon: Phone, color: "bg-calm-blue" },
  { name: "International Association for Suicide Prevention", number: "https://www.iasp.info/resources/Crisis_Centres/", desc: "Find a crisis center near you", icon: Globe, color: "bg-calm-green" }
];
const tips = [
  "Take slow, deep breaths \u2014 inhale for 4 seconds, hold for 4, exhale for 4.",
  "Ground yourself: Name 5 things you see, 4 you hear, 3 you feel, 2 you smell, 1 you taste.",
  "Reach out to someone you trust \u2014 you don't have to face this alone.",
  "Remember: this feeling is temporary. You've gotten through tough times before.",
  "Move your body gently \u2014 even a short walk can shift your emotional state."
];
export default function Emergency() {
  return <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Heart className="w-6 h-6 text-destructive" /> Emergency Help
        </h1>
        <p className="text-sm text-muted-foreground mt-1">If you're in crisis, please reach out. You are not alone.</p>
      </div>

      <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="gradient-sunset rounded-2xl p-6 shadow-soft"
  >
        <p className="text-primary-foreground font-semibold text-center">
          If you or someone you know is in immediate danger, please call <strong>911</strong> or your local emergency number.
        </p>
      </motion.div>

      <div className="space-y-4">
        {resources.map((r, i) => <motion.div
    key={r.name}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.05 }}
    className="bg-card rounded-2xl p-5 shadow-card border border-border flex items-start gap-4"
  >
            <div className={`${r.color} p-3 rounded-xl shrink-0`}>
              <r.icon className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">{r.name}</h3>
              <p className="text-primary font-bold text-lg">{r.number}</p>
              <p className="text-xs text-muted-foreground">{r.desc}</p>
            </div>
          </motion.div>)}
      </div>

      <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">🌿 Coping Tips</h2>
        <ul className="space-y-3">
          {tips.map((t, i) => <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-primary mt-0.5 shrink-0">✦</span>
              <span>{t}</span>
            </li>)}
        </ul>
      </div>
    </div>;
}
