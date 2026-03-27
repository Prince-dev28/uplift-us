import { motion } from "framer-motion";
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Activity } from "lucide-react";
import { computeMentalHealthScore, detectTriggers, getMoods, getAssessments } from "@/lib/store";
import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const moodEmojis = ["😔", "😟", "😐", "🙂", "😊"];

export default function Insights() {
  const score = useMemo(() => computeMentalHealthScore(), []);
  const triggers = useMemo(() => detectTriggers(), []);
  const moods = getMoods();
  const assessments = getAssessments();

  const scoreColor = score >= 70 ? "hsl(160 60% 45%)" : score >= 40 ? "hsl(40 80% 55%)" : "hsl(0 70% 55%)";
  const scoreLabel = score >= 70 ? "Good" : score >= 40 ? "Moderate" : "Needs Attention";

  const pieData = [
    { name: "Score", value: score },
    { name: "Remaining", value: 100 - score },
  ];

  const moodDistribution = useMemo(() => {
    const dist = [0, 0, 0, 0, 0];
    moods.forEach(m => dist[m.mood - 1]++);
    return dist.map((count, i) => ({ mood: moodEmojis[i], count, label: ["Very Low", "Low", "Neutral", "Good", "Great"][i] }));
  }, [moods]);

  const moodTrend = moods.slice(0, 30).reverse().map(m => ({
    date: new Date(m.date).toLocaleDateString("en", { month: "short", day: "numeric" }),
    mood: m.mood,
  }));

  const insights = useMemo(() => {
    const tips: string[] = [];
    if (score < 40) tips.push("Your mental health score is low. Consider talking to a professional.");
    if (score >= 40 && score < 70) tips.push("You're doing okay, but there's room for improvement. Try daily mindfulness.");
    if (score >= 70) tips.push("Great job maintaining your mental health! Keep up your positive habits.");

    const recentMoods = moods.slice(0, 7);
    const avgMood = recentMoods.length > 0 ? recentMoods.reduce((s, m) => s + m.mood, 0) / recentMoods.length : 0;
    if (avgMood < 3 && recentMoods.length > 0) tips.push("Your recent mood trend is declining. Consider journaling or talking to someone.");
    if (avgMood >= 4) tips.push("Your mood has been consistently positive recently. That's wonderful!");

    if (triggers.length > 0) tips.push(`Your top trigger appears to be "${triggers[0].trigger}". Try to identify patterns and coping strategies.`);

    return tips;
  }, [score, moods, triggers]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
        <Activity className="w-6 h-6 text-primary" /> Mental Health Insights
      </h1>

      {/* Score Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl p-6 shadow-card border border-border">
        <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" /> Mental Health Score
        </h2>
        <div className="flex items-center gap-8">
          <div className="w-40 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} startAngle={90} endAngle={-270} dataKey="value">
                  <Cell fill={scoreColor} />
                  <Cell fill="hsl(220 20% 93%)" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="relative -mt-[105px] text-center">
              <div className="text-3xl font-bold text-foreground">{score}</div>
              <div className="text-xs text-muted-foreground">/100</div>
            </div>
          </div>
          <div className="flex-1">
            <div className="text-lg font-semibold text-foreground">{scoreLabel}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Based on your assessments, mood entries, and journal activity.
            </p>
            <div className="mt-3 flex gap-2">
              <span className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground">{moods.length} moods logged</span>
              <span className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground">{assessments.length} assessments</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Mood Trend */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-6 shadow-card border border-border">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> Mood Trend (30 days)
          </h2>
          {moodTrend.length > 1 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={moodTrend}>
                <defs>
                  <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(234 62% 58%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(234 62% 58%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 90%)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(220 10% 50%)' }} />
                <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 10, fill: 'hsl(220 10% 50%)' }}
                  tickFormatter={(v: number) => moodEmojis[v - 1]} />
                <Tooltip formatter={(v: number) => [moodEmojis[v - 1] + ` (${v}/5)`, "Mood"]} />
                <Area type="monotone" dataKey="mood" stroke="hsl(234 62% 58%)" fill="url(#moodGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground h-[200px] flex items-center justify-center">Log more moods to see trends.</p>
          )}
        </motion.div>

        {/* Mood Distribution */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-card rounded-2xl p-6 shadow-card border border-border">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">Mood Distribution</h2>
          <div className="space-y-3">
            {moodDistribution.map((d, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xl w-8">{d.mood}</span>
                <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: moods.length > 0 ? `${(d.count / moods.length) * 100}%` : '0%' }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className="h-full rounded-full gradient-calm" />
                </div>
                <span className="text-xs text-muted-foreground w-8">{d.count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Trigger Detection */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-card rounded-2xl p-6 shadow-card border border-border">
        <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-destructive" /> Detected Triggers
        </h2>
        {triggers.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {triggers.map(t => (
              <span key={t.trigger} className="px-4 py-2 rounded-full bg-calm-rose text-foreground text-sm font-medium flex items-center gap-2">
                {t.trigger} <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">{t.count}×</span>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No triggers detected yet. Add notes to your low mood entries to help identify patterns.</p>
        )}
      </motion.div>

      {/* AI Insights */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="bg-card rounded-2xl p-6 shadow-card border border-border">
        <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-accent" /> Personalized Insights
        </h2>
        <div className="space-y-3">
          {insights.map((tip, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
              <span className="text-primary mt-0.5">💡</span>
              <p className="text-sm text-foreground">{tip}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
