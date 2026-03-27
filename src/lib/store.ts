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
