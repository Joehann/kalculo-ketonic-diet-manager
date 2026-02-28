import {
  InvalidChildFirstNameError,
  InvalidDietProtocolError,
} from './errors/ChildProfileError'

export const ALLOWED_DIET_PROTOCOLS = ['ketogenic', 'modified-atkins'] as const

export type DietProtocol = (typeof ALLOWED_DIET_PROTOCOLS)[number]

export type ChildProfile = {
  id: string
  parentId: string
  firstName: string
  protocol: DietProtocol
  createdAt: Date
  updatedAt: Date
}

type CreateChildProfileInput = {
  parentId: string
  firstName: string
  protocol: DietProtocol
}

type UpdateChildProfileInput = {
  firstName: string
  protocol: DietProtocol
}

export const createChildProfile = ({
  parentId,
  firstName,
  protocol,
}: CreateChildProfileInput): ChildProfile => {
  assertValidParentId(parentId)
  assertValidFirstName(firstName)
  assertValidProtocol(protocol)

  const now = new Date()

  return {
    id: `child-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    parentId,
    firstName: normalizeFirstName(firstName),
    protocol,
    createdAt: now,
    updatedAt: now,
  }
}

export const updateChildProfile = (
  current: ChildProfile,
  input: UpdateChildProfileInput,
): ChildProfile => {
  assertValidFirstName(input.firstName)
  assertValidProtocol(input.protocol)

  return {
    ...current,
    firstName: normalizeFirstName(input.firstName),
    protocol: input.protocol,
    updatedAt: new Date(),
  }
}

export const isDietProtocol = (value: string): value is DietProtocol => {
  return ALLOWED_DIET_PROTOCOLS.includes(value as DietProtocol)
}

const assertValidParentId = (parentId: string): void => {
  if (!parentId || parentId.trim().length === 0) {
    throw new Error('Parent ID cannot be empty')
  }
}

const assertValidFirstName = (firstName: string): void => {
  const normalized = normalizeFirstName(firstName)

  if (!normalized) {
    throw new InvalidChildFirstNameError('Le prenom de l\'enfant est requis')
  }

  if (normalized.length > 50) {
    throw new InvalidChildFirstNameError(
      'Le prenom de l\'enfant ne peut pas depasser 50 caracteres',
    )
  }
}

const assertValidProtocol = (protocol: string): void => {
  if (!isDietProtocol(protocol)) {
    throw new InvalidDietProtocolError(
      'Protocole invalide. Valeurs autorisees: ketogenic, modified-atkins',
    )
  }
}

const normalizeFirstName = (firstName: string): string => {
  return firstName.trim()
}
