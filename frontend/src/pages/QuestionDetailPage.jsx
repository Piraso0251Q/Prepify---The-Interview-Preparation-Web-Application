import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Bookmark, Tag, BarChart } from "lucide-react";
import { QUESTIONS } from "../data/questions";
import { useBookmarks } from "../hooks/useBookmarks";
import { useToast } from "../hooks/useToast";
import { DifficultyBadge, TopicBadge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { ToastContainer } from "../components/ui/Toast";
import "./QuestionDetailPage.css";

export default function QuestionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isBookmarked, toggle } = useBookmarks();
  const { toasts, addToast, removeToast } = useToast();
  const [revealed, setRevealed] = useState(false);

  const idx = QUESTIONS.findIndex(q => q.id === id);
  const question = QUESTIONS[idx];

  if (!question) return (
    <div className="qdetail-not-found">
      <h2>Question not found</h2>
      <Button onClick={() => navigate("/questions")}>← Back to Question Bank</Button>
    </div>
  );

  const prev = QUESTIONS[idx - 1];
  const next = QUESTIONS[idx + 1];
  const bookmarked = isBookmarked(question.id);

  const handleBookmark = () => {
    toggle(question.id);
    addToast(bookmarked ? "Bookmark removed." : "Question bookmarked!", bookmarked ? "info" : "success");
  };

  return (
    <div className="qdetail page-enter">
      <div className="qdetail-toolbar">
        <Button variant="ghost" size="sm" icon={<ArrowLeft size={16} />} onClick={() => navigate("/questions")}>
          Back to Question Bank
        </Button>
        <button
          className={`bookmark-btn ${bookmarked ? "bookmarked" : ""}`}
          onClick={handleBookmark}
          aria-pressed={bookmarked}
          aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
        >
          <Bookmark size={18} fill={bookmarked ? "currentColor" : "none"} />
          {bookmarked ? "Bookmarked" : "Bookmark"}
        </button>
      </div>

      <div className="qdetail-card">
        <div className="qdetail-meta">
          <DifficultyBadge difficulty={question.difficulty} />
          <TopicBadge topic={question.topic} />
          <span className="qdetail-role">{question.role}</span>
        </div>

        <h1 className="qdetail-title">{question.title}</h1>
        <p className="qdetail-description">{question.description}</p>

        {/* Answer reveal */}
        <div className="qdetail-answer-section">
          {!revealed ? (
            <div className="qdetail-reveal-prompt">
              <Eye size={20} />
              <div>
                <p className="qdetail-reveal-title">Model Answer</p>
                <p className="qdetail-reveal-sub">Think through your answer before revealing</p>
              </div>
              <Button onClick={() => setRevealed(true)} variant="outline" icon={<Eye size={15} />}>
                Reveal Answer
              </Button>
            </div>
          ) : (
            <div className="qdetail-answer animate-fade-slide-up">
              <div className="qdetail-answer-header">
                <h3>Model Answer</h3>
                <button className="qdetail-hide-btn" onClick={() => setRevealed(false)}>
                  <EyeOff size={14} /> Hide
                </button>
              </div>
              <div className="qdetail-answer-body">
                {question.modelAnswer.split("\n").map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>

              {question.explanation && (
                <div className="qdetail-explanation">
                  <h4>💡 Why This Matters</h4>
                  <p>{question.explanation}</p>
                </div>
              )}

              {question.keywords?.length > 0 && (
                <div className="qdetail-keywords">
                  <h4><Tag size={13} /> Key Concepts</h4>
                  <div className="qdetail-keyword-list">
                    {question.keywords.map(kw => (
                      <span key={kw} className="qdetail-keyword">{kw}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="qdetail-nav">
        <Button
          variant="secondary"
          icon={<ArrowLeft size={16} />}
          onClick={() => { setRevealed(false); navigate(`/questions/${prev.id}`); }}
          disabled={!prev}
        >
          Previous
        </Button>
        <span className="qdetail-nav-count">{idx + 1} / {QUESTIONS.length}</span>
        <Button
          variant="secondary"
          iconRight={<ArrowRight size={16} />}
          onClick={() => { setRevealed(false); navigate(`/questions/${next.id}`); }}
          disabled={!next}
        >
          Next
        </Button>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
