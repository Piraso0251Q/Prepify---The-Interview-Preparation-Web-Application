import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Play,
  BarChart3,
  Zap,
  Trophy,
  Target,
  Brain,
  Star,
  ChevronRight,
  ArrowRight,
  Code2,
  Layers,
  Shield,
} from "lucide-react";
import "./LandingPage.css";

const FEATURES = [
  {
    icon: <BookOpen size={24} />,
    title: "Curated Question Bank",
    desc: "60+ role-specific technical questions across Frontend, Backend, Full-Stack, SDE-1, and QA tracks — handpicked by senior engineers.",
    color: "var(--accent)",
    bg: "rgba(99,102,241,0.1)",
  },
  {
    icon: <Play size={24} />,
    title: "Timed Mock Interviews",
    desc: "Simulate real interview pressure with configurable 5-question sessions. Sharpen your thinking and beat the clock.",
    color: "var(--success)",
    bg: "rgba(16,185,129,0.1)",
  },
  {
    icon: <Brain size={24} />,
    title: "AI-Powered Feedback",
    desc: "Get instant, detailed scoring on correctness, clarity, and depth. Understand exactly where you stand after every attempt.",
    color: "var(--warning)",
    bg: "rgba(245,158,11,0.1)",
  },
  {
    icon: <BarChart3 size={24} />,
    title: "Progress Analytics",
    desc: "Track your improvement over time. See score trends, identify weak spots, and celebrate milestones.",
    color: "var(--info)",
    bg: "rgba(59,130,246,0.1)",
  },
  {
    icon: <Target size={24} />,
    title: "Role-Based Targeting",
    desc: "Filter content by your target role. Practice exactly what you'll face in your next interview.",
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.1)",
  },
  {
    icon: <Shield size={24} />,
    title: "Bookmark & Review",
    desc: "Save tricky questions for later review. Build your personal question set and revisit them anytime.",
    color: "var(--danger)",
    bg: "rgba(239,68,68,0.1)",
  },
];

const STATS = [
  { value: "60+",  label: "Curated Questions",    icon: <Code2 size={20} /> },
  { value: "5",    label: "Role Tracks",           icon: <Layers size={20} /> },
  { value: "100%", label: "Free to Use",           icon: <Star size={20} /> },
  { value: "∞",    label: "Practice Sessions",     icon: <Zap size={20} /> },
];

