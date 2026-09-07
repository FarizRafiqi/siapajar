export const CREDITS_UPDATED_EVENT = 'credits-updated'

export function emitCreditsUpdated(creditsBalance: unknown) {
  if (typeof window === 'undefined' || typeof creditsBalance !== 'number') return

  window.dispatchEvent(
    new CustomEvent(CREDITS_UPDATED_EVENT, {
      detail: { creditsBalance },
    })
  )
}
