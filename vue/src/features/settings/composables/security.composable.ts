import { computed, ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { AppStore, useAppStore } from '@/core/store/app.store'
import { useSettingsHandler } from '../handlers/settings.handler'
import { UserDto } from '@/library/dto/user.dto'

function useSecurityPage() {
  const appStore: AppStore = useAppStore()

  const { t } = useI18n()
  const { disableAccount, updateEmail, updatePassword } = useSettingsHandler(t)

  const user: ComputedRef<UserDto> = computed(() => {
    if (!appStore.authenticatedUser) {
      throw new Error('[Auth] authenticatedUser is unexpectedly undefined in a protected route.')
    }
    return appStore.authenticatedUser
  })

  return {
    user,
    disableAccount,
    updateEmail,
    updatePassword
  }
}

export { useSecurityPage }
