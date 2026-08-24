import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import "./ThemeToggle.css";

const ICONS = { light: <Sun size={16} />, dark: <Moon size={16} />, system: <Monitor size={16} /> };
const LABELS = { light: "Light", dark: "Dark", system: "System" };

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Current theme: ${LABELS[theme]}. Click to switch.`}
      title={`Theme: ${LABELS[theme]}`}
    >
      <span className="theme-toggle-icon">{ICONS[theme]}</span>
      <span className="theme-toggle-label">{LABELS[theme]}</span>
    </button>
  );
};
