import { useState, useEffect, useMemo } from "react";
import { BookOpen } from "lucide-react";
import { questionsAPI } from "../utils/api";
import { useBookmarks } from "../hooks/useBookmarks";
import { useToast } from "../hooks/useToast";
import { QuestionCard } from "../components/QuestionCard";
import { QuestionFilters } from "../components/QuestionFilters";
import { ToastContainer } from "../components/ui/Toast";
import "./QuestionBankPage.css";

const DEFAULT_FILTERS = { search: "", role: "", topic: "", difficulty: "", bookmarkedOnly: false };

export default function QuestionBankPage() {
  const { bookmarks, toggle, isBookmarked } = useBookmarks();
  const { toasts, addToast, removeToast } = useToast();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [questions, setQuestions] = useState([]);
  const [loadingQ, setLoadingQ] = useState(true);

  // Fetch questions from backend whenever role/difficulty/topic filter changes
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoadingQ(true);
      const data = await questionsAPI.getAll({
        role: filters.role,
        difficulty: filters.difficulty,
        topic: filters.topic,
        search: filters.search,
      });
      if (data.success) setQuestions(data.questions);
      setLoadingQ(false);
    };
    fetchQuestions();
  }, [filters.role, filters.difficulty, filters.topic, filters.search]);

  // Client-side bookmarks filter (no need to call backend for this)
  const filtered = useMemo(() => {
    if (!filters.bookmarkedOnly) return questions;
    return questions.filter(q => isBookmarked(q._id));
  }, [questions, filters.bookmarkedOnly, bookmarks]);

  const handleBookmark = (id) => {
    const wasBookmarked = isBookmarked(id);
    toggle(id);
    addToast(wasBookmarked ? "Bookmark removed." : "Question bookmarked!", wasBookmarked ? "info" : "success");
  };

  return (
    <div className="qbank page-enter">
      <div className="qbank-header">
        <div>
          <h1 className="qbank-title">Question Bank</h1>
          <p className="qbank-subtitle">Browse and practice from {questions.length} curated interview questions</p>
        </div>
        <div className="qbank-count">{filtered.length} questions</div>
      </div>

      <QuestionFilters filters={filters} onChange={setFilters} />

      {loadingQ ? (
        <div className="empty-state">
          <p>Loading questions...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><BookOpen size={40} /></div>
          <h3>No questions found</h3>
          <p>Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <div className="qbank-grid">
          {filtered.map(q => (
            <QuestionCard
              key={q._id}
              question={{ ...q, id: q._id }}
              isBookmarked={isBookmarked(q._id)}
              onToggleBookmark={handleBookmark}
            />
          ))}
        </div>
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
