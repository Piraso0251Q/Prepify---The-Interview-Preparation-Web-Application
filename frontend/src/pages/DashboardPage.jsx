import { useNavigate } from "react-router-dom";
import { BookOpen, Play, CheckCircle2, BarChart3, BookMarked, ClipboardList, ChevronRight, Trophy, Target, Zap } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useBookmarks } from "../hooks/useBookmarks";
import { useInterviewHistory } from "../hooks/useInterviewHistory";
import { ROLES } from "../data/questions";
import { getPerformanceLabel } from "../utils/scoring";
import { formatDate } from "../utils/formatting";
import { Button } from "../components/ui/Button";
import { StatusBadge } from "../components/ui/Badge";
import "./DashboardPage.css";

const ROLE_COLORS = {
  "Frontend":    { bg: "rgba(99,102,241,0.1)",  color: "#6366F1", icon: "⚛️" },
  "Backend":     { bg: "rgba(16,185,129,0.1)",  color: "#10B981", icon: "⚙️" },
  "Full-Stack":  { bg: "rgba(245,158,11,0.1)",  color: "#F59E0B", icon: "🔗" },
  "SDE-1":       { bg: "rgba(239,68,68,0.1)",   color: "#EF4444", icon: "💡" },
  "QA":          { bg: "rgba(139,92,246,0.1)",  color: "#8B5CF6", icon: "🧪" },
};

export default function DashboardPage() {
  const { user, selectedRole, setSelectedRole } = useAuth();
  const { bookmarks } = useBookmarks();
  const { history } = useInterviewHistory();
  const navigate = useNavigate();

  const avgScore = history.length
    ? Math.round(history.reduce((s, h) => s + h.overallScore, 0) / history.length)
    : 0;

  const totalQuestions = history.reduce((s, h) => s + (h.questions?.length || 0), 0);

  const stats = [
    { label: "Interviews Completed", value: history.length, icon: <CheckCircle2 size={20} />, color: "var(--success)" },
    { label: "Average Score",        value: `${avgScore}%`, icon: <BarChart3 size={20} />,    color: "var(--accent)" },
    { label: "Questions Practiced",  value: totalQuestions, icon: <ClipboardList size={20} />, color: "var(--warning)" },
    { label: "Bookmarked Questions", value: bookmarks.length, icon: <BookMarked size={20} />,  color: "var(--danger)" },
  ];

  return (
    <div className="dashboard page-enter">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">
            Good {getTimeOfDay()}, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="dashboard-subtitle">
            Ready to ace your next technical interview? Let's get started.
          </p>
        </div>
        <div className="dashboard-header-right">
          <div className="current-role-chip">
            <span className="current-role-icon">{ROLE_COLORS[selectedRole]?.icon}</span>
            <span>{selectedRole}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid stagger">
        {stats.map(stat => (
          <div key={stat.label} className="stat-card animate-fade-slide-up">
            <div className="stat-icon" style={{ background: `${stat.color}22`, color: stat.color }}>
              {stat.icon}
            </div>
            <div>
              <p className="stat-value">{stat.value}</p>
              <p className="stat-label">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="dashboard-actions-grid">
        <div className="mode-card mode-card-primary" onClick={() => navigate("/questions")}>
          <div className="mode-card-icon"><BookOpen size={28} /></div>
          <div className="mode-card-content">
            <h3>Question Bank</h3>
            <p>Browse and practice from 60+ curated questions across all roles and topics.</p>
          </div>
          <ChevronRight size={20} className="mode-card-arrow" />
        </div>

        <div className="mode-card mode-card-secondary" onClick={() => navigate("/interview/setup")}>
          <div className="mode-card-icon"><Play size={28} /></div>
          <div className="mode-card-content">
            <h3>Mock Interview</h3>
            <p>Take a timed 5-question interview and receive AI-powered feedback on your answers.</p>
          </div>
          <ChevronRight size={20} className="mode-card-arrow" />
        </div>
      </div>

      {/* Role Selection */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Your Target Role</h2>
          <p className="section-subtitle">Select the role you're preparing for</p>
        </div>
        <div className="roles-grid">
          {ROLES.map(role => {
            const meta = ROLE_COLORS[role];
            const active = role === selectedRole;
            return (
              <button
                key={role}
                className={`role-card ${active ? "role-card-active" : ""}`}
                onClick={() => setSelectedRole(role)}
                style={active ? { borderColor: meta.color, background: meta.bg } : {}}
                aria-pressed={active}
              >
                <span className="role-card-icon" style={{ background: meta.bg, color: meta.color }}>
                  {meta.icon}
                </span>
                <span className="role-card-name">{role}</span>
                {active && <span className="role-card-check" style={{ color: meta.color }}>✓</span>}
              </button>
            );
          })}
        </div>
      </section>

      {/* Recent Interviews */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Recent Interviews</h2>
          {history.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => navigate("/history")}>
              View all →
            </Button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Trophy size={40} /></div>
            <h3>No interviews yet</h3>
            <p>You haven't completed any mock interviews yet. Start one to see your results here!</p>
            <Button onClick={() => navigate("/interview/setup")} icon={<Play size={16} />}>
              Start Mock Interview
            </Button>
          </div>
        ) : (
          <div className="recent-table-wrap">
            <table className="recent-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Role</th>
                  <th>Score</th>
                  <th>Performance</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {history.slice(0, 3).map(entry => {
                  const perf = getPerformanceLabel(entry.overallScore);
                  return (
                    <tr key={entry.id} className="recent-table-row" onClick={() => navigate(`/results/${entry.id}`)}>
                      <td>{formatDate(entry.completedAt)}</td>
                      <td><span className="table-role">{entry.role}</span></td>
                      <td><span className="table-score">{entry.overallScore}%</span></td>
                      <td><StatusBadge status={perf.label} /></td>
                      <td><ChevronRight size={16} style={{ color: "var(--text-muted)" }} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
