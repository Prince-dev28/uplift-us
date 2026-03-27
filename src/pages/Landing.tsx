import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Heart, Shield, Sparkles } from "lucide-react";

const features = [
  { icon: Brain, title: "Mental Health Assessment", desc: "Science-backed questionnaires to evaluate stress, anxiety, and depression levels." },
  { icon: Heart, title: "Daily Mood Tracking", desc: "Log your mood daily and visualize emotional patterns over time." },
  { icon: Shield, title: "Private & Secure", desc: "Your data stays yours. Complete privacy and security guaranteed." },
  { icon: Sparkles, title: "Personalized Insights", desc: "Get tailored suggestions and resources based on your results." },
];

export default function Landing() {
  return (
    <div className="min-h-screen gradient-surface">
      {/* Hero */}
      <header className="px-4 py-6 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl gradient-calm flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">MindCare</span>
        </div>
        <div className="flex gap-3">
          <Link to="/login" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-primary hover:bg-primary/10 transition-colors">
            Log In
          </Link>
          <Link to="/signup" className="px-5 py-2.5 rounded-xl text-sm font-semibold gradient-calm text-primary-foreground shadow-soft hover:opacity-90 transition-opacity">
            Get Started
          </Link>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 pt-16 pb-24 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 tracking-wide uppercase">
            Your mental health matters
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
            Understand Your Mind,<br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'var(--gradient-calm)' }}>
              Nurture Your Wellbeing
            </span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
            Take evidence-based mental health assessments, track your mood, journal your thoughts, and get personalized insights — all in one safe space.
          </p>
          <Link to="/signup" className="inline-flex px-8 py-4 rounded-2xl text-base font-semibold gradient-calm text-primary-foreground shadow-elevated hover:opacity-90 transition-opacity">
            Start Your Journey
          </Link>
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="bg-card rounded-2xl p-6 shadow-card border border-border hover:shadow-elevated transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © 2026 MindCare. Your mental health companion.
      </footer>
    </div>
  );
}
