import { createContext, useContext, useReducer } from "react";

const InterviewContext = createContext(null);

const initialState = {
  questions: [],
  answers: {},       
  currentIndex: 0,
  startTime: null,
  submitted: false,
  role: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "START":
      return { ...initialState, questions: action.questions, role: action.role, startTime: Date.now() };
    case "SET_ANSWER":
      return { ...state, answers: { ...state.answers, [action.id]: action.answer } };
    case "SET_INDEX":
      return { ...state, currentIndex: Math.max(0, Math.min(action.index, state.questions.length - 1)) };
    case "SUBMIT":
      return { ...state, submitted: true };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

export const InterviewProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const startInterview = (questions, role) =>
    dispatch({ type: "START", questions, role });

  const setAnswer = (id, answer) =>
    dispatch({ type: "SET_ANSWER", id, answer });

  const setCurrentIndex = (index) =>
    dispatch({ type: "SET_INDEX", index });

  const submitInterview = () =>
    dispatch({ type: "SUBMIT" });

  const resetInterview = () =>
    dispatch({ type: "RESET" });

  return (
    <InterviewContext.Provider value={{
      ...state,
      startInterview,
      setAnswer,
      setCurrentIndex,
      submitInterview,
      resetInterview,
    }}>
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = () => {
  const ctx = useContext(InterviewContext);
  if (!ctx) throw new Error("useInterview must be used within InterviewProvider");
  return ctx;
};
