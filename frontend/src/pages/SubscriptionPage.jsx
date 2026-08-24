import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Check, ArrowLeft, Zap, Star, Crown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./SubscriptionPage.css";

const PLANS = [
  {
    id: "monthly",
    icon: <Zap size={22} />,
    name: "Monthly",
    desc: "Full admin access, billed every month. Cancel anytime.",
    currency: "₹",
    amount: "999",
    period: "/ month",
    saving: null,
    ribbon: null,
    features: [
      "Unlimited question management",
      "Add, edit & delete questions",
      "Role & difficulty filtering",
      "Admin analytics dashboard",
      "Priority email support",
    ],
    highlight: false,
  },
  {
    id: "quarterly",
    icon: <Star size={22} />,
    name: "Quarterly",
    desc: "3 months of admin access at a discounted rate.",
    currency: "₹",
    amount: "2,499",
    period: "/ 3 months",
    saving: "Save ₹498 vs monthly",
    ribbon: null,
    features: [
      "Everything in Monthly",
      "Bulk question import (CSV)",
      "Advanced usage analytics",
      "Team collaboration (2 seats)",
      "Dedicated chat support",
    ],
    highlight: true,
  },
  {
    id: "yearly",
    icon: <Crown size={22} />,
    name: "Yearly",
    desc: "Best value. Unlock the full admin experience for a year.",
    currency: "₹",
    amount: "7,999",
    period: "/ year",
    saving: "Save ₹3,989 vs monthly",
    ribbon: "🔥 Best Value",
    features: [
      "Everything in Quarterly",
      "Unlimited team seats",
      "White-label export",
      "API access",
      "SLA-backed 24/7 support",
    ],
    highlight: false,
  },
];

export default function SubscriptionPage() {
  const { subscribe, subscription } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (planId) => {
    setSelected(planId);
    setLoading(true);
    // Simulate payment processing
    await new Promise(r => setTimeout(r, 1200));
    subscribe(planId);
    setLoading(false);
    navigate("/admin");
  };

  return (
    <div className="sub-page">
      <button className="sub-back" onClick={() => navigate("/dashboard")} aria-label="Back to dashboard">
        <ArrowLeft size={15} />
        Back to dashboard
      </button>

      <div className="sub-badge">
        <ShieldCheck size={13} />
        Admin Access Required
      </div>

      <h1 className="sub-heading">Choose Your Admin Plan</h1>
      <p className="sub-subheading">
        Unlock the Prepify Admin Portal to manage questions, track usage, and shape
        the interview experience for your entire team.
      </p>

      <div className="sub-cards">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`sub-card${selected === plan.id ? " selected" : ""}`}
            onClick={() => !loading && setSelected(plan.id)}
            role="button"
            tabIndex={0}
            aria-pressed={selected === plan.id}
            aria-label={`${plan.name} plan`}
            onKeyDown={(e) => e.key === "Enter" && !loading && setSelected(plan.id)}
          >
            {plan.ribbon && <div className="sub-ribbon">{plan.ribbon}</div>}

            <div className="sub-plan-icon">{plan.icon}</div>
            <div className="sub-plan-name">{plan.name}</div>
            <div className="sub-plan-desc">{plan.desc}</div>

            <div className="sub-price-row">
              <span className="sub-currency">{plan.currency}</span>
              <span className="sub-amount">{plan.amount}</span>
              <span className="sub-period">{plan.period}</span>
            </div>

            {plan.saving ? (
              <div className="sub-saving">
                <Check size={11} />
                {plan.saving}
              </div>
            ) : (
              <div className="sub-saving-placeholder" />
            )}

            <ul className="sub-features">
              {plan.features.map((f) => (
                <li key={f} className="sub-feature">
                  <span className="sub-feature-check">
                    <Check size={11} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <button
              id={`subscribe-${plan.id}`}
              className={`sub-cta ${plan.highlight ? "highlighted" : "default"}`}
              disabled={loading}
              onClick={(e) => { e.stopPropagation(); handleSubscribe(plan.id); }}
              aria-label={`Subscribe to ${plan.name} plan`}
            >
              {loading && selected === plan.id ? (
                <>
                  <div className="sub-spinner" />
                  Processing…
                </>
              ) : (
                <>
                  <ShieldCheck size={15} />
                  Get {plan.name} Access
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="sub-footer">
        <div className="sub-footer-icons">
          <div className="sub-footer-icon">🔒</div>
          <div className="sub-footer-icon">💳</div>
          <div className="sub-footer-icon">✅</div>
        </div>
        <span>Secure mock checkout · No real charges · Cancel anytime</span>
      </div>
    </div>
  );
}
