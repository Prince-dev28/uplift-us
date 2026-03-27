import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { User, Save, History, Camera } from "lucide-react";
import { getProfile, setProfile, getAssessments, getProfilePic, setProfilePic } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const p = getProfile();
  const [name, setName] = useState(p?.name || "");
  const [email, setEmail] = useState(p?.email || "");
  const [age, setAge] = useState(p?.age?.toString() || "");
  const [profilePic, setProfilePicState] = useState<string | null>(getProfilePic());
  const assessments = getAssessments();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const save = () => {
    if (!name || !email || !age) { toast({ title: "Please fill all fields", variant: "destructive" }); return; }
    setProfile({ name, email, age: parseInt(age) });
    toast({ title: "Profile updated! ✅" });
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast({ title: "Image must be under 2MB", variant: "destructive" }); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setProfilePic(dataUrl);
      setProfilePicState(dataUrl);
      toast({ title: "Photo updated! 📸" });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
        <User className="w-6 h-6 text-primary" /> Profile
      </h1>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-6 shadow-card border border-border">
        {/* Profile Picture */}
        <div className="relative w-20 h-20 mx-auto mb-6 group cursor-pointer" onClick={() => fileRef.current?.click()}>
          {profilePic ? (
            <img src={profilePic} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-border" />
          ) : (
            <div className="w-20 h-20 rounded-full gradient-calm flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">{name?.[0]?.toUpperCase() || "?"}</span>
            </div>
          )}
          <div className="absolute inset-0 rounded-full bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera className="w-5 h-5 text-background" />
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Age</label>
            <input type="number" value={age} onChange={e => setAge(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
          </div>
          <button onClick={save} className="w-full py-3 rounded-xl gradient-calm text-primary-foreground font-semibold shadow-soft hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </motion.div>

      {/* Assessment History */}
      {assessments.length > 0 && (
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <History className="w-4 h-4 text-primary" /> Assessment History
          </h2>
          <div className="space-y-3">
            {assessments.map(a => (
              <div key={a.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    a.overallLevel === 'Low' ? 'bg-calm-green' : a.overallLevel === 'Moderate' ? 'bg-calm-peach' : 'bg-calm-rose'
                  } text-foreground`}>{a.overallLevel}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    S:{a.stressScore} A:{a.anxietyScore} D:{a.depressionScore}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(a.date).toLocaleDateString("en", { month: "short", day: "numeric" })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
