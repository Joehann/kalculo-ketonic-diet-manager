import type { InputHTMLAttributes } from 'react'
import './Input.css'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = ({
  label,
  error,
  helperText,
  id,
  className = '',
  ...props
}: InputProps) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="input-wrapper">
      {label && (
        <label htmlFor={inputId} className="input__label">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`input ${error ? 'input--error' : ''} ${className}`}
        {...props}
      />
      {error && <p className="input__error">{error}</p>}
      {helperText && !error && <p className="input__helper">{helperText}</p>}
    </div>
  )
}
