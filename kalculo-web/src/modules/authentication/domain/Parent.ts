import {
  InvalidPasswordError,
  InvalidEmailError,
} from './errors/AuthenticationError'

export type Parent = {
  id: string
  email: string
  passwordHash: string
  role: 'parent'
  createdAt: Date
  updatedAt: Date
}

export type SessionToken = {
  token: string
  parentId: string
  expiresAt: Date
  createdAt: Date
}

export const createParent = (email: string, passwordHash: string): Parent => {
  if (!isValidEmail(email)) {
    throw new InvalidEmailError(`Email format is invalid: ${email}`)
  }

  if (!passwordHash || passwordHash.length === 0) {
    throw new InvalidPasswordError('Password hash cannot be empty')
  }

  return {
    id: generateId(),
    email: email.toLowerCase(),
    passwordHash,
    role: 'parent',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length > 0 && email.length <= 254
}

export const isValidPasswordFormat = (password: string): boolean => {
  return password.length >= 8 && password.length <= 128
}

export const createSessionToken = (
  parentId: string,
  expirationMinutes: number = 24 * 60,
): SessionToken => {
  const now = new Date()
  const expiresAt = new Date(now.getTime() + expirationMinutes * 60 * 1000)

  return {
    token: generateToken(),
    parentId,
    expiresAt,
    createdAt: now,
  }
}

export const isSessionValid = (session: SessionToken): boolean => {
  return session.expiresAt > new Date()
}

const generateId = (): string => {
  return `parent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

const generateToken = (): string => {
  return `token-${Date.now()}-${Math.random().toString(36).substr(2, 16)}`
}
