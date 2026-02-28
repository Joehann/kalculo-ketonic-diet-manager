export class MacroTargetsError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MacroTargetsError'
  }
}

export class InvalidMacroTargetValueError extends MacroTargetsError {}
export class MacroTargetsNotConfiguredError extends MacroTargetsError {}
