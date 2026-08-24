import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, ShieldCheck, ChevronDown, Coins } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTokens } from "../hooks/useTokens";
import "./UserMenu.css";

export const UserMenu = ({ user }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { logout } = useAuth();
  const { totalTokens } = useTokens();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
  };

  return (
    <div className="user-menu" ref={ref}>
      <button className="user-menu-trigger" onClick={() => setOpen(p => !p)} aria-expanded={open} aria-haspopup="menu">
        <div className="user-avatar">{user.avatar || user.name?.slice(0,2).toUpperCase()}</div>
        <span className="user-name">{user.name.split(" ")[0]}</span>
        <ChevronDown size={14} className={`user-chevron ${open ? "user-chevron-open" : ""}`} />
      </button>

      {open && (
        <div className="user-dropdown animate-fade-slide-down" role="menu">
          <div className="user-dropdown-header">
            <div className="user-avatar user-avatar-lg">{user.avatar || user.name?.slice(0,2).toUpperCase()}</div>
            <div>
              <p className="user-dropdown-name">{user.name}</p>
              <p className="user-dropdown-email">{user.email}</p>
            </div>
          </div>
          <div className="user-token-row">
            <Coins size={13} />
            <span>{totalTokens} tokens</span>
          </div>
          <div className="user-dropdown-divider" />
          <button className="user-dropdown-item" role="menuitem" onClick={() => { navigate("/account"); setOpen(false); }}>
            <User size={15} /> My Account
          </button>
          {user.isAdmin && (
            <button className="user-dropdown-item" role="menuitem" onClick={() => { navigate("/admin"); setOpen(false); }}>
              <ShieldCheck size={15} /> Admin Portal
            </button>
          )}
          <button className="user-dropdown-item user-dropdown-item-danger" role="menuitem" onClick={handleLogout}>
            <LogOut size={15} /> Sign out
          </button>
        </div>
      )}
    </div>
  );
};

