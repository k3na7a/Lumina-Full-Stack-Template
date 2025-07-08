import { ComputedRef, computed } from 'vue'

import { AppStore, useAppStore } from '@/core/store/app.store'

import { Role } from '@/library/dto/user.dto'

type IsAdministratorGuard = {
  isAuthenticated: ComputedRef<boolean>
}

function useIsAdministratorGuard(): IsAdministratorGuard {
  const appStore: AppStore = useAppStore()
  const isAuthenticated: ComputedRef<boolean> = computed(() => appStore.authenticatedUser?.role === Role.ADMIN)

  return { isAuthenticated }
}

export type { IsAdministratorGuard }
export { useIsAdministratorGuard }
