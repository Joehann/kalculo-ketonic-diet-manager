import type { SessionToken } from '../../modules/authentication'

export type AppState = 'auth' | 'terms' | 'authenticated' | 'nutrition-demo'

export interface AppFlowSnapshot {
  appState: AppState
  session: SessionToken | null
}

export const transitionAfterAuthentication = (
  session: SessionToken,
): AppFlowSnapshot => ({
  appState: 'terms',
  session,
})

export const transitionAfterTermsStep = (
  session: SessionToken | null,
): AppFlowSnapshot => {
  if (!session) {
    return {
      appState: 'auth',
      session: null,
    }
  }

  return {
    appState: 'authenticated',
    session,
  }
}

export const transitionAfterLogout = (): AppFlowSnapshot => ({
  appState: 'auth',
  session: null,
})
