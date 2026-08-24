import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, ChevronRight, Filter, Trophy } from "lucide-react";
import { useInterviewHistory } from "../hooks/useInterviewHistory";
import { getPerformanceLabel } from "../utils/scoring";
import { formatDate } from "../utils/formatting";
import { ROLES } from "../data/questions";
import { StatusBadge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import "./HistoryPage.css";

export default function HistoryPage() {
  const { history } = useInterviewHistory();
  const navigate = useNavigate();
  const [filterRole, setFilterRole] = useState("");

  const filtered = filterRole ? history.filter(h => h.role === filterRole) : history;

  return (
    <div className="history page-enter">
      <div className="history-header">
        <div>
          <h1 className="history-title">Interview History</h1>
          <p className="history-subtitle">{history.length} completed interview{history.length !== 1 ? "s" : ""}</p>
        </div>

        <div className="history-filter">
          <Filter size={15} />
          <select
            className="history-select"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            aria-label="Filter by role"
          >
            <option value="">All Roles</option>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Trophy size={44} /></div>
          <h3>No interviews yet</h3>
          <p>
            {filterRole
              ? `No ${filterRole} interviews found. Try removing the filter.`
              : "You haven't completed any mock interviews yet. Start one to track your progress!"}
          </p>
          <Button onClick={() => navigate("/interview/setup")}>Start Mock Interview</Button>
        </div>
      ) : (
        <div className="history-table-wrap">
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Role</th>
                <th>Score</th>
                <th>Performance</th>
                <th>Questions</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(entry => {
                const perf = getPerformanceLabel(entry.overallScore);
                return (
                  <tr
                    key={entry.id}
                    className="history-row"
                    onClick={() => navigate(`/results/${entry.id}`)}
                  >
                    <td className="history-td-date">
                      <Clock size={13} />
                      {formatDate(entry.completedAt)}
                    </td>
                    <td><span className="history-role">{entry.role}</span></td>
                    <td>
                      <span className="history-score" style={{ color: perf.color }}>
                        {entry.overallScore}%
                      </span>
                    </td>
                    <td><StatusBadge status={perf.label} /></td>
                    <td className="history-td-questions">
                      {entry.questions?.length || entry.questionResults?.length || 5} questions
                    </td>
                    <td>
                      <button className="history-view-btn">
                        View Results <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
