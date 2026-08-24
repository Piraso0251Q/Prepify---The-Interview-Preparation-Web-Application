import { Bookmark, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DifficultyBadge, TopicBadge } from "./ui/Badge";
import "./QuestionCard.css";

export const QuestionCard = ({ question, isBookmarked, onToggleBookmark }) => {
  const navigate = useNavigate();

  return (
    <article className="question-card animate-fade-slide-up">
      <div className="question-card-header">
        <div className="question-card-badges">
          <DifficultyBadge difficulty={question.difficulty} />
          <TopicBadge topic={question.topic} />
        </div>
        <button
          className={`bookmark-btn ${isBookmarked ? "bookmarked" : ""}`}
          onClick={(e) => { e.stopPropagation(); onToggleBookmark(question.id); }}
          aria-label={isBookmarked ? "Remove bookmark" : "Bookmark question"}
          aria-pressed={isBookmarked}
        >
          <Bookmark size={16} fill={isBookmarked ? "currentColor" : "none"} />
        </button>
      </div>

      <h3 className="question-card-title">{question.title}</h3>

      <p className="question-card-role">{question.role}</p>

      <div className="question-card-footer">
        <button
          className="question-card-open"
          onClick={() => navigate(`/questions/${question.id}`)}
          aria-label={`Open question: ${question.title}`}
        >
          Open Question <ArrowRight size={14} />
        </button>
      </div>
    </article>
  );
};
