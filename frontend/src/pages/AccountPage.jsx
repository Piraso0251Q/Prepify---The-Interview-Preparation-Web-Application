import { useNavigate } from "react-router-dom";
import {
  User,
  Coins,
  Trophy,
  Star,
  Zap,
  Target,
  BarChart3,
  Clock,
  CheckCircle2,
  TrendingUp,
  Award,
  Calendar,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTokens, calcTokensForScore } from "../hooks/useTokens";
import { useInterviewHistory } from "../hooks/useInterviewHistory";
import { getPerformanceLabel } from "../utils/scoring";
import { formatDate } from "../utils/formatting";
import { Button } from "../components/ui/Button";
import "./AccountPage.css";

/* Token tier thresholds */
const TIERS = [
  { name: "Rookie",      min: 0,   max: 49,  icon: "🌱", color: "#94A3B8", bg: "rgba(148,163,184,0.12)" },
  { name: "Learner",     min: 50,  max: 124, icon: "📘", color: "#3B82F6", bg: "rgba(59,130,246,0.12)" },
  { name: "Practitioner",min: 125, max: 249, icon: "⚙️", color: "#10B981", bg: "rgba(16,185,129,0.12)" },
  { name: "Expert",      min: 250, max: 499, icon: "🏅", color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
  { name: "Master",      min: 500, max: Infinity, icon: "🏆", color: "#6366F1", bg: "rgba(99,102,241,0.12)" },
];

function getTier(tokens) {
  return TIERS.find((t) => tokens >= t.min && tokens <= t.max) || TIERS[0];
}

function getNextTier(tokens) {
  const idx = TIERS.findIndex((t) => tokens >= t.min && tokens <= t.max);
  return TIERS[idx + 1] || null;
}

/* Badges earned based on history */
function getBadges(history, totalTokens) {
  const badges = [];
  if (history.length >= 1)  badges.push({ label: "First Interview",    icon: "🎯", desc: "Completed your first mock interview" });
  if (history.length >= 5)  badges.push({ label: "Consistent",         icon: "🔥", desc: "Completed 5 interviews" });
  if (history.length >= 10) badges.push({ label: "Dedicated",          icon: "💪", desc: "Completed 10 interviews" });
  const bestScore = Math.max(...history.map((h) => h.overallScore), 0);
  if (bestScore >= 80)      badges.push({ label: "High Achiever",      icon: "⭐", desc: "Scored 80%+ in an interview" });
  if (bestScore >= 90)      badges.push({ label: "Excellence",         icon: "🏆", desc: "Scored 90%+ in an interview" });
  if (totalTokens >= 50)    badges.push({ label: "Token Collector",    icon: "💰", desc: "Earned 50+ tokens" });
  if (totalTokens >= 200)   badges.push({ label: "Token Hoarder",      icon: "🪙", desc: "Earned 200+ tokens" });
  return badges;
}

export default function AccountPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { totalTokens, ledger } = useTokens();
  const { history } = useInterviewHistory();

  const tier = getTier(totalTokens);
  const nextTier = getNextTier(totalTokens);
  const tierProgress = nextTier
    ? ((totalTokens - tier.min) / (nextTier.min - tier.min)) * 100
    : 100;

  const avgScore = history.length
    ? Math.round(history.reduce((s, h) => s + h.overallScore, 0) / history.length)
    : 0;
  const bestScore = history.length ? Math.max(...history.map((h) => h.overallScore)) : 0;

  const badges = getBadges(history, totalTokens);

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="account page-enter">
      {/* ── Profile hero ── */}
      <div className="account-hero">
        <div className="account-avatar">
          {user?.avatar || user?.name?.slice(0, 2).toUpperCase()}
        </div>
        <div className="account-hero-info">
          <h1 className="account-name">{user?.name}</h1>
          <p className="account-email">{user?.email}</p>
          <div className="account-meta">
            <span className="account-role-chip">{user?.role || "No role set"}</span>
            <span className="account-joined">
              <Calendar size={13} />
              Joined {user?.joinedAt ? formatDate(user.joinedAt) : "—"}
            </span>
          </div>
        </div>
        <div className="account-hero-actions">
          <Button
            variant="danger"
            size="sm"
            onClick={handleSignOut}
            id="account-sign-out"
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* ── Token balance + tier ── */}
      <div className="token-section">
        <div className="token-balance-card">
          <div className="token-balance-icon" style={{ background: tier.bg, color: tier.color }}>
            <Coins size={28} />
          </div>
          <div className="token-balance-info">
            <p className="token-balance-label">Total Tokens Earned</p>
            <p className="token-balance-value">{totalTokens.toLocaleString()}</p>
          </div>
          <div
            className="token-tier-badge"
            style={{ background: tier.bg, color: tier.color, borderColor: tier.color + "44" }}
          >
            <span>{tier.icon}</span>
            <span>{tier.name}</span>
          </div>
        </div>

        {/* Tier progress */}
        <div className="tier-progress-card">
          <div className="tier-progress-header">
            <div className="tier-progress-current" style={{ color: tier.color }}>
              <span className="tier-icon">{tier.icon}</span>
              <span className="tier-name">{tier.name}</span>
            </div>
            {nextTier ? (
              <div className="tier-progress-next" style={{ color: nextTier.color }}>
                <span className="tier-icon">{nextTier.icon}</span>
                <span className="tier-name">{nextTier.name}</span>
              </div>
            ) : (
              <span className="tier-max-label">🎉 Max Tier!</span>
            )}
          </div>
          <div className="tier-progress-bar">
            <div
              className="tier-progress-fill"
              style={{ width: `${tierProgress}%`, background: tier.color }}
            />
          </div>
          {nextTier ? (
            <p className="tier-progress-hint">
              <strong>{nextTier.min - totalTokens}</strong> more tokens to reach{" "}
              <span style={{ color: nextTier.color }}>{nextTier.name}</span>
            </p>
          ) : (
            <p className="tier-progress-hint">You've reached the highest tier. Amazing! 🏆</p>
          )}
        </div>
      </div>

      {/* ── How tokens are earned ── */}
      <div className="token-formula-card">
        <h3 className="token-formula-title"><Zap size={16} /> How you earn tokens</h3>
        <div className="token-formula-grid">
          <div className="token-formula-item">
            <span className="tf-label">Complete a session</span>
            <span className="tf-value">+10 base</span>
          </div>
          <div className="token-formula-item">
            <span className="tf-label">Score bonus (per 10%)</span>
            <span className="tf-value">+1 each</span>
          </div>
          <div className="token-formula-item">
            <span className="tf-label">Good performance (60%+)</span>
            <span className="tf-value tf-green">+3</span>
          </div>
          <div className="token-formula-item">
            <span className="tf-label">Excellent performance (80%+)</span>
            <span className="tf-value tf-accent">+5</span>
          </div>
          <div className="token-formula-item tf-max">
            <span className="tf-label">Max per session</span>
            <span className="tf-value">25 tokens</span>
          </div>
        </div>
      </div>

      {/* ── Stats + Badges grid ── */}
      <div className="account-grid">
        {/* Stats */}
        <div className="account-card">
          <h2 className="account-card-title"><BarChart3 size={18} /> Your Stats</h2>
          <div className="stats-list">
            <div className="stats-list-item">
              <span className="sl-label"><CheckCircle2 size={15} /> Interviews</span>
              <span className="sl-value">{history.length}</span>
            </div>
            <div className="stats-list-item">
              <span className="sl-label"><TrendingUp size={15} /> Avg Score</span>
              <span className="sl-value" style={{ color: getPerformanceLabel(avgScore).color }}>
                {avgScore}%
              </span>
            </div>
            <div className="stats-list-item">
              <span className="sl-label"><Trophy size={15} /> Best Score</span>
              <span className="sl-value" style={{ color: getPerformanceLabel(bestScore).color }}>
                {bestScore}%
              </span>
            </div>
            <div className="stats-list-item">
              <span className="sl-label"><Coins size={15} /> Tokens</span>
              <span className="sl-value" style={{ color: "var(--accent)" }}>{totalTokens}</span>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="account-card">
          <h2 className="account-card-title"><Award size={18} /> Badges</h2>
          {badges.length === 0 ? (
            <div className="badges-empty">
              <p>Complete interviews to earn badges!</p>
              <Button size="sm" onClick={() => navigate("/interview/setup")}>Start an Interview</Button>
            </div>
          ) : (
            <div className="badges-grid">
              {badges.map((b) => (
                <div key={b.label} className="badge-item" title={b.desc}>
                  <span className="badge-item-icon">{b.icon}</span>
                  <span className="badge-item-label">{b.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Token history ── */}
      <div className="token-history-card">
        <h2 className="account-card-title"><Clock size={18} /> Token History</h2>
        {ledger.length === 0 ? (
          <div className="token-history-empty">
            <Coins size={36} style={{ color: "var(--text-muted)" }} />
            <p>No tokens yet. Complete a mock interview to start earning!</p>
            <Button onClick={() => navigate("/interview/setup")} icon={<Target size={16} />}>
              Start Interview
            </Button>
          </div>
        ) : (
          <div className="token-history-table-wrap">
            <table className="token-history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Role</th>
                  <th>Score</th>
                  <th>Tokens Earned</th>
                </tr>
              </thead>
              <tbody>
                {ledger.map((entry) => {
                  const perf = getPerformanceLabel(entry.score);
                  return (
                    <tr key={entry.id}>
                      <td>{formatDate(entry.earnedAt)}</td>
                      <td><span className="th-role">{entry.role}</span></td>
                      <td>
                        <span className="th-score" style={{ color: perf.color }}>
                          {entry.score}%
                        </span>
                      </td>
                      <td>
                        <span className="th-tokens">
                          <Coins size={13} />
                          +{entry.amount}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
