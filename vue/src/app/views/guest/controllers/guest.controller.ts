import { AxiosError } from 'axios'

import { AuthStore, useAuthStore } from '@/app/store/authentication.store'
import { ToastStore, useToastStore } from '@/app/store/toast.store'

import {
  ForgotPassword,
  ForgotPasswordDto,
  ResetPassword,
  ResetPasswordDto
} from '@/library/apis/localhost/dto/user.dto'

class GuestController {
  private readonly authStore: AuthStore = useAuthStore()
  private readonly toastStore: ToastStore = useToastStore()

  private readonly $t: (key: string) => string

  constructor(t: (key: string) => string) {
    this.$t = t
  }

  public forgotPassword = async (props: ForgotPassword, callback?: () => void): Promise<void> => {
    const { forgotPassword } = this.authStore
    const { addToast } = this.toastStore

    const t = this.$t

    await forgotPassword(new ForgotPasswordDto(props))
      .then(() => {
        console.log('[Axios] POST /forgot-password request succeeded')
        if (callback) callback()
        addToast({
          title: t('authentication.account-recovery.success.title'),
          body: t('authentication.account-recovery.success.body'),
          options: { theme: 'success' }
        })
      })
      .catch((error: AxiosError) => {
        console.warn(`[Axios] Failed to POST /forgot-password : ${error.message}`)
        addToast({
          title: t('authentication.account-recovery.error.title'),
          body: t('authentication.account-recovery.error.body'),
          options: { theme: 'danger' }
        })
      })
  }

  public resetPassword = async (props: ResetPassword, token: string, callback?: () => void): Promise<void> => {
    const { resetPassword } = this.authStore
    const { addToast } = this.toastStore

    const t = this.$t

    await resetPassword(new ResetPasswordDto(props, token))
      .then(() => {
        console.log('[Axios] PATCH /reset-password request succeeded')
        if (callback) callback()
        addToast({
          title: t('authentication.password-reset.success.title'),
          body: t('authentication.password-reset.success.body'),
          options: { theme: 'success' }
        })
      })
      .catch((error: AxiosError) => {
        console.warn(`[Axios] Failed to PATCH /reset-password : ${error.message}`)
        addToast({
          title: t('authentication.password-reset.error.title'),
          body: t('authentication.password-reset.error.body'),
          options: { theme: 'danger' }
        })
      })
  }
}

export { GuestController }
