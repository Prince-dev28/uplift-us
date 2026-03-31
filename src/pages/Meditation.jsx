import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Flower2, Play, Pause, RotateCcw, Timer } from "lucide-react";
const durations = [
  { label: "2 min", seconds: 120 },
  { label: "5 min", seconds: 300 },
  { label: "10 min", seconds: 600 },
  { label: "15 min", seconds: 900 }
];
const ambiences = [
  { name: "Silence", emoji: "\u{1F92B}" },
  { name: "Nature", emoji: "\u{1F33F}" },
  { name: "Rain", emoji: "\u{1F327}\uFE0F" },
  { name: "Ocean", emoji: "\u{1F30A}" }
];
export default function Meditation() {
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [selectedAmbience, setSelectedAmbience] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(durations[1].seconds);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef(null);
  const duration = durations[selectedDuration];
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            setIsComplete(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1e3);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft]);
  const reset = () => {
    setIsActive(false);
    setTimeLeft(duration.seconds);
    setIsComplete(false);
  };
  const selectDuration = (i) => {
    setSelectedDuration(i);
    setTimeLeft(durations[i].seconds);
    setIsActive(false);
    setIsComplete(false);
  };
  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };
  const progress = 1 - timeLeft / duration.seconds;
  return <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
        <Flower2 className="w-6 h-6 text-secondary" /> Meditation Mode
      </h1>

      {
    /* Duration Selector */
  }
      <div className="flex gap-2 flex-wrap">
        {durations.map((d, i) => <button
    key={d.label}
    onClick={() => selectDuration(i)}
    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${i === selectedDuration ? "gradient-ocean text-secondary-foreground shadow-soft" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
  >
            <Timer className="w-3 h-3 inline mr-1" />{d.label}
          </button>)}
      </div>

      {
    /* Main Meditation Area */
  }
      <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`rounded-2xl p-8 shadow-card border border-border flex flex-col items-center transition-colors duration-1000 ${isActive ? "bg-foreground/[0.02]" : "bg-card"}`}
  >
        {
    /* Animated Circle */
  }
        <div className="relative w-64 h-64 flex items-center justify-center">
          {
    /* Progress ring */
  }
          <svg className="absolute w-full h-full -rotate-90">
            <circle cx="128" cy="128" r="110" fill="none" stroke="hsl(220 20% 93%)" strokeWidth="4" />
            <motion.circle
    cx="128"
    cy="128"
    r="110"
    fill="none"
    stroke="hsl(168 42% 52%)"
    strokeWidth="4"
    strokeDasharray={691}
    strokeDashoffset={691 * (1 - progress)}
    strokeLinecap="round"
    transition={{ duration: 0.5 }}
  />
          </svg>
          {
    /* Pulsing center */
  }
          <motion.div
    animate={isActive ? { scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] } : { scale: 1, opacity: 1 }}
    transition={isActive ? { duration: 4, repeat: Infinity, ease: "easeInOut" } : {}}
    className="w-36 h-36 rounded-full gradient-ocean flex items-center justify-center shadow-elevated"
  >
            {isComplete ? <div className="text-center">
                <div className="text-3xl">🧘</div>
                <div className="text-primary-foreground text-xs font-medium mt-1">Complete!</div>
              </div> : <div className="text-center">
                <div className="text-primary-foreground text-3xl font-bold">{formatTime(timeLeft)}</div>
                {isActive && <div className="text-primary-foreground/70 text-xs mt-1">Focus on your breath</div>}
              </div>}
          </motion.div>
        </div>

        {
    /* Controls */
  }
        <div className="flex items-center gap-4 mt-6">
          <button
    onClick={() => {
      if (isComplete) reset();
      else setIsActive(!isActive);
    }}
    className="w-14 h-14 rounded-full gradient-ocean text-primary-foreground flex items-center justify-center shadow-soft hover:opacity-90 transition-opacity"
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
      </motion.div>

      {
    /* Ambience */
  }
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
        <h2 className="font-display text-lg font-semibold text-foreground mb-3">Ambience</h2>
        <div className="grid grid-cols-4 gap-3">
          {ambiences.map((a, i) => <button
    key={a.name}
    onClick={() => setSelectedAmbience(i)}
    className={`p-4 rounded-xl text-center transition-all ${i === selectedAmbience ? "bg-calm-green border-2 border-secondary shadow-soft" : "bg-muted hover:bg-muted/80 border-2 border-transparent"}`}
  >
              <span className="text-2xl block">{a.emoji}</span>
              <span className="text-xs font-medium text-foreground mt-1 block">{a.name}</span>
            </button>)}
        </div>
        <p className="text-xs text-muted-foreground mt-3">🎧 Sound playback coming soon with Lovable Cloud</p>
      </div>

      {
    /* Tips */
  }
      <div className="bg-calm-lavender rounded-2xl p-6">
        <h3 className="font-display text-sm font-semibold text-foreground mb-2">Meditation Tips</h3>
        <ul className="text-xs text-muted-foreground space-y-1.5">
          <li>• Find a quiet, comfortable place to sit</li>
          <li>• Close your eyes and focus on your breathing</li>
          <li>• When your mind wanders, gently bring attention back</li>
          <li>• Start with shorter sessions and gradually increase</li>
        </ul>
      </div>
    </div>;
}
