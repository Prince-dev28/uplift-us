import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Plus, Trash2, X } from "lucide-react";
import { addJournal, deleteJournal, getJournals } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

export default function Journal() {
  const [entries, setEntries] = useState(getJournals());
  const [composing, setComposing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { toast } = useToast();

  const save = () => {
    if (!title.trim() || !content.trim()) { toast({ title: "Please add a title and content", variant: "destructive" }); return; }
    addJournal({ id: crypto.randomUUID(), date: new Date().toISOString(), title: title.trim(), content: content.trim() });
    setEntries(getJournals());
    setTitle(""); setContent(""); setComposing(false);
    toast({ title: "Journal entry saved! ✨" });
  };

  const remove = (id: string) => {
    deleteJournal(id);
    setEntries(getJournals());
    toast({ title: "Entry deleted" });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" /> Journal
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Write your thoughts freely</p>
        </div>
        {!composing && (
          <button onClick={() => setComposing(true)} className="flex items-center gap-1 px-4 py-2 rounded-xl gradient-calm text-primary-foreground text-sm font-semibold shadow-soft hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> New Entry
          </button>
        )}
      </div>

      <AnimatePresence>
        {composing && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="bg-card rounded-2xl p-6 shadow-card border border-border overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold text-foreground">New Entry</h2>
              <button onClick={() => setComposing(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title..."
              className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 mb-3 transition-all" />
            <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="What's on your mind?"
              className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none h-40 transition-all" />
            <button onClick={save} className="w-full mt-4 py-3 rounded-xl gradient-calm text-primary-foreground font-semibold shadow-soft hover:opacity-90 transition-opacity">
              Save Entry
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {entries.length === 0 && !composing ? (
        <div className="bg-card rounded-2xl p-12 shadow-card border border-border text-center">
          <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No journal entries yet. Start writing!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((e, i) => (
            <motion.div key={e.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="bg-card rounded-2xl p-5 shadow-card border border-border group">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-display text-base font-semibold text-foreground">{e.title}</h3>
                  <span className="text-xs text-muted-foreground">
                    {new Date(e.date).toLocaleDateString("en", { month: "long", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <button onClick={() => remove(e.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{e.content}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
