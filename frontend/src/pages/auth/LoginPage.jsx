import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import "./Auth.css";

export default function LoginPage() {
  const { login, hasActiveSubscription } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const e = {};
    if (!form.email.trim())              e.email    = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.password)                  e.password = "Password is required.";
    return e;
  };

  const handle = (k) => (e) => { setForm(p => ({ ...p, [k]: e.target.value })); setErrors(p => ({ ...p, [k]: "" })); setServerError(""); };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = login(form.email, form.password);
    setLoading(false);
    if (result.success) {
      if (result.isAdmin) {
        // Admin must go through subscription gate; guard will skip if already subscribed
        navigate(hasActiveSubscription() ? "/admin" : "/subscription");
      } else {
        navigate("/dashboard");
      }
    } else {
      setServerError(result.error);
    }
  };

  const fillDemo  = () => setForm({ email: "alex@example.com",    password: "password123" });
  const fillAdmin = () => setForm({ email: "admin@prepify.dev",   password: "admin123"    });

  return (
    <div className="auth-page">
      <div className="auth-card animate-scale-in">
        <div className="auth-logo">
          <div className="auth-logo-icon">P</div>
          <span className="auth-logo-text">Prepify</span>
        </div>
        <div className="auth-header">
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to continue your interview prep journey</p>
        </div>

        {serverError && <div className="auth-alert" role="alert">{serverError}</div>}

        <form onSubmit={submit} className="auth-form" noValidate>
          <Input
            label="Email address"
            type="email"
            id="login-email"
            value={form.email}
            onChange={handle("email")}
            error={errors.email}
            icon={<Mail size={16} />}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
          <Input
            label="Password"
            type={showPw ? "text" : "password"}
            id="login-password"
            value={form.password}
            onChange={handle("password")}
            error={errors.password}
            icon={<Lock size={16} />}
            iconRight={
              <button type="button" onClick={() => setShowPw(p => !p)} style={{ cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center" }} aria-label={showPw ? "Hide password" : "Show password"}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />

          <Button type="submit" fullWidth loading={loading} size="lg">
            Sign In
          </Button>
        </form>

        <div className="auth-divider"><span>or try a demo account</span></div>

        <div className="auth-demos">
          <button className="demo-btn" onClick={fillDemo}  type="button">👤 User Account</button>
          <button className="demo-btn" onClick={fillAdmin} type="button">🛡 Admin Account</button>
        </div>

        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/signup" className="auth-link">Create one →</Link>
        </p>
      </div>
    </div>
  );
}
