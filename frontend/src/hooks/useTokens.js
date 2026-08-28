 

import { useState } from "react";
import { storage, STORAGE_KEYS } from "../utils/storage";

export const calcTokensForScore = (score) => {
  const base = 10;
  const scoreBonus = Math.floor(score / 10);
  const perfBonus = score >= 80 ? 5 : score >= 60 ? 3 : 0;
  return Math.min(base + scoreBonus + perfBonus, 25);
};

export const useTokens = () => {
  const [ledger, setLedger] = useState(() =>
    storage.get(STORAGE_KEYS.TOKENS, [])
  );

  /** Award tokens for a completed interview */
  const awardTokens = (interviewId, score, role) => {
    // Prevent double-awarding for the same interview
    if (ledger.some((e) => e.interviewId === interviewId)) return;
    const amount = calcTokensForScore(score);
    const entry = {
      id: `token-${Date.now()}`,
      interviewId,
      amount,
      score,
      role,
      reason: `Completed ${role} interview (score: ${score}%)`,
      earnedAt: new Date().toISOString(),
    };
    setLedger((prev) => {
      const next = [entry, ...prev];
      storage.set(STORAGE_KEYS.TOKENS, next);
      return next;
    });
  };

  const totalTokens = ledger.reduce((sum, e) => sum + e.amount, 0);

  return { ledger, totalTokens, awardTokens };
};
