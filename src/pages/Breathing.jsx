import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wind, Play, Pause, RotateCcw } from "lucide-react";
const techniques = [
  { name: "4-7-8 Breathing", inhale: 4, hold: 7, exhale: 8, rest: 0 },
  { name: "Box Breathing", inhale: 4, hold: 4, exhale: 4, rest: 4 },
  { name: "Calm Breathing", inhale: 4, hold: 2, exhale: 6, rest: 0 }
];
const phaseColors = {
  inhale: "hsl(234 62% 58%)",
  hold: "hsl(280 45% 68%)",
  exhale: "hsl(168 42% 52%)",
  rest: "hsl(220 20% 93%)"
};
const phaseLabels = {
  inhale: "Breathe In",
  hold: "Hold",
  exhale: "Breathe Out",
  rest: "Rest"
};
export default function Breathing() {
  const [selectedTechnique, setSelectedTechnique] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState("inhale");
  const [timer, setTimer] = useState(0);
  const [cycles, setCycles] = useState(0);
  const technique = techniques[selectedTechnique];
  const getPhaseTime = useCallback((p) => {
    switch (p) {
      case "inhale":
        return technique.inhale;
      case "hold":
        return technique.hold;
      case "exhale":
        return technique.exhale;
      case "rest":
        return technique.rest;
    }
  }, [technique]);
  const getNextPhase = useCallback((p) => {
    switch (p) {
      case "inhale":
        return technique.hold > 0 ? "hold" : "exhale";
      case "hold":
        return "exhale";
      case "exhale":
        return technique.rest > 0 ? "rest" : "inhale";
      case "rest":
        return "inhale";
    }
  }, [technique]);
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        const phaseTime2 = getPhaseTime(phase);
        if (prev >= phaseTime2 - 1) {
          const next = getNextPhase(phase);
          if (next === "inhale") setCycles((c) => c + 1);
          setPhase(next);
          return 0;
        }
        return prev + 1;
      });
    }, 1e3);
    return () => clearInterval(interval);
  }, [isActive, phase, getPhaseTime, getNextPhase]);
  const reset = () => {
    setIsActive(false);
    setPhase("inhale");
    setTimer(0);
    setCycles(0);
  };
  const circleScale = phase === "inhale" ? 1.4 : phase === "exhale" ? 0.8 : 1.1;
  const phaseTime = getPhaseTime(phase);
  return <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
        <Wind className="w-6 h-6 text-primary" /> Guided Breathing
      </h1>

      {
    /* Technique Selector */
  }
      <div className="flex gap-2 flex-wrap">
        {techniques.map((t, i) => <button
    key={t.name}
    onClick={() => {
      setSelectedTechnique(i);
      reset();
    }}
    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${i === selectedTechnique ? "gradient-calm text-primary-foreground shadow-soft" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
  >
            {t.name}
          </button>)}
      </div>

      {
    /* Breathing Animation */
  }
      <motion.div
    className="bg-card rounded-2xl p-8 shadow-card border border-border flex flex-col items-center"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
  >
        <div className="relative w-64 h-64 flex items-center justify-center">
          {
    /* Outer glow */
  }
          <motion.div
    animate={{ scale: circleScale, opacity: isActive ? 0.15 : 0.05 }}
    transition={{ duration: phaseTime, ease: "easeInOut" }}
    className="absolute w-56 h-56 rounded-full"
    style={{ backgroundColor: phaseColors[phase] }}
  />
          {
    /* Main circle */
  }
          <motion.div
    animate={{ scale: circleScale }}
    transition={{ duration: phaseTime, ease: "easeInOut" }}
    className="absolute w-44 h-44 rounded-full shadow-elevated flex items-center justify-center"
    style={{ backgroundColor: phaseColors[phase] }}
  >
            <AnimatePresence mode="wait">
              <motion.div
    key={phase}
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -5 }}
    className="text-center"
  >
                <div className="text-primary-foreground font-bold text-lg">{phaseLabels[phase]}</div>
                <div className="text-primary-foreground/80 text-3xl font-bold mt-1">{phaseTime - timer}</div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {
    /* Controls */
  }
        <div className="flex items-center gap-4 mt-6">
          <button
    onClick={() => setIsActive(!isActive)}
    className="w-14 h-14 rounded-full gradient-calm text-primary-foreground flex items-center justify-center shadow-soft hover:opacity-90 transition-opacity"
  >
            {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </button>
          <button
    onClick={reset}
    className="w-10 h-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center hover:bg-muted/80 transition-colors"
  >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          Cycles completed: <span className="font-semibold text-foreground">{cycles}</span>
        </div>
      </motion.div>

      {
    /* Technique Info */
  }
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
        <h2 className="font-display text-lg font-semibold text-foreground mb-3">{technique.name}</h2>
        <div className="flex gap-4 text-sm">
          <span className="px-3 py-1.5 rounded-lg bg-calm-blue text-foreground">Inhale {technique.inhale}s</span>
          {technique.hold > 0 && <span className="px-3 py-1.5 rounded-lg bg-calm-lavender text-foreground">Hold {technique.hold}s</span>}
          <span className="px-3 py-1.5 rounded-lg bg-calm-green text-foreground">Exhale {technique.exhale}s</span>
          {technique.rest > 0 && <span className="px-3 py-1.5 rounded-lg bg-calm-peach text-foreground">Rest {technique.rest}s</span>}
        </div>
      </div>
    </div>;
}
