import { formatDuration } from "../utils/formatting";
import "./InterviewTimer.css";

export const InterviewTimer = ({ seconds, isWarning, isDanger }) => {
  const label = isDanger ? "danger" : isWarning ? "warning" : "normal";

  return (
    <div className={`interview-timer timer-${label}`} role="timer" aria-live="off">
      <div className="timer-display">
        <span className="timer-time">{formatDuration(seconds)}</span>
        <span className="timer-label">remaining</span>
      </div>
      {isWarning && (
        <div className="timer-progress-wrap">
          <div
            className="timer-progress-bar"
            style={{ width: `${Math.min((seconds / 300) * 100, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
};
