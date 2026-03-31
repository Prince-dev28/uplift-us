const get = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};
const set = (key, value) => localStorage.setItem(key, JSON.stringify(value));
export const getProfile = () => get("mh_profile", null);
export const setProfile = (p) => set("mh_profile", p);
export const getMoods = () => get("mh_moods", []);
export const addMood = (m) => {
  const all = getMoods();
  all.unshift(m);
  set("mh_moods", all);
};
export const getJournals = () => get("mh_journals", []);
export const addJournal = (j) => {
  const all = getJournals();
  all.unshift(j);
  set("mh_journals", all);
};
export const deleteJournal = (id) => set("mh_journals", getJournals().filter((j) => j.id !== id));
export const getAssessments = () => get("mh_assessments", []);
export const addAssessment = (a) => {
  const all = getAssessments();
  all.unshift(a);
  set("mh_assessments", all);
};
export const isLoggedIn = () => get("mh_logged_in", false);
export const login = () => set("mh_logged_in", true);
export const logout = () => {
  localStorage.removeItem("mh_logged_in");
};
export const getProfilePic = () => get("mh_profile_pic", null);
export const setProfilePic = (dataUrl) => set("mh_profile_pic", dataUrl);
export const computeMentalHealthScore = () => {
  const assessments = getAssessments();
  const moods = getMoods();
  if (assessments.length === 0 && moods.length === 0) return 0;
  let score = 75;
  if (assessments.length > 0) {
    const a = assessments[0];
    const avgAssessment = (a.stressScore + a.anxietyScore + a.depressionScore) / 3;
    score -= avgAssessment * 2;
  }
  if (moods.length > 0) {
    const recent = moods.slice(0, 7);
    const avgMood = recent.reduce((s, m) => s + m.mood, 0) / recent.length;
    score += (avgMood - 3) * 10;
  }
  return Math.max(0, Math.min(100, Math.round(score)));
};
export const detectTriggers = () => {
  const moods = getMoods();
  const lowMoods = moods.filter((m) => m.mood <= 2 && m.note);
  const keywords = {};
  const triggerWords = ["work", "stress", "sleep", "family", "money", "health", "lonely", "anxiety", "tired", "overwhelmed", "deadline", "conflict", "social", "exam", "pressure"];
  lowMoods.forEach((m) => {
    const note = m.note.toLowerCase();
    triggerWords.forEach((t) => {
      if (note.includes(t)) {
        keywords[t] = (keywords[t] || 0) + 1;
      }
    });
  });
  return Object.entries(keywords).map(([trigger, count]) => ({ trigger, count })).sort((a, b) => b.count - a.count).slice(0, 5);
};
export const getWeeklyMoods = () => {
  const moods = getMoods();
  const weekAgo = /* @__PURE__ */ new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return moods.filter((m) => new Date(m.date) >= weekAgo);
};
export const getWeeklyJournals = () => {
  const journals = getJournals();
  const weekAgo = /* @__PURE__ */ new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return journals.filter((j) => new Date(j.date) >= weekAgo);
};
