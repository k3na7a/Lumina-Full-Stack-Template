import { AuthStore, useAuthStore } from '@/core/store/authentication.store'
import { computed, ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettingsHandler } from '../handlers/settings.handler'
import { UserDto } from '@/library/dto/user.dto'

function useProfilePage() {
  const authStore: AuthStore = useAuthStore()

  const { t } = useI18n()
  const { updateAvatar, removeAvatar, updateProfile } = useSettingsHandler(t)

  const user: ComputedRef<UserDto> = computed(() => {
    if (!authStore.authenticatedUser) {
      throw new Error('[Auth] authenticatedUser is unexpectedly undefined in a protected route.')
    }
    return authStore.authenticatedUser
  })

  return {
    user,
    updateAvatar,
    removeAvatar,
    updateProfile
  }
}

export { useProfilePage }
