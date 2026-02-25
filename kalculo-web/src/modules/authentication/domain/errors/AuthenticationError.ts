export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthenticationError'
  }
}

export class InvalidEmailError extends AuthenticationError {}
export class InvalidPasswordError extends AuthenticationError {}
export class DuplicateEmailError extends AuthenticationError {}
export class InvalidCredentialsError extends AuthenticationError {}
export class SessionExpiredError extends AuthenticationError {}
