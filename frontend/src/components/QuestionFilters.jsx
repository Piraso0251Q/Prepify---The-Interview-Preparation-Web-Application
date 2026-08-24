import { Search, Filter } from "lucide-react";
import { ROLES, ALL_TOPICS, DIFFICULTIES } from "../data/questions";
import "./QuestionFilters.css";

export const QuestionFilters = ({ filters, onChange }) => {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });
  const toggleBookmark = () => onChange({ ...filters, bookmarkedOnly: !filters.bookmarkedOnly });

  return (
    <div className="qf-container">
      <div className="qf-search-wrap">
        <Search size={16} className="qf-search-icon" />
        <input
          type="search"
          className="qf-search"
          placeholder="Search questions..."
          value={filters.search}
          onChange={set("search")}
          aria-label="Search questions"
        />
      </div>

      <div className="qf-selects">
        <select className="qf-select" value={filters.role} onChange={set("role")} aria-label="Filter by role">
          <option value="">All Roles</option>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>

        <select className="qf-select" value={filters.topic} onChange={set("topic")} aria-label="Filter by topic">
          <option value="">All Topics</option>
          {ALL_TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <select className="qf-select" value={filters.difficulty} onChange={set("difficulty")} aria-label="Filter by difficulty">
          <option value="">All Difficulties</option>
          {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <button
          className={`qf-bookmark-filter ${filters.bookmarkedOnly ? "active" : ""}`}
          onClick={toggleBookmark}
          aria-pressed={filters.bookmarkedOnly}
        >
          ★ Bookmarked
        </button>
      </div>
    </div>
  );
};
