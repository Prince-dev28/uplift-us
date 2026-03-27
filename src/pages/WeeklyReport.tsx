import { motion } from "framer-motion";
import { FileText, Download, TrendingUp, Calendar, BookOpen } from "lucide-react";
import { getWeeklyMoods, getWeeklyJournals, getAssessments, computeMentalHealthScore } from "@/lib/store";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const moodEmojis = ["😔", "😟", "😐", "🙂", "😊"];

export default function WeeklyReport() {
  const weeklyMoods = useMemo(() => getWeeklyMoods(), []);
  const weeklyJournals = useMemo(() => getWeeklyJournals(), []);
  const score = useMemo(() => computeMentalHealthScore(), []);
  const assessments = getAssessments();

  const avgMood = weeklyMoods.length > 0
    ? (weeklyMoods.reduce((s, m) => s + m.mood, 0) / weeklyMoods.length).toFixed(1)
    : "N/A";

  const weekDays = useMemo(() => {
    const days: { day: string; mood: number; count: number }[] = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayMoods = weeklyMoods.filter(m => new Date(m.date).toDateString() === d.toDateString());
      const avg = dayMoods.length > 0 ? dayMoods.reduce((s, m) => s + m.mood, 0) / dayMoods.length : 0;
      days.push({ day: dayNames[d.getDay()], mood: Math.round(avg * 10) / 10, count: dayMoods.length });
    }
    return days;
  }, [weeklyMoods]);

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);

  const handleDownloadPDF = () => {
    // Generate a text-based report for download
    const lines = [
      "MINDCARE - WEEKLY MENTAL HEALTH REPORT",
      `Period: ${weekStart.toLocaleDateString()} - ${new Date().toLocaleDateString()}`,
      "",
      `Mental Health Score: ${score}/100`,
      `Average Mood: ${avgMood}/5`,
      `Moods Logged: ${weeklyMoods.length}`,
      `Journal Entries: ${weeklyJournals.length}`,
      "",
      "DAILY BREAKDOWN:",
      ...weekDays.map(d => `  ${d.day}: ${d.mood > 0 ? `${moodEmojis[Math.round(d.mood) - 1]} (${d.mood}/5)` : "No data"}`),
      "",
      "JOURNAL ENTRIES:",
      ...weeklyJournals.map(j => `  - ${j.title} (${new Date(j.date).toLocaleDateString()})`),
    ];
    if (assessments.length > 0) {
      const recent = assessments[0];
      lines.push("", "LATEST ASSESSMENT:", `  Level: ${recent.overallLevel}`,
        `  Stress: ${recent.stressScore} | Anxiety: ${recent.anxietyScore} | Depression: ${recent.depressionScore}`);
    }

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mindcare-report-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary" /> Weekly Report
        </h1>
        <button onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-calm text-primary-foreground font-semibold text-sm shadow-soft hover:opacity-90 transition-opacity">
          <Download className="w-4 h-4" /> Download Report
        </button>
      </div>

      <p className="text-sm text-muted-foreground">
        <Calendar className="w-4 h-4 inline mr-1" />
        {weekStart.toLocaleDateString("en", { month: "long", day: "numeric" })} — {new Date().toLocaleDateString("en", { month: "long", day: "numeric", year: "numeric" })}
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Health Score", value: `${score}/100`, bg: "bg-calm-lavender" },
          { label: "Avg Mood", value: `${avgMood}/5`, bg: "bg-calm-green" },
          { label: "Moods Logged", value: weeklyMoods.length, bg: "bg-calm-blue" },
          { label: "Journals", value: weeklyJournals.length, bg: "bg-calm-peach" },
        ].map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={`${c.bg} rounded-2xl p-5`}>
            <div className="text-2xl font-bold text-foreground">{c.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{c.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Mood Chart */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl p-6 shadow-card border border-border">
        <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" /> Daily Mood Overview
        </h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={weekDays}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 90%)" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'hsl(220 10% 50%)' }} />
            <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11, fill: 'hsl(220 10% 50%)' }}
              tickFormatter={(v: number) => moodEmojis[v - 1] || ""} />
            <Tooltip formatter={(v: number) => [v > 0 ? `${moodEmojis[Math.round(v) - 1]} (${v}/5)` : "No data", "Mood"]} />
            <Bar dataKey="mood" fill="hsl(234 62% 58%)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Journal Summary */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="bg-card rounded-2xl p-6 shadow-card border border-border">
        <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" /> Journal Activity
        </h2>
        {weeklyJournals.length > 0 ? (
          <div className="space-y-3">
            {weeklyJournals.map(j => (
              <div key={j.id} className="p-3 rounded-xl bg-muted/50">
                <div className="font-medium text-foreground text-sm">{j.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{new Date(j.date).toLocaleDateString("en", { weekday: "long", month: "short", day: "numeric" })}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No journal entries this week.</p>
        )}
      </motion.div>
    </div>
  );
}
