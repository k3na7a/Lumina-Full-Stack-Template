import { ComputedRef, computed } from 'vue'

import { AuthStore, useAuthStore } from '@/core/store/authentication.store'

import { Role } from '@/library/dto/user.dto'

type IsAdministratorGuard = {
  isAuthenticated: ComputedRef<boolean>
}

function useIsAdministratorGuard(): IsAdministratorGuard {
  const authStore: AuthStore = useAuthStore()
  const isAuthenticated: ComputedRef<boolean> = computed(() => authStore.authenticatedUser?.role === Role.ADMIN)

  return { isAuthenticated }
}

export type { IsAdministratorGuard }
export { useIsAdministratorGuard }