const TESTIMONIALS = [
  {
    name: "Aisha R.",
    role: "Frontend Developer",
    company: "Hired at TechCorp",
    avatar: "A",
    color: "var(--accent)",
    text: "Prepify's timed mock interviews were a game-changer. After 2 weeks of daily practice, I aced my frontend rounds with confidence I never had before.",
  },
  {
    name: "Marcus L.",
    role: "SDE-1 Candidate",
    company: "Hired at StartupX",
    avatar: "M",
    color: "var(--success)",
    text: "The AI feedback is incredibly detailed. I went from scoring 45% to 90% in under a month. The role-specific questions matched exactly what I was asked.",
  },
  {
    name: "Priya K.",
    role: "Full-Stack Engineer",
    company: "Hired at BigTech",
    avatar: "P",
    color: "var(--warning)",
    text: "I loved being able to bookmark tough questions and revisit them. The progress tracking kept me motivated when I felt like giving up.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Choose Your Role",
    desc: "Select your target engineering role — Frontend, Backend, Full-Stack, SDE-1, or QA.",
    icon: <Target size={22} />,
  },
  {
    step: "02",
    title: "Practice Questions",
    desc: "Browse and answer questions from the curated bank, or dive into a timed mock interview.",
    icon: <BookOpen size={22} />,
  },
  {
    step: "03",
    title: "Get Instant Feedback",
    desc: "Receive AI-generated scores and detailed feedback on every answer you submit.",
    icon: <Brain size={22} />,
  },
  {
    step: "04",
    title: "Track & Improve",
    desc: "Review your history, spot patterns, and watch your scores climb with every session.",
    icon: <BarChart3 size={22} />,
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      {/* ── Navbar ── */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-logo">
            <div className="landing-logo-icon">P</div>
            <span className="landing-logo-text">Prepify</span>
          </div>
          <div className="landing-nav-links">
            <a href="#features" className="landing-nav-link">Features</a>
            <a href="#how-it-works" className="landing-nav-link">How it works</a>
            <a href="#testimonials" className="landing-nav-link">Testimonials</a>
          </div>
          <div className="landing-nav-actions">
            <button className="landing-nav-btn-ghost" onClick={() => navigate("/login")}>Sign in</button>
            <button className="landing-nav-btn-primary" onClick={() => navigate("/signup")}>Get started free</button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero-section">
        {/* Animated background orbs */}
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
          <div className="hero-grid" />
        </div>

        <div className="hero-inner">
          <div className="hero-badge animate-fade-in">
            <Zap size={14} />
            <span>AI-Powered Interview Preparation</span>
          </div>

          <h1 className="hero-headline animate-fade-slide-up">
            Ace Your Next<br />
            <span className="hero-gradient-text">Technical Interview</span>
          </h1>

          <p className="hero-subtext animate-fade-slide-up" style={{ animationDelay: "0.1s" }}>
            Practice with 60+ curated questions, simulate real interviews under timed conditions,
            and get instant AI feedback — all tailored to your target engineering role.
          </p>

          <div className="hero-actions animate-fade-slide-up" style={{ animationDelay: "0.2s" }}>
            <button
              id="hero-cta-primary"
              className="hero-btn-primary"
              onClick={() => navigate("/signup")}
            >
              Start Practicing Free
              <ArrowRight size={18} />
            </button>
            <button
              id="hero-cta-secondary"
              className="hero-btn-secondary"
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>
          </div>

          <div className="hero-social-proof animate-fade-in" style={{ animationDelay: "0.35s" }}>
            <div className="hero-avatars">
              {["A", "M", "P", "J", "S"].map((l, i) => (
                <div key={i} className="hero-avatar" style={{ zIndex: 5 - i }}>
                  {l}
                </div>
              ))}
            </div>
            <p className="hero-proof-text">
              <strong>500+</strong> engineers prepared with Prepify
            </p>
          </div>
        </div>

      </section>

      {/* ── Stats strip ── */}
      <section className="stats-strip">
        <div className="stats-strip-inner">
          {STATS.map((s) => (
            <div key={s.label} className="stats-strip-item">
              <span className="stats-strip-icon">{s.icon}</span>
              <span className="stats-strip-value">{s.value}</span>
              <span className="stats-strip-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="section-wrapper">
        <div className="section-label">Features</div>
        <h2 className="section-heading">Everything you need to land the offer</h2>
        <p className="section-desc">
          Prepify gives you all the tools you need to prepare thoroughly — from practice to analytics.
        </p>
        <div className="features-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon" style={{ background: f.bg, color: f.color }}>
                {f.icon}
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="section-wrapper section-alt">
        <div className="section-label">How it works</div>
        <h2 className="section-heading">Get interview-ready in 4 simple steps</h2>
        <p className="section-desc">
          A structured, focused workflow designed to maximise your prep time.
        </p>
        <div className="how-grid">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={step.step} className="how-card">
              <div className="how-step-num">{step.step}</div>
              <div className="how-icon">{step.icon}</div>
              <h3 className="how-title">{step.title}</h3>
              <p className="how-desc">{step.desc}</p>
              {i < HOW_IT_WORKS.length - 1 && (
                <div className="how-connector">
                  <ChevronRight size={20} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="section-wrapper">
        <div className="section-label">Testimonials</div>
        <h2 className="section-heading">Loved by engineers everywhere</h2>
        <p className="section-desc">
          Hear from engineers who used Prepify to land their dream jobs.
        </p>
        <div className="testimonials-grid">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="var(--warning)" color="var(--warning)" />
                ))}
              </div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar" style={{ background: t.bg || t.color + "22", color: t.color }}>
                  {t.avatar}
                </div>
                <div>
                  <p className="testimonial-name">{t.name}</p>
                  <p className="testimonial-meta">{t.role} · {t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-inner">
          <div className="cta-orb cta-orb-1" />
          <div className="cta-orb cta-orb-2" />
          <Trophy size={40} className="cta-icon" />
          <h2 className="cta-heading">Ready to get hired?</h2>
          <p className="cta-subtext">
            Join hundreds of engineers who use Prepify to prepare smarter and land offers faster.
            No credit card, no limits.
          </p>
          <div className="cta-actions">
            <button
              id="cta-get-started"
              className="hero-btn-primary"
              onClick={() => navigate("/signup")}
            >
              Get started for free
              <ArrowRight size={18} />
            </button>
            <button
              id="cta-sign-in"
              className="cta-btn-ghost"
              onClick={() => navigate("/login")}
            >
              Already have an account? Sign in
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-logo">
            <div className="landing-logo-icon">P</div>
            <span className="landing-logo-text">Prepify</span>
          </div>
          <p className="footer-copy">
            © {new Date().getFullYear()} Prepify. Built for engineers, by engineers.
          </p>
          <div className="footer-links">
            <button className="footer-link" onClick={() => navigate("/login")}>Sign In</button>
            <button className="footer-link" onClick={() => navigate("/signup")}>Sign Up</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
