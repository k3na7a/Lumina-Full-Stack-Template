import { computed, ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'

import { useAuthStore, AuthStore } from '@/core/store/authentication.store'
import { useAuthHandler } from '@/core/handlers/authentication.handler'

type IsAuthenticatedGuard = {
  isAuthenticated: ComputedRef<boolean>
}

function useIsAuthenticatedGuard(): IsAuthenticatedGuard {
  const { t } = useI18n()
  const { signin } = useAuthHandler(t)

  const authStore: AuthStore = useAuthStore()
  const isAuthenticated: ComputedRef<boolean> = computed(() => authStore.isAuthenticated)

  if (!isAuthenticated.value) signin()

  return { isAuthenticated }
}

export type { IsAuthenticatedGuard }
export { useIsAuthenticatedGuard }
