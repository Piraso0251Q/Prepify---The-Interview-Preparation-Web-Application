import { Menu, Bell } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ThemeToggle } from "../ThemeToggle";
import { UserMenu } from "../UserMenu";
import "./Navbar.css";

export const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="navbar" role="banner">
      <div className="navbar-left">
        <button className="navbar-menu-btn" onClick={onMenuClick} aria-label="Toggle navigation">
          <Menu size={20} />
        </button>
        <div className="navbar-logo">
          <div className="navbar-logo-icon">P</div>
          <span className="navbar-logo-text">Prepify</span>
        </div>
      </div>

      <div className="navbar-right">
        <ThemeToggle />
        {user && <UserMenu user={user} />}
      </div>
    </header>
  );
};
