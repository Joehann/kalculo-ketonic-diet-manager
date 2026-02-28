import { useEffect, useState } from 'react'
import type { ChildProfile, DietProtocol } from '../../../../modules/child-profile'
import {
  ALLOWED_DIET_PROTOCOLS,
  ChildProfileNotFoundError,
  InvalidChildFirstNameError,
  InvalidDietProtocolError,
} from '../../../../modules/child-profile'
import { useUseCases } from '../../../../app/providers/useUseCases'
import { Alert, Button, Card, CardBody, CardHeader, Input } from '../../../design-system'
import './ChildProfilePage.css'

interface ChildProfilePageProps {
  parentId: string
  onProfileSaved?: (profile: ChildProfile) => void
  submitLabel?: string
}

export const ChildProfilePage = ({
  parentId,
  onProfileSaved,
  submitLabel = 'Enregistrer le profil',
}: ChildProfilePageProps) => {
  const useCases = useUseCases()
  const [firstName, setFirstName] = useState('')
  const [protocol, setProtocol] = useState<DietProtocol>('ketogenic')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)

  useEffect(() => {
    const loadExistingProfile = async () => {
      try {
        setIsLoading(true)
        const existingProfile = await useCases.childProfile.getChildProfileQuery(parentId)
        setFirstName(existingProfile.firstName)
        setProtocol(existingProfile.protocol)
        setIsEditMode(true)
      } catch (caught) {
        if (!(caught instanceof ChildProfileNotFoundError)) {
          setError(caught instanceof Error ? caught.message : 'Erreur de chargement')
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadExistingProfile()
  }, [parentId, useCases])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccessMessage(null)

    try {
      setIsSubmitting(true)
      const profile = await useCases.childProfile.upsertChildProfileCommand({
        parentId,
        firstName,
        protocol,
      })
      setFirstName(profile.firstName)
      setProtocol(profile.protocol)
      setIsEditMode(true)
      setSuccessMessage(
        'Profil enfant enregistre. Vous pouvez continuer vers la planification.',
      )
      onProfileSaved?.(profile)
    } catch (caught) {
      if (
        caught instanceof InvalidChildFirstNameError ||
        caught instanceof InvalidDietProtocolError
      ) {
        setError(caught.message)
      } else {
        setError(caught instanceof Error ? caught.message : 'Erreur inconnue')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="child-profile-page">
        <Card className="child-profile-page__card">
          <CardBody>
            <p>Chargement du profil enfant...</p>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <div className="child-profile-page">
      <Card className="child-profile-page__card">
        <CardHeader className="child-profile-page__header">
          <h1 className="child-profile-page__title">Profil enfant</h1>
          <p className="child-profile-page__subtitle">
            {isEditMode
              ? 'Mettez a jour les informations nutritionnelles de reference.'
              : 'Configurez le profil avant la planification nutritionnelle.'}
          </p>
        </CardHeader>

        <CardBody>
          {error && <Alert type="error">{error}</Alert>}
          {successMessage && <Alert type="success">{successMessage}</Alert>}

          <form className="child-profile-page__form" onSubmit={handleSubmit}>
            <Input
              label="Prenom de l'enfant"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              placeholder="Ex: Noa"
              required
              disabled={isSubmitting}
            />

            <div className="child-profile-page__field">
              <label className="child-profile-page__label" htmlFor="diet-protocol-select">
                Protocole dietetique
              </label>
              <select
                id="diet-protocol-select"
                className="child-profile-page__select"
                value={protocol}
                onChange={(event) => setProtocol(event.target.value as DietProtocol)}
                disabled={isSubmitting}
              >
                {ALLOWED_DIET_PROTOCOLS.map((allowedProtocol) => (
                  <option key={allowedProtocol} value={allowedProtocol}>
                    {allowedProtocol === 'ketogenic' ? 'Ketogenic' : 'Modified Atkins'}
                  </option>
                ))}
              </select>
            </div>

            <Button type="submit" isLoading={isSubmitting}>
              {submitLabel}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
