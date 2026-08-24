import { useState, useMemo } from "react";
import { BookOpen } from "lucide-react";
import { QUESTIONS } from "../data/questions";
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

  const filtered = useMemo(() => {
    return QUESTIONS.filter(q => {
      if (filters.bookmarkedOnly && !isBookmarked(q.id)) return false;
      if (filters.role && q.role !== filters.role) return false;
      if (filters.topic && q.topic !== filters.topic) return false;
      if (filters.difficulty && q.difficulty !== filters.difficulty) return false;
      if (filters.search) {
        const s = filters.search.toLowerCase();
        return q.title.toLowerCase().includes(s) || q.topic.toLowerCase().includes(s) || q.role.toLowerCase().includes(s);
      }
      return true;
    });
  }, [filters, bookmarks]);

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
          <p className="qbank-subtitle">Browse and practice from {QUESTIONS.length} curated interview questions</p>
        </div>
        <div className="qbank-count">{filtered.length} questions</div>
      </div>

      <QuestionFilters filters={filters} onChange={setFilters} />

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><BookOpen size={40} /></div>
          <h3>No questions found</h3>
          <p>Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <div className="qbank-grid">
          {filtered.map(q => (
            <QuestionCard
              key={q.id}
              question={q}
              isBookmarked={isBookmarked(q.id)}
              onToggleBookmark={handleBookmark}
            />
          ))}
        </div>
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
