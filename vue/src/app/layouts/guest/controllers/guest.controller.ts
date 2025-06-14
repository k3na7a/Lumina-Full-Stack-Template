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

  private readonly debug: boolean = false

  constructor(t: (key: string) => string) {
    this.$t = t
  }

  public readonly forgotPassword = async (
    props: ForgotPassword,
    callback?: () => void | Promise<void>
  ): Promise<void> => {
    const { forgotPassword } = this.authStore
    const { addToast } = this.toastStore

    const t = this.$t

    await forgotPassword(new ForgotPasswordDto(props))
      .then(() => {
        this.debug && console.log('[Axios] POST /forgot-password request succeeded')
        if (callback) callback()
        addToast({
          title: t('forms.success'),
          body: t('authentication.account-recovery.success'),
          options: { theme: 'success' }
        })
      })
      .catch((error: AxiosError) => {
        this.debug && console.warn(`[Axios] Failed to POST /forgot-password : ${error.message}`)
        addToast({
          title: t('forms.error-general'),
          body: error.message,
          options: { theme: 'danger' }
        })
      })
  }

  public readonly resetPassword = async (
    props: ResetPassword,
    token: string,
    callback?: () => void | Promise<void>
  ): Promise<void> => {
    const { resetPassword } = this.authStore
    const { addToast } = this.toastStore

    const t = this.$t

    await resetPassword(new ResetPasswordDto(props, token))
      .then(() => {
        this.debug && console.log('[Axios] PATCH /reset-password request succeeded')
        if (callback) callback()
        addToast({
          title: t('forms.success'),
          body: t('authentication.password-reset.success'),
          options: { theme: 'success' }
        })
      })
      .catch((error: AxiosError) => {
        this.debug && console.warn(`[Axios] Failed to PATCH /reset-password : ${error.message}`)
        addToast({
          title: t('forms.error-general'),
          body: error.message,
          options: { theme: 'danger' }
        })
      })
  }
}

export { GuestController }
