import type { HTMLAttributes, ReactNode } from 'react'
import './Card.css'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export const Card = ({ className = '', ...props }: CardProps) => {
  return <div className={`card ${className}`} {...props} />
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export const CardHeader = ({ className = '', ...props }: CardHeaderProps) => {
  return <div className={`card__header ${className}`} {...props} />
}

interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export const CardBody = ({ className = '', ...props }: CardBodyProps) => {
  return <div className={`card__body ${className}`} {...props} />
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export const CardFooter = ({ className = '', ...props }: CardFooterProps) => {
  return <div className={`card__footer ${className}`} {...props} />
}
