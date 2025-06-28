import { ComputedRef, computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useAuthHandler } from '@/core/handlers/authentication.handler'
import { AuthStore, useAuthStore } from '@/core/store/authentication.store'

import { UserDto } from '@/library/dto/user.dto'

type MainLayout = {
  register: () => void
  signin: () => void
  signout: () => void
  user: ComputedRef<UserDto | undefined>
  isAuthenticated: ComputedRef<boolean>
}

function useMainLayout(): MainLayout {
  const { t } = useI18n()
  const { register, signin, signout } = useAuthHandler(t)

  const authStore: AuthStore = useAuthStore()

  const user: ComputedRef<UserDto | undefined> = computed(() => authStore.authenticatedUser)
  const isAuthenticated: ComputedRef<boolean> = computed(() => authStore.isAuthenticated)

  return {
    register,
    signin,
    signout,
    user,
    isAuthenticated
  }
}

export { useMainLayout }
