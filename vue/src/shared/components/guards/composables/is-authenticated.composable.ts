import { computed, ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'

import { useAppStore, AppStore } from '@/core/store/app.store'
import { useAppHandler } from '@/core/handlers/app.handler'

type IsAuthenticatedGuard = {
  isAuthenticated: ComputedRef<boolean>
}

function useIsAuthenticatedGuard(): IsAuthenticatedGuard {
  const { t } = useI18n()
  const { signin } = useAppHandler(t)

  const appStore: AppStore = useAppStore()
  const isAuthenticated: ComputedRef<boolean> = computed(() => appStore.isAuthenticated)

  if (!isAuthenticated.value) signin()

  return { isAuthenticated }
}

export type { IsAuthenticatedGuard }
export { useIsAuthenticatedGuard }
