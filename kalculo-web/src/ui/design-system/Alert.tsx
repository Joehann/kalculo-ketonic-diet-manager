import type { HTMLAttributes, ReactNode } from 'react'
import './Alert.css'

type AlertType = 'success' | 'error' | 'warning' | 'info'

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  type: AlertType
  children: ReactNode
  onClose?: () => void
}

export const Alert = ({
  type,
  children,
  onClose,
  className = '',
  ...props
}: AlertProps) => {
  return (
    <div className={`alert alert--${type} ${className}`} role="alert" {...props}>
      <div className="alert__content">{children}</div>
      {onClose && (
        <button
          className="alert__close"
          onClick={onClose}
          aria-label="Close alert"
        >
          ✕
        </button>
      )}
    </div>
  )
}
