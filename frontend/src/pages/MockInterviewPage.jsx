import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Send, AlertTriangle } from "lucide-react";
import { useInterview } from "../context/InterviewContext";
import { useTimer } from "../hooks/useTimer";
import { InterviewTimer } from "../components/InterviewTimer";
import { QuestionNavigator } from "../components/QuestionNavigator";
import { DifficultyBadge, TopicBadge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import "./MockInterviewPage.css";

const DURATION = 10 * 60; // 10 min

export default function MockInterviewPage() {
  const navigate = useNavigate();
  const {
    questions, answers, currentIndex, role,
    setAnswer, setCurrentIndex, submitInterview, submitted,
  } = useInterview();
  const [showConfirm, setShowConfirm] = useState(false);
  const [autoSubmit, setAutoSubmit] = useState(false);

  const [saveMessage, setSaveMessage] = useState("");

  const handleExpire = () => {
    setAutoSubmit(true);
    doSubmit();
  };

  const { seconds, isWarning, isDanger, start } = useTimer(DURATION, handleExpire);

  useEffect(() => {
    if (!questions.length) { navigate("/interview/setup"); return; }
    start();
  }, []);

  if (!questions.length) return null;

  const currentQuestion = questions[currentIndex];
  // Helper to safely get the correct ID since MongoDB uses _id
  const qId = currentQuestion._id || currentQuestion.id;
  const answeredCount = Object.values(answers).filter(a => a?.trim()).length;

  const doSubmit = () => {
    submitInterview();
    navigate("/results/new");
    setShowConfirm(false);
  };

  const handleSave = () => {
    setSaveMessage("✓ Saved");
    setTimeout(() => setSaveMessage(""), 2000);
  };

  return (
    <div className="interview-page">
      {/* Top Bar */}
      <div className="interview-topbar">
        <div className="interview-topbar-left">
          <div className="interview-session-info">
            <span className="interview-role-badge">{role}</span>
            <span className="interview-progress">{answeredCount}/{questions.length} answered</span>
          </div>
        </div>
        <InterviewTimer seconds={seconds} isWarning={isWarning} isDanger={isDanger} />
        <Button
          variant="primary"
          size="sm"
          icon={<Send size={15} />}
          onClick={() => setShowConfirm(true)}
          id="submit-interview-btn"
        >
          Submit
        </Button>
      </div>

      <div className="interview-body">
        {/* Sidebar nav */}
        <aside className="interview-sidebar">
          <QuestionNavigator
            questions={questions}
            answers={answers}
            currentIndex={currentIndex}
            onSelect={setCurrentIndex}
          />
        </aside>

        {/* Main content */}
        <div className="interview-main">
          <div className="interview-question-header">
            <span className="interview-qnum">Question {currentIndex + 1} of {questions.length}</span>
            <div style={{ display: "flex", gap: 8 }}>
              <DifficultyBadge difficulty={currentQuestion.difficulty} />
              <TopicBadge topic={currentQuestion.topic} />
            </div>
          </div>

          <h2 className="interview-question-title">{currentQuestion.title}</h2>
          <p className="interview-question-desc">{currentQuestion.description}</p>

          <div className="interview-editor-wrap">
            <div className="interview-editor-header">
              <span>Your Answer</span>
              <span className="interview-char-count">
                {(answers[qId] || "").length} chars
              </span>
            </div>
            <textarea
              className="interview-editor"
              value={answers[qId] || ""}
              onChange={(e) => setAnswer(qId, e.target.value)}
              placeholder="Type your answer here... Explain your understanding clearly and use key technical terms."
              aria-label="Your answer"
              rows={14}
            />
          </div>

          {/* Navigation */}
          <div className="interview-nav-btns">
            <Button
              variant="secondary"
              icon={<ArrowLeft size={16} />}
              onClick={() => setCurrentIndex(currentIndex - 1)}
              disabled={currentIndex === 0}
            >
              Previous
            </Button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Button variant="outline" onClick={handleSave}>
                Save Answer
              </Button>
              <span style={{ color: '#10b981', fontSize: '14px', width: '60px', opacity: saveMessage ? 1 : 0, transition: 'opacity 0.2s' }}>
                {saveMessage}
              </span>
            </div>

            <Button
              variant="secondary"
              iconRight={<ArrowRight size={16} />}
              onClick={() => setCurrentIndex(currentIndex + 1)}
              disabled={currentIndex === questions.length - 1}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Submit confirmation modal */}
      <Modal
        isOpen={showConfirm || autoSubmit}
        onClose={() => !autoSubmit && setShowConfirm(false)}
        title={autoSubmit ? "Time's Up!" : "Submit Interview?"}
        size="sm"
        closeOnBackdrop={!autoSubmit}
        footer={
          <Button fullWidth onClick={doSubmit} icon={<Send size={15} />}>
            {autoSubmit ? "View Results" : "Submit & View Results"}
          </Button>
        }
      >
        <div className="submit-modal-body">
          {autoSubmit ? (
            <>
              <AlertTriangle size={40} className="submit-modal-icon warning" />
              <p>Time has expired. Your answers have been recorded automatically.</p>
            </>
          ) : (
            <>
              <div className="submit-modal-stats">
                <div>
                  <strong>{answeredCount}</strong>
                  <span>Answered</span>
                </div>
                <div>
                  <strong>{questions.length - answeredCount}</strong>
                  <span>Unanswered</span>
                </div>
              </div>
              <p>Are you sure you want to submit? You cannot go back after submission.</p>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
