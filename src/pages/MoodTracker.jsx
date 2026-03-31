import { useState } from "react";
import { motion } from "framer-motion";
import { SmilePlus } from "lucide-react";
import { addMood, getMoods } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
const moodOptions = [
  { emoji: "\u{1F614}", label: "Awful", value: 1 },
  { emoji: "\u{1F61F}", label: "Bad", value: 2 },
  { emoji: "\u{1F610}", label: "Okay", value: 3 },
  { emoji: "\u{1F642}", label: "Good", value: 4 },
  { emoji: "\u{1F60A}", label: "Great", value: 5 }
];
export default function MoodTracker() {
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState("");
  const [moods, setMoods] = useState(getMoods());
  const { toast } = useToast();
  const logMood = () => {
    if (selected === null) return;
    addMood({ id: crypto.randomUUID(), date: (/* @__PURE__ */ new Date()).toISOString(), mood: selected, note: note || void 0 });
    setMoods(getMoods());
    setSelected(null);
    setNote("");
    toast({ title: "Mood logged! \u{1F33F}" });
  };
  return <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <SmilePlus className="w-6 h-6 text-primary" /> Mood Tracker
        </h1>
        <p className="text-sm text-muted-foreground mt-1">How are you feeling right now?</p>
      </div>

      <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
        <div className="flex justify-center gap-3 sm:gap-5 mb-6">
          {moodOptions.map((m) => <motion.button
    key={m.value}
    whileTap={{ scale: 0.9 }}
    onClick={() => setSelected(m.value)}
    className={`flex flex-col items-center p-3 rounded-xl transition-all ${selected === m.value ? "bg-primary/10 ring-2 ring-primary shadow-soft scale-110" : "hover:bg-muted"}`}
  >
              <span className="text-3xl sm:text-4xl">{m.emoji}</span>
              <span className="text-xs text-muted-foreground mt-1 font-medium">{m.label}</span>
            </motion.button>)}
        </div>

        <textarea
    value={note}
    onChange={(e) => setNote(e.target.value)}
    placeholder="Add a note about how you're feeling... (optional)"
    className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none h-24 transition-all"
  />

        <button
    onClick={logMood}
    disabled={selected === null}
    className="w-full mt-4 py-3 rounded-xl gradient-calm text-primary-foreground font-semibold shadow-soft hover:opacity-90 transition-opacity disabled:opacity-40"
  >
          Log Mood
        </button>
      </div>

      {
    /* History */
  }
      {moods.length > 0 && <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">History</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {moods.map((m) => <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <span className="text-2xl">{moodOptions.find((o) => o.value === m.mood)?.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground">{moodOptions.find((o) => o.value === m.mood)?.label}</div>
                  {m.note && <p className="text-xs text-muted-foreground truncate">{m.note}</p>}
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {new Date(m.date).toLocaleDateString("en", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>)}
          </div>
        </div>}
    </div>;
}
