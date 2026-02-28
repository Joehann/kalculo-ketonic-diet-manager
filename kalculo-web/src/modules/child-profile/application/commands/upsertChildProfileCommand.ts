import {
  createChildProfile,
  updateChildProfile,
  type ChildProfile,
  type DietProtocol,
} from '../../domain/ChildProfile'
import type { ChildProfileRepositoryPort } from '../ports/ChildProfileRepositoryPort'

export type UpsertChildProfileCommandInput = {
  parentId: string
  firstName: string
  protocol: DietProtocol
}

export type UpsertChildProfileCommand = (
  input: UpsertChildProfileCommandInput,
) => Promise<ChildProfile>

export const buildUpsertChildProfileCommand = (
  repositoryPort: ChildProfileRepositoryPort,
): UpsertChildProfileCommand => {
  return async (input) => {
    const existing = await repositoryPort.findByParentId(input.parentId)

    const profile = existing
      ? updateChildProfile(existing, {
          firstName: input.firstName,
          protocol: input.protocol,
        })
      : createChildProfile({
          parentId: input.parentId,
          firstName: input.firstName,
          protocol: input.protocol,
        })

    await repositoryPort.save(profile)

    return profile
  }
}
