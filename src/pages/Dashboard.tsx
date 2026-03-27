import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, SmilePlus, BookOpen, TrendingUp, Quote, Sparkles } from "lucide-react";
import { getProfile, getMoods, getAssessments } from "@/lib/store";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useMemo } from "react";

const quotes = [
  "You are braver than you believe, stronger than you seem, and smarter than you think.",
  "It's okay to not be okay — what matters is that you're here.",
  "Your mental health is a priority. Your happiness is essential.",
  "One day at a time. One step at a time. You've got this.",
  "Be gentle with yourself. You're doing the best you can.",
  "The strongest people are those who win battles we know nothing about.",
];

const moodEmojis = ["😔", "😟", "😐", "🙂", "😊"];

export default function Dashboard() {
  const profile = getProfile();
  const moods = getMoods();
  const assessments = getAssessments();
  const quote = useMemo(() => quotes[Math.floor(Math.random() * quotes.length)], []);

  const moodData = moods.slice(0, 14).reverse().map(m => ({
    date: new Date(m.date).toLocaleDateString("en", { month: "short", day: "numeric" }),
    mood: m.mood,
  }));

  const latestAssessment = assessments[0];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
          Hello, {profile?.name || "Friend"} 👋
        </h1>
        <p className="text-muted-foreground mt-1">How are you feeling today?</p>
      </div>

      {/* Quote Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="gradient-calm rounded-2xl p-6 shadow-soft">
        <div className="flex items-start gap-3">
          <Quote className="w-5 h-5 text-primary-foreground/70 mt-1 shrink-0" />
          <p className="text-primary-foreground font-medium italic leading-relaxed">{quote}</p>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { to: "/assessment", icon: Brain, label: "Take Assessment", bg: "bg-calm-lavender" },
          { to: "/mood", icon: SmilePlus, label: "Log Mood", bg: "bg-calm-green" },
          { to: "/journal", icon: BookOpen, label: "Write Journal", bg: "bg-calm-blue" },
          { to: "/emergency", icon: Sparkles, label: "Get Help", bg: "bg-calm-rose" },
        ].map((a, i) => (
          <motion.div key={a.to} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Link to={a.to} className={`${a.bg} rounded-2xl p-5 block hover:shadow-card transition-shadow`}>
              <a.icon className="w-6 h-6 text-foreground mb-3" />
              <span className="text-sm font-semibold text-foreground">{a.label}</span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Mood Chart */}
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">Mood Trend</h2>
          </div>
          {moodData.length > 1 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 90%)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(220 10% 50%)' }} />
                <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11, fill: 'hsl(220 10% 50%)' }}
                  tickFormatter={(v: number) => moodEmojis[v - 1]} />
                <Tooltip formatter={(v: number) => [moodEmojis[v - 1] + ` (${v}/5)`, "Mood"]} />
                <Line type="monotone" dataKey="mood" stroke="hsl(234 62% 58%)" strokeWidth={2.5} dot={{ r: 4, fill: 'hsl(234 62% 58%)' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">
              <Link to="/mood" className="text-primary hover:underline">Log your first mood →</Link>
            </div>
          )}
        </div>

        {/* Latest Assessment */}
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-4 h-4 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">Latest Assessment</h2>
          </div>
          {latestAssessment ? (
            <div className="space-y-4">
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                latestAssessment.overallLevel === 'Low' ? 'bg-calm-green text-foreground' :
                latestAssessment.overallLevel === 'Moderate' ? 'bg-calm-peach text-foreground' :
                'bg-calm-rose text-foreground'
              }`}>
                {latestAssessment.overallLevel} Risk
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Stress", score: latestAssessment.stressScore },
                  { label: "Anxiety", score: latestAssessment.anxietyScore },
                  { label: "Depression", score: latestAssessment.depressionScore },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <div className="text-2xl font-bold text-foreground">{s.score}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date(latestAssessment.date).toLocaleDateString("en", { month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">
              <Link to="/assessment" className="text-primary hover:underline">Take your first assessment →</Link>
            </div>
          )}
        </div>
      </div>

      {/* Recent Moods */}
      {moods.length > 0 && (
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">Recent Moods</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {moods.slice(0, 7).map(m => (
              <div key={m.id} className="flex flex-col items-center min-w-[60px]">
                <span className="text-2xl">{moodEmojis[m.mood - 1]}</span>
                <span className="text-xs text-muted-foreground mt-1">
                  {new Date(m.date).toLocaleDateString("en", { weekday: "short" })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
