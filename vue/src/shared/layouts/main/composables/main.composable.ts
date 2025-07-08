import { ComputedRef, computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useAppHandler } from '@/core/handlers/app.handler'
import { AppStore, useAppStore } from '@/core/store/app.store'

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
  const { register, signin, signout } = useAppHandler(t)

  const appStore: AppStore = useAppStore()

  const user: ComputedRef<UserDto | undefined> = computed(() => appStore.authenticatedUser)
  const isAuthenticated: ComputedRef<boolean> = computed(() => appStore.isAuthenticated)

  return {
    register,
    signin,
    signout,
    user,
    isAuthenticated
  }
}

export { useMainLayout }
