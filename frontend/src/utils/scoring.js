// 
// SCORING UTILITY
// 

export const scoreAnswer = (question, userAnswer) => {
  if (!userAnswer || userAnswer.trim().length === 0) return 0;
  const keywords = question.keywords || [];
  const answer = userAnswer.toLowerCase();
  const matched = keywords.filter(kw => answer.includes(kw.toLowerCase()));
  const keywordScore = keywords.length > 0 ? (matched.length / keywords.length) * 70 : 35;
  const lengthScore = Math.min(answer.split(" ").filter(Boolean).length / 30, 1) * 30;
  return Math.round(Math.min(keywordScore + lengthScore, 100));
};

export const getPerformanceLabel = (score) => {
  if (score >= 80) return { label: "Excellent", color: "var(--success)" };
  if (score >= 60) return { label: "Good", color: "var(--accent)" };
  if (score >= 40) return { label: "Needs Practice", color: "var(--warning)" };
  return { label: "Keep Practicing", color: "var(--danger)" };
};

export const calculateOverallScore = (scores) => {
  if (!scores || scores.length === 0) return 0;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
};
