// Local storage helpers for demo. Replace with Lovable Cloud for production.

export interface UserProfile {
  name: string;
  age: number;
  email: string;
}

export interface MoodEntry {
  id: string;
  date: string;
  mood: number; // 1-5
  note?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
}

export interface AssessmentResult {
  id: string;
  date: string;
  stressScore: number;
  anxietyScore: number;
  depressionScore: number;
  overallLevel: 'Low' | 'Moderate' | 'High';
  suggestions: string[];
}

const get = <T>(key: string, fallback: T): T => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
};
const set = (key: string, value: unknown) => localStorage.setItem(key, JSON.stringify(value));

export const getProfile = (): UserProfile | null => get('mh_profile', null);
export const setProfile = (p: UserProfile) => set('mh_profile', p);

export const getMoods = (): MoodEntry[] => get('mh_moods', []);
export const addMood = (m: MoodEntry) => { const all = getMoods(); all.unshift(m); set('mh_moods', all); };

export const getJournals = (): JournalEntry[] => get('mh_journals', []);
export const addJournal = (j: JournalEntry) => { const all = getJournals(); all.unshift(j); set('mh_journals', all); };
export const deleteJournal = (id: string) => set('mh_journals', getJournals().filter(j => j.id !== id));

export const getAssessments = (): AssessmentResult[] => get('mh_assessments', []);
export const addAssessment = (a: AssessmentResult) => { const all = getAssessments(); all.unshift(a); set('mh_assessments', all); };

export const isLoggedIn = (): boolean => get('mh_logged_in', false);
export const login = () => set('mh_logged_in', true);
export const logout = () => { localStorage.removeItem('mh_logged_in'); };

// Profile picture
export const getProfilePic = (): string | null => get('mh_profile_pic', null);
export const setProfilePic = (dataUrl: string) => set('mh_profile_pic', dataUrl);

// Mental Health Score computation
export const computeMentalHealthScore = (): number => {
  const assessments = getAssessments();
  const moods = getMoods();
  if (assessments.length === 0 && moods.length === 0) return 0;

  let score = 75; // baseline

  // Factor in latest assessment
  if (assessments.length > 0) {
    const a = assessments[0];
    const avgAssessment = (a.stressScore + a.anxietyScore + a.depressionScore) / 3;
    score -= avgAssessment * 2; // higher scores reduce mental health score
  }

  // Factor in recent moods (last 7)
  if (moods.length > 0) {
    const recent = moods.slice(0, 7);
    const avgMood = recent.reduce((s, m) => s + m.mood, 0) / recent.length;
    score += (avgMood - 3) * 10; // mood 3 is neutral
  }

  return Math.max(0, Math.min(100, Math.round(score)));
};

// Trigger detection from mood notes
export const detectTriggers = (): { trigger: string; count: number }[] => {
  const moods = getMoods();
  const lowMoods = moods.filter(m => m.mood <= 2 && m.note);
  const keywords: Record<string, number> = {};
  const triggerWords = ['work', 'stress', 'sleep', 'family', 'money', 'health', 'lonely', 'anxiety', 'tired', 'overwhelmed', 'deadline', 'conflict', 'social', 'exam', 'pressure'];

  lowMoods.forEach(m => {
    const note = m.note!.toLowerCase();
    triggerWords.forEach(t => {
      if (note.includes(t)) {
        keywords[t] = (keywords[t] || 0) + 1;
      }
    });
  });

  return Object.entries(keywords)
    .map(([trigger, count]) => ({ trigger, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
};

// Weekly data helpers
export const getWeeklyMoods = (): MoodEntry[] => {
  const moods = getMoods();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return moods.filter(m => new Date(m.date) >= weekAgo);
};

export const getWeeklyJournals = (): JournalEntry[] => {
  const journals = getJournals();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return journals.filter(j => new Date(j.date) >= weekAgo);
};
