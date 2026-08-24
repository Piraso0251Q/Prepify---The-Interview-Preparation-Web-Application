import "./Input.css";
import { forwardRef } from "react";

export const Input = forwardRef(({
  label,
  error,
  hint,
  icon,
  iconRight,
  type = "text",
  className = "",
  id,
  required,
  ...rest
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).slice(2)}`;
  return (
    <div className={`input-group ${error ? "input-error" : ""} ${className}`}>
      {label && (
        <label className="input-label" htmlFor={inputId}>
          {label}{required && <span className="input-required" aria-hidden="true"> *</span>}
        </label>
      )}
      <div className="input-wrapper">
        {icon && <span className="input-icon-left">{icon}</span>}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`input-field ${icon ? "with-icon-left" : ""} ${iconRight ? "with-icon-right" : ""}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          required={required}
          {...rest}
        />
        {iconRight && <span className="input-icon-right">{iconRight}</span>}
      </div>
      {error  && <p className="input-message input-message-error"  id={`${inputId}-error`}>{error}</p>}
      {hint && !error && <p className="input-message input-message-hint" id={`${inputId}-hint`}>{hint}</p>}
    </div>
  );
});

Input.displayName = "Input";

export const Textarea = forwardRef(({ label, error, hint, className = "", id, required, rows = 5, ...rest }, ref) => {
  const inputId = id || `textarea-${Math.random().toString(36).slice(2)}`;
  return (
    <div className={`input-group ${error ? "input-error" : ""} ${className}`}>
      {label && (
        <label className="input-label" htmlFor={inputId}>
          {label}{required && <span className="input-required"> *</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        className="input-field input-textarea"
        aria-invalid={!!error}
        required={required}
        {...rest}
      />
      {error && <p className="input-message input-message-error">{error}</p>}
      {hint && !error && <p className="input-message input-message-hint">{hint}</p>}
    </div>
  );
});

Textarea.displayName = "Textarea";

export const Select = forwardRef(({ label, error, options = [], className = "", id, required, ...rest }, ref) => {
  const inputId = id || `select-${Math.random().toString(36).slice(2)}`;
  return (
    <div className={`input-group ${error ? "input-error" : ""} ${className}`}>
      {label && (
        <label className="input-label" htmlFor={inputId}>
          {label}{required && <span className="input-required"> *</span>}
        </label>
      )}
      <select ref={ref} id={inputId} className="input-field input-select" required={required} {...rest}>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="input-message input-message-error">{error}</p>}
    </div>
  );
});

Select.displayName = "Select";
