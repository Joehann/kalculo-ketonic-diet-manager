import { ChildProfileNotFoundError } from '../../domain/errors/ChildProfileError'
import type { ChildProfile } from '../../domain/ChildProfile'
import type { ChildProfileRepositoryPort } from '../ports/ChildProfileRepositoryPort'

export type GetChildProfileQuery = (parentId: string) => Promise<ChildProfile>

export const buildGetChildProfileQuery = (
  repositoryPort: ChildProfileRepositoryPort,
): GetChildProfileQuery => {
  return async (parentId) => {
    const profile = await repositoryPort.findByParentId(parentId)

    if (!profile) {
      throw new ChildProfileNotFoundError('Aucun profil enfant configure pour ce parent')
    }

    return profile
  }
}
