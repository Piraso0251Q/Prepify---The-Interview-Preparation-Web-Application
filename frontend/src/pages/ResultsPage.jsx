import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, BookOpen, ChevronDown, ChevronUp, Trophy, Target, Zap, AlertCircle, CheckCircle } from "lucide-react";
import { useInterview } from "../context/InterviewContext";
import { useInterviewHistory } from "../hooks/useInterviewHistory";
import { useTokens } from "../hooks/useTokens";
import { scoreAnswer, calculateOverallScore, getPerformanceLabel } from "../utils/scoring";
import { generateAIFeedback } from "../data/mockResults";
import { DifficultyBadge, TopicBadge, StatusBadge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import "./ResultsPage.css";

export default function ResultsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { questions, answers, role, resetInterview } = useInterview();
  const { addEntry, getEntry } = useInterviewHistory();
  const { awardTokens } = useTokens();
  const [expanded, setExpanded] = useState({});
  const [saved, setSaved] = useState(false);

  // Load from history if viewing a past result
  const historyEntry = id !== "new" ? getEntry(id) : null;

  const data = useMemo(() => {
    if (historyEntry) return historyEntry;
    if (!questions.length) return null;

    const questionResults = questions.map(q => {
      const userAnswer = answers[q.id] || "";
      const score = scoreAnswer(q, userAnswer);
      const aiFeedback = generateAIFeedback(q, userAnswer, score);
      return { question: q, userAnswer, score, aiFeedback };
    });

    const scores = questionResults.map(r => r.score);
    const overallScore = calculateOverallScore(scores);
    return { questionResults, overallScore, role, completedAt: new Date().toISOString() };
  }, [historyEntry, questions, answers]);

  // Save to history once
  useEffect(() => {
    if (!saved && id === "new" && data && questions.length > 0) {
      setSaved(true);
      const entry = {
        id: `interview-${Date.now()}`,
        ...data,
        questions: data.questionResults?.map(r => r.question),
      };
      addEntry(entry);
      awardTokens(entry.id, data.overallScore, data.role);
      resetInterview();
    }
  }, [data]);

  if (!data) {
    return (
      <div className="results-empty page-enter">
        <h2>No results found</h2>
        <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
      </div>
    );
  }

  const { questionResults, overallScore } = data;
  const perf = getPerformanceLabel(overallScore);
  const strongAnswers = questionResults.filter(r => r.score >= 70).length;
  const weakAnswers   = questionResults.filter(r => r.score < 40).length;
  const answered      = questionResults.filter(r => r.userAnswer?.trim()).length;

  const allStrengths   = [...new Set(questionResults.flatMap(r => r.aiFeedback?.strengths || []))].slice(0, 3);
  const allMissing     = [...new Set(questionResults.flatMap(r => r.aiFeedback?.missingKeywords || []))].slice(0, 6);
  const allImprovements = [...new Set(questionResults.flatMap(r => r.aiFeedback?.improvements || []))].slice(0, 3);

  const toggleExpand = (id) => setExpanded(p => ({ ...p, [id]: !p[id] }));

  return (
    <div className="results page-enter">
      {/* Hero score */}
      <div className="results-hero">
        <div className="results-score-ring">
          <svg viewBox="0 0 120 120" className="score-ring-svg">
            <circle cx="60" cy="60" r="54" className="score-ring-bg" />
            <circle
              cx="60" cy="60" r="54"
              className="score-ring-fill"
              style={{
                stroke: perf.color,
                strokeDasharray: `${(overallScore / 100) * 339} 339`,
              }}
            />
          </svg>
          <div className="score-ring-content">
            <span className="score-ring-value">{overallScore}</span>
            <span className="score-ring-label">/ 100</span>
          </div>
        </div>

        <div className="results-hero-info">
          <StatusBadge status={perf.label} />
          <h1 className="results-hero-title">Interview Complete!</h1>
          <p className="results-hero-sub">Here's a detailed breakdown of your performance</p>

          <div className="results-stats">
            <div className="results-stat">
              <CheckCircle size={18} className="stat-icon-green" />
              <div><strong>{answered}</strong><span>Answered</span></div>
            </div>
            <div className="results-stat">
              <Trophy size={18} className="stat-icon-gold" />
              <div><strong>{strongAnswers}</strong><span>Strong answers</span></div>
            </div>
            <div className="results-stat">
              <AlertCircle size={18} className="stat-icon-red" />
              <div><strong>{weakAnswers}</strong><span>Needs work</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Feedback */}
      <div className="ai-feedback-section">
        <h2 className="section-title">AI Performance Analysis</h2>
        <div className="ai-feedback-grid">
          <div className="ai-card ai-strengths">
            <h3><CheckCircle size={16} /> Strengths</h3>
            <ul>{allStrengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
          </div>
          <div className="ai-card ai-missing">
            <h3><AlertCircle size={16} /> Missing Keywords</h3>
            <div className="ai-keywords">
              {allMissing.length ? allMissing.map(kw => (
                <span key={kw} className="ai-keyword">{kw}</span>
              )) : <span className="ai-none">Great job — no major keywords missed!</span>}
            </div>
          </div>
          <div className="ai-card ai-improve">
            <h3><Zap size={16} /> Areas to Improve</h3>
            <ul>{allImprovements.map((imp, i) => <li key={i}>{imp}</li>)}</ul>
          </div>
        </div>
      </div>

      {/* Per-question review */}
      <div className="results-reviews">
        <h2 className="section-title">Question Review</h2>
        <div className="review-list">
          {questionResults.map((r, i) => (
            <div key={r.question.id} className="review-card">
              <div className="review-card-header" onClick={() => toggleExpand(r.question.id)}>
                <div className="review-card-left">
                  <span className="review-num">{i + 1}</span>
                  <div>
                    <p className="review-question-title">{r.question.title}</p>
                    <div className="review-badges">
                      <DifficultyBadge difficulty={r.question.difficulty} />
                      <TopicBadge topic={r.question.topic} />
                    </div>
                  </div>
                </div>
                <div className="review-card-right">
                  <span className="review-score" style={{ color: getPerformanceLabel(r.score).color }}>
                    {r.score}%
                  </span>
                  {expanded[r.question.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {expanded[r.question.id] && (
                <div className="review-card-body animate-fade-slide-up">
                  <div className="review-section">
                    <h4>Your Answer</h4>
                    <div className="review-answer-text user-answer">
                      {r.userAnswer?.trim() || <em className="no-answer">No answer provided.</em>}
                    </div>
                  </div>
                  <div className="review-section">
                    <h4>Model Answer</h4>
                    <div className="review-answer-text model-answer">
                      {r.question.modelAnswer}
                    </div>
                  </div>
                  {r.aiFeedback?.missingKeywords?.length > 0 && (
                    <div className="review-section">
                      <h4>Missing Keywords</h4>
                      <div className="ai-keywords">
                        {r.aiFeedback.missingKeywords.map(kw => (
                          <span key={kw} className="ai-keyword">{kw}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="results-actions">
        <Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
        <Button variant="outline" onClick={() => navigate("/questions")}>
          Practice Weak Areas
        </Button>
        <Button onClick={() => navigate("/history")} icon={<Clock size={16} />}>
          View History
        </Button>
      </div>
    </div>
  );
}
