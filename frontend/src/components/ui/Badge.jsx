import "./Badge.css";

export const DifficultyBadge = ({ difficulty }) => (
  <span className={`badge badge-difficulty badge-${difficulty?.toLowerCase()}`}>
    {difficulty}
  </span>
);

export const TopicBadge = ({ topic }) => (
  <span className="badge badge-topic">{topic}</span>
);

export const RoleBadge = ({ role }) => (
  <span className="badge badge-role">{role}</span>
);

export const StatusBadge = ({ status }) => (
  <span className={`badge badge-status badge-status-${status?.toLowerCase().replace(/\s+/g, "-")}`}>
    {status}
  </span>
);
