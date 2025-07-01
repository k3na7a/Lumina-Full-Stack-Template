import { computed, ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { AuthStore, useAuthStore } from '@/core/store/authentication.store'
import { useSettingsHandler } from '../handlers/settings.handler'
import { UserDto } from '@/library/dto/user.dto'

function useSecurityPage() {
  const authStore: AuthStore = useAuthStore()

  const { t } = useI18n()
  const { disableAccount, updateEmail, updatePassword } = useSettingsHandler(t)

  const user: ComputedRef<UserDto> = computed(() => {
    if (!authStore.authenticatedUser) {
      throw new Error('[Auth] authenticatedUser is unexpectedly undefined in a protected route.')
    }
    return authStore.authenticatedUser
  })

  return {
    user,
    disableAccount,
    updateEmail,
    updatePassword
  }
}

export { useSecurityPage }
