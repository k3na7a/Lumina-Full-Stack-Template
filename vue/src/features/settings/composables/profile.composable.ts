import { AppStore, useAppStore } from '@/core/store/app.store'
import { computed, ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettingsHandler } from '../handlers/settings.handler'
import { UserDto } from '@lib/dto/user.dto'

function useProfilePage() {
  const appStore: AppStore = useAppStore()

  const { t } = useI18n()
  const { updateAvatar, removeAvatar, updateProfile } = useSettingsHandler(t)

  const user: ComputedRef<UserDto> = computed(() => {
    if (!appStore.authenticatedUser) {
      throw new Error('[Auth] authenticatedUser is unexpectedly undefined in a protected route.')
    }
    return appStore.authenticatedUser
  })

  return {
    user,
    updateAvatar,
    removeAvatar,
    updateProfile
  }
}

export { useProfilePage }
