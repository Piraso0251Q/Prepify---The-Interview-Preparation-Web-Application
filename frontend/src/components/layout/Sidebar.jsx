import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, BookOpen, Play, Clock, ShieldCheck, X, User, Coins } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTokens } from "../../hooks/useTokens";
import "./Sidebar.css";

const NAV_ITEMS = [
  { to: "/dashboard",       label: "Dashboard",        icon: <LayoutDashboard size={18} /> },
  { to: "/questions",       label: "Question Bank",    icon: <BookOpen size={18} /> },
  { to: "/interview/setup", label: "Mock Interview",   icon: <Play size={18} /> },
  { to: "/history",         label: "Interview History",icon: <Clock size={18} /> },
  { to: "/account",         label: "Account",          icon: <User size={18} /> },
];


export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { totalTokens } = useTokens();

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} aria-hidden="true" />}
      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`} aria-label="Main navigation">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">P</div>
            <span className="sidebar-logo-text">Prepify</span>
          </div>
          <button className="sidebar-close" onClick={onClose} aria-label="Close navigation">
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <p className="sidebar-nav-label">Menu</p>
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link-active" : ""}`}
              onClick={onClose}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              <span className="sidebar-link-label">{item.label}</span>
            </NavLink>
          ))}

          {user?.isAdmin && (
            <>
              <p className="sidebar-nav-label sidebar-nav-label-admin">Admin</p>
              <NavLink
                to="/admin"
                className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link-active" : ""}`}
                onClick={onClose}
              >
                <span className="sidebar-link-icon"><ShieldCheck size={18} /></span>
                <span className="sidebar-link-label">Admin Portal</span>
              </NavLink>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-role-chip">
            <span className="sidebar-role-dot" />
            <span>{user?.role || "Select Role"}</span>
          </div>
          <div className="sidebar-token-chip">
            <Coins size={13} />
            <span>{totalTokens} tokens</span>
          </div>
        </div>
      </aside>
    </>
  );
};
