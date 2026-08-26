import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import "./Auth.css";

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const e = {};
    if (!form.name.trim())               e.name    = "Full name is required.";
    if (!form.email.trim())              e.email   = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.password)                  e.password = "Password is required.";
    else if (form.password.length < 6)   e.password = "Password must be at least 6 characters.";
    if (form.confirm !== form.password)  e.confirm  = "Passwords do not match.";
    return e;
  };

  const handle = (k) => (e) => { setForm(p => ({ ...p, [k]: e.target.value })); setErrors(p => ({ ...p, [k]: "" })); setServerError(""); };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    const result = await signup(form.name, form.email, form.password);
    setLoading(false);
    if (result.success) navigate("/dashboard");
    else setServerError(result.error);
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-scale-in">
        <div className="auth-logo">
          <div className="auth-logo-icon">P</div>
          <span className="auth-logo-text">Prepify</span>
        </div>
        <div className="auth-header">
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">Start mastering your technical interviews today</p>
        </div>

        {serverError && <div className="auth-alert" role="alert">{serverError}</div>}

        <form onSubmit={submit} className="auth-form" noValidate>
          <Input label="Full name" type="text" id="signup-name" value={form.name} onChange={handle("name")} error={errors.name} icon={<User size={16} />} placeholder="Alex Chen" autoComplete="name" required />
          <Input label="Email address" type="email" id="signup-email" value={form.email} onChange={handle("email")} error={errors.email} icon={<Mail size={16} />} placeholder="you@example.com" autoComplete="email" required />
          <Input
            label="Password"
            type={showPw ? "text" : "password"}
            id="signup-password"
            value={form.password}
            onChange={handle("password")}
            error={errors.password}
            icon={<Lock size={16} />}
            iconRight={
              <button type="button" onClick={() => setShowPw(p => !p)} style={{ cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center" }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            placeholder="Min. 6 characters"
            autoComplete="new-password"
            required
          />
          <Input label="Confirm password" type={showPw ? "text" : "password"} id="signup-confirm" value={form.confirm} onChange={handle("confirm")} error={errors.confirm} icon={<Lock size={16} />} placeholder="••••••••" autoComplete="new-password" required />

          <Button type="submit" fullWidth loading={loading} size="lg">
            Create Account
          </Button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">Sign in →</Link>
        </p>
      </div>
    </div>
  );
}
