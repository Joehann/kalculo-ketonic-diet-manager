export class ChildProfileError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ChildProfileError'
  }
}

export class InvalidChildFirstNameError extends ChildProfileError {}
export class InvalidDietProtocolError extends ChildProfileError {}
export class ChildProfileNotFoundError extends ChildProfileError {}
