import "./Button.css";

const VARIANTS = {
  primary:   "btn-primary",
  secondary: "btn-secondary",
  ghost:     "btn-ghost",
  danger:    "btn-danger",
  outline:   "btn-outline",
};

const SIZES = {
  sm:   "btn-sm",
  md:   "btn-md",
  lg:   "btn-lg",
};

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = "button",
  className = "",
  ...rest
}) => {
  const classes = [
    "btn",
    VARIANTS[variant] || "btn-primary",
    SIZES[size] || "btn-md",
    fullWidth ? "btn-full" : "",
    loading ? "btn-loading" : "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <span className="btn-spinner" aria-hidden="true" />
      ) : icon ? (
        <span className="btn-icon-left">{icon}</span>
      ) : null}
      {children}
      {iconRight && !loading && (
        <span className="btn-icon-right">{iconRight}</span>
      )}
    </button>
  );
};
