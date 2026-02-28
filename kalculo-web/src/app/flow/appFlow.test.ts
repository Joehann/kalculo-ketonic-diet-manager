import { describe, expect, it } from 'vitest'
import type { SessionToken } from '../../modules/authentication'
import {
  transitionAfterAuthentication,
  transitionAfterLogout,
  transitionAfterTermsStep,
} from './appFlow'

const fakeSession: SessionToken = {
  token: 'session-token-123',
  parentId: 'parent-1',
  expiresAt: new Date('2026-03-01T12:00:00.000Z'),
  createdAt: new Date('2026-02-28T12:00:00.000Z'),
}

describe('app flow transitions', () => {
  it('moves from auth to terms after authentication', () => {
    const next = transitionAfterAuthentication(fakeSession)

    expect(next).toEqual({
      appState: 'terms',
      session: fakeSession,
    })
  })

  it('moves from terms to authenticated when session exists', () => {
    const next = transitionAfterTermsStep(fakeSession)

    expect(next).toEqual({
      appState: 'authenticated',
      session: fakeSession,
    })
  })

  it('falls back to auth when terms step has no session', () => {
    const next = transitionAfterTermsStep(null)

    expect(next).toEqual({
      appState: 'auth',
      session: null,
    })
  })

  it('clears session on logout', () => {
    const next = transitionAfterLogout()

    expect(next).toEqual({
      appState: 'auth',
      session: null,
    })
  })
})
