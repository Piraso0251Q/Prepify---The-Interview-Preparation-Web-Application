import "./QuestionNavigator.css";

export const QuestionNavigator = ({ questions, answers, currentIndex, onSelect }) => (
  <div className="qnav" aria-label="Question navigator">
    <p className="qnav-label">Questions</p>
    <div className="qnav-dots">
      {questions.map((q, i) => {
        const answered = !!answers[q.id]?.trim();
        const current  = i === currentIndex;
        return (
          <button
            key={q.id}
            className={`qnav-dot ${current ? "qnav-current" : ""} ${answered && !current ? "qnav-answered" : ""}`}
            onClick={() => onSelect(i)}
            aria-label={`Question ${i + 1}${answered ? " (answered)" : ""}${current ? " (current)" : ""}`}
            aria-current={current ? "step" : undefined}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  </div>
);
