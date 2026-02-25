export class TermsError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'TermsError'
  }
}

export class TermsNotAcceptedError extends TermsError {}
export class InvalidTermsVersionError extends TermsError {}
export class DuplicateAcceptanceError extends TermsError {}
