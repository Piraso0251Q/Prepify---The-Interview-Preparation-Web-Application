import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Clock, Target, Shuffle, ChevronRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useInterview } from "../context/InterviewContext";
import { questionsAPI } from "../utils/api";
import { Button } from "../components/ui/Button";
import { DifficultyBadge, TopicBadge } from "../components/ui/Badge";
import "./MockInterviewSetupPage.css";

const ROLES = ["Frontend", "Backend", "Full-Stack", "SDE-1", "QA"];
const ROLE_ICONS = { Frontend: "⚛️", Backend: "⚙️", "Full-Stack": "🔗", "SDE-1": "💡", QA: "🧪" };

export default function MockInterviewSetupPage() {
  const { selectedRole, setSelectedRole } = useAuth();
  const { startInterview } = useInterview();
  const navigate = useNavigate();
  const [previewQuestions, setPreviewQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch 5 brand new unique questions from the backend (powered secretly by AI)
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const data = await questionsAPI.generate(selectedRole);
      if (data.success) {
        setPreviewQuestions(data.questions);
      }
      setLoading(false);
    };
    fetch();
  }, [selectedRole]);

  const handleStart = () => {
    startInterview(previewQuestions, selectedRole);
    navigate("/interview/active");
  };

  return (
    <div className="setup page-enter">
      <div className="setup-header">
        <h1 className="setup-title">Mock Interview Setup</h1>
        <p className="setup-subtitle">Configure and start your timed technical interview</p>
      </div>

      <div className="setup-grid">
        {/* Left: Config */}
        <div className="setup-config">
          <div className="setup-card">
            <h2 className="setup-card-title">Interview Configuration</h2>
            <div className="setup-info-grid">
              <div className="setup-info-item">
                <Clock size={18} /> <div><span>Duration</span><strong>10 minutes</strong></div>
              </div>
              <div className="setup-info-item">
                <Target size={18} /> <div><span>Questions</span><strong>10 questions</strong></div>
              </div>
              <div className="setup-info-item">
                <Shuffle size={18} /> <div><span>Difficulty</span><strong>Mixed levels</strong></div>
              </div>
            </div>
          </div>

          <div className="setup-card">
            <h2 className="setup-card-title">Select Role</h2>
            <div className="setup-roles">
              {ROLES.map(role => (
                <button
                  key={role}
                  className={`setup-role-btn ${selectedRole === role ? "active" : ""}`}
                  onClick={() => setSelectedRole(role)}
                  aria-pressed={selectedRole === role}
                >
                  <span className="setup-role-icon">{ROLE_ICONS[role]}</span>
                  <span>{role}</span>
                  {selectedRole === role && <ChevronRight size={14} />}
                </button>
              ))}
            </div>
          </div>

          <Button size="lg" fullWidth icon={<Play size={18} />} onClick={handleStart} loading={loading}>
            Start Interview — {selectedRole}
          </Button>

          <p className="setup-disclaimer">
            ⚠️ The interview timer will start immediately. You cannot pause.
          </p>
        </div>

        {/* Right: Preview */}
        <div className="setup-preview">
          <div className="setup-card">
            <h2 className="setup-card-title">
              Question Preview
              <span className="setup-preview-note">10 unique questions are being prepared</span>
            </h2>
            <div className="setup-preview-list">
              {loading ? (
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Loading questions...</p>
              ) : (
                previewQuestions.map((q, i) => (
                  <div key={q._id} className="setup-preview-item">
                    <span className="setup-preview-num">{i + 1}</span>
                    <div className="setup-preview-content">
                      <p className="setup-preview-title">{q.title}</p>
                      <div className="setup-preview-badges">
                        <DifficultyBadge difficulty={q.difficulty} />
                        <TopicBadge topic={q.topic} />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <p className="setup-preview-disclaimer">* Actual questions may differ from this preview</p>
          </div>
        </div>
      </div>
    </div>
  );
}
