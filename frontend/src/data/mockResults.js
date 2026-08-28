
// MOCK AI FEEDBACK TEMPLATES

export const FEEDBACK_TEMPLATES = {
  excellent: {
    label: "Excellent",
    strengths: ["Demonstrated strong conceptual understanding", "Used precise technical terminology", "Provided relevant examples"],
    improvements: ["Consider exploring edge cases", "Could expand on performance implications"],
  },
  good: {
    label: "Good",
    strengths: ["Covered the core concepts well", "Showed practical knowledge"],
    improvements: ["Missing some important keywords", "Could improve depth of explanation", "Consider real-world examples"],
  },
  needsPractice: {
    label: "Needs Practice",
    strengths: ["Attempted to address the question"],
    improvements: ["Review the core concepts", "Practice with more examples", "Focus on understanding the fundamentals", "Review related topics"],
  },
};

export const generateAIFeedback = (question, userAnswer, score) => {
  const keywords = question.keywords || [];
  const answer = (userAnswer || "").toLowerCase();
  const matchedKeywords = keywords.filter(kw => answer.includes(kw.toLowerCase()));
  const missingKeywords = keywords.filter(kw => !answer.includes(kw.toLowerCase()));

  let template;
  if (score >= 75) template = FEEDBACK_TEMPLATES.excellent;
  else if (score >= 45) template = FEEDBACK_TEMPLATES.good;
  else template = FEEDBACK_TEMPLATES.needsPractice;

  return {
    score,
    strengths: template.strengths,
    missingKeywords: missingKeywords.slice(0, 4),
    improvements: template.improvements,
    matchedKeywords,
  };
};
