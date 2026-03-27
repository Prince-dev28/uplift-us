import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { addAssessment, type AssessmentResult } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

const questions = [
  // Stress (0-4)
  { category: "Stress", q: "How often have you felt overwhelmed by daily responsibilities?", options: ["Never", "Rarely", "Sometimes", "Often", "Always"] },
  { category: "Stress", q: "Do you find it hard to relax even when you have free time?", options: ["Never", "Rarely", "Sometimes", "Often", "Always"] },
  { category: "Stress", q: "Have you experienced physical tension (headaches, muscle tightness)?", options: ["Never", "Rarely", "Sometimes", "Often", "Always"] },
  // Anxiety (0-4)
  { category: "Anxiety", q: "How often do you feel nervous or on edge?", options: ["Never", "Rarely", "Sometimes", "Often", "Always"] },
  { category: "Anxiety", q: "Do you have trouble controlling your worrying?", options: ["Never", "Rarely", "Sometimes", "Often", "Always"] },
  { category: "Anxiety", q: "Do you avoid social situations due to fear or discomfort?", options: ["Never", "Rarely", "Sometimes", "Often", "Always"] },
  // Depression (0-4)
  { category: "Depression", q: "How often have you felt little interest or pleasure in activities?", options: ["Never", "Rarely", "Sometimes", "Often", "Always"] },
  { category: "Depression", q: "Have you felt down, depressed, or hopeless?", options: ["Never", "Rarely", "Sometimes", "Often", "Always"] },
  { category: "Depression", q: "Do you have trouble concentrating on things?", options: ["Never", "Rarely", "Sometimes", "Often", "Always"] },
];

function getLevel(score: number): 'Low' | 'Moderate' | 'High' {
  if (score <= 4) return 'Low';
  if (score <= 8) return 'Moderate';
  return 'High';
}

function getSuggestions(level: string, stress: number, anxiety: number, depression: number): string[] {
  const s: string[] = [];
  if (level === 'Low') {
    s.push("Great job! Keep maintaining your healthy habits.", "Consider daily mindfulness or meditation to stay balanced.", "Regular exercise and sleep routine will help you stay well.");
  }
  if (stress > 4) s.push("Try breathing exercises like 4-7-8 technique to manage stress.", "Consider reducing caffeine and screen time before bed.");
  if (anxiety > 4) s.push("Practice grounding techniques (5-4-3-2-1 method).", "Gradual exposure to anxiety triggers can help build resilience.");
  if (depression > 4) s.push("Maintain a regular routine and set small achievable goals.", "Reach out to a trusted friend or professional for support.");
  if (level === 'High') s.push("Please consider speaking with a mental health professional.", "Crisis resources are available in the Emergency section.");
  if (s.length === 0) s.push("Continue to monitor your wellbeing and practice self-care.");
  return s;
}

export default function Assessment() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1));
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const { toast } = useToast();

  const answer = (val: number) => {
    const a = [...answers];
    a[step] = val;
    setAnswers(a);
  };

  const submit = () => {
    if (answers.some(a => a === -1)) { toast({ title: "Please answer all questions", variant: "destructive" }); return; }
    const stress = answers.slice(0, 3).reduce((a, b) => a + b, 0);
    const anxiety = answers.slice(3, 6).reduce((a, b) => a + b, 0);
    const depression = answers.slice(6, 9).reduce((a, b) => a + b, 0);
    const total = stress + anxiety + depression;
    const overallLevel = total <= 12 ? 'Low' : total <= 24 ? 'Moderate' : 'High';
    const r: AssessmentResult = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      stressScore: stress,
      anxietyScore: anxiety,
      depressionScore: depression,
      overallLevel,
      suggestions: getSuggestions(overallLevel, stress, anxiety, depression),
    };
    addAssessment(r);
    setResult(r);
    toast({ title: "Assessment complete! 📊" });
  };

  if (result) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="text-center mb-6">
            <CheckCircle className="w-12 h-12 text-primary mx-auto mb-3" />
            <h1 className="font-display text-2xl font-bold text-foreground">Your Results</h1>
          </div>

          <div className={`rounded-2xl p-6 text-center mb-6 ${
            result.overallLevel === 'Low' ? 'bg-calm-green' : result.overallLevel === 'Moderate' ? 'bg-calm-peach' : 'bg-calm-rose'
          }`}>
            <div className="text-3xl font-bold text-foreground mb-1">{result.overallLevel} Risk</div>
            <p className="text-sm text-muted-foreground">Based on your responses</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Stress", score: result.stressScore, max: 12, level: getLevel(result.stressScore) },
              { label: "Anxiety", score: result.anxietyScore, max: 12, level: getLevel(result.anxietyScore) },
              { label: "Depression", score: result.depressionScore, max: 12, level: getLevel(result.depressionScore) },
            ].map(s => (
              <div key={s.label} className="bg-card rounded-2xl p-4 shadow-card border border-border text-center">
                <div className="text-2xl font-bold text-foreground">{s.score}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
                <div className={`text-xs font-semibold mt-1 ${
                  s.level === 'Low' ? 'text-secondary' : s.level === 'Moderate' ? 'text-accent' : 'text-destructive'
                }`}>{s.level}</div>
              </div>
            ))}
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
            <h2 className="font-display text-lg font-semibold text-foreground mb-3">💡 Suggestions</h2>
            <ul className="space-y-2">
              {result.suggestions.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-0.5">•</span> {s}
                </li>
              ))}
            </ul>
          </div>

          <button onClick={() => { setResult(null); setStep(0); setAnswers(Array(questions.length).fill(-1)); }}
            className="w-full mt-6 py-3 rounded-xl gradient-calm text-primary-foreground font-semibold shadow-soft hover:opacity-90 transition-opacity">
            Take Again
          </button>
        </motion.div>
      </div>
    );
  }

  const q = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary" /> Mental Health Assessment
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Answer honestly — there are no right or wrong answers.</p>
      </div>

      {/* Progress */}
      <div className="bg-muted rounded-full h-2 overflow-hidden">
        <motion.div className="h-full gradient-calm rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
      </div>
      <p className="text-xs text-muted-foreground">{step + 1} of {questions.length} · {q.category}</p>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}>
          <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
            <h2 className="font-display text-lg font-semibold text-foreground mb-5">{q.q}</h2>
            <div className="space-y-2">
              {q.options.map((opt, i) => (
                <button key={i} onClick={() => answer(i)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                    answers[step] === i
                      ? "gradient-calm text-primary-foreground border-transparent shadow-soft"
                      : "bg-muted text-foreground border-border hover:border-primary/30"
                  }`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-3">
        {step > 0 && (
          <button onClick={() => setStep(step - 1)} className="flex items-center gap-1 px-5 py-3 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        )}
        <button
          onClick={() => step < questions.length - 1 ? setStep(step + 1) : submit()}
          disabled={answers[step] === -1}
          className="flex-1 flex items-center justify-center gap-1 py-3 rounded-xl gradient-calm text-primary-foreground font-semibold shadow-soft hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          {step < questions.length - 1 ? <>Next <ArrowRight className="w-4 h-4" /></> : "See Results"}
        </button>
      </div>
    </div>
  );
}
