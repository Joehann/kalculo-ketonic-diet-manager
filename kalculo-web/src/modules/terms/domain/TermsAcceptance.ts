export type TermsAcceptance = {
  parentId: string
  acceptedAt: Date
  termsVersion: string
}

export type Terms = {
  version: string
  text: string
}

export const createTermsAcceptance = (
  parentId: string,
  termsVersion: string,
): TermsAcceptance => {
  if (!parentId || parentId.trim().length === 0) {
    throw new Error('Parent ID cannot be empty')
  }

  if (!termsVersion || termsVersion.trim().length === 0) {
    throw new Error('Terms version cannot be empty')
  }

  return {
    parentId,
    acceptedAt: new Date(),
    termsVersion,
  }
}

export const isTermsVersionValid = (version: string): boolean => {
  // Simple semantic versioning validation: "1.0", "1.1", etc.
  return /^\d+\.\d+$/.test(version)
}
