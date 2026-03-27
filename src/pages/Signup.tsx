import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Eye, EyeOff } from "lucide-react";
import { login, setProfile } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !age) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    if (parseInt(age) < 10 || parseInt(age) > 120) {
      toast({ title: "Please enter a valid age", variant: "destructive" });
      return;
    }
    setProfile({ name, email, age: parseInt(age) });
    login();
    toast({ title: "Welcome to MindCare! 🌱" });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen gradient-surface flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="w-10 h-10 rounded-xl gradient-calm flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">MindCare</span>
        </Link>

        <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Create Account</h1>
          <p className="text-sm text-muted-foreground mb-6">Start your wellness journey today</p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                placeholder="John Doe" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                placeholder="you@example.com" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Age</label>
              <input type="number" value={age} onChange={e => setAge(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                placeholder="25" min="10" max="120" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all pr-10"
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-3.5 text-muted-foreground">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" className="w-full py-3 rounded-xl gradient-calm text-primary-foreground font-semibold shadow-soft hover:opacity-90 transition-opacity">
              Create Account
            </button>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
