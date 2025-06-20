import { AxiosError } from 'axios'

import { ForgotPassword, ForgotPasswordDto, ResetPassword, ResetPasswordDto } from '@/core/apis/dto/user.dto'
import { AuthStore, useAuthStore } from '@/core/store/authentication.store'
import { ToastStore, useToastStore } from '@/core/store/toast.store'

export function useGuestHandler(t: (key: string) => string): {
  forgotPassword: (props: ForgotPassword, callback?: () => void | Promise<void>) => Promise<void>
  resetPassword: (props: ResetPassword, token: string, callback?: () => void | Promise<void>) => Promise<void>
} {
  const authStore: AuthStore = useAuthStore()
  const toastStore: ToastStore = useToastStore()

  function showSuccessToast(key: string): void {
    const { addToast } = toastStore

    addToast({
      title: t('forms.success-general'),
      body: t(key),
      options: { theme: 'success' }
    })
  }

  function showErrorToast(error: AxiosError): void {
    const { addToast } = toastStore

    addToast({
      title: t('forms.error-general'),
      body: error.message,
      options: { theme: 'danger' }
    })
  }

  async function forgotPassword(props: ForgotPassword, callback?: () => void | Promise<void>): Promise<void> {
    const { forgotPassword } = authStore

    await forgotPassword(new ForgotPasswordDto(props))
      .then(() => {
        if (callback) callback()
        showSuccessToast('authentication.account-recovery.success')
      })
      .catch(showErrorToast)
  }

  async function resetPassword(
    props: ResetPassword,
    token: string,
    callback?: () => void | Promise<void>
  ): Promise<void> {
    const { resetPassword } = authStore

    await resetPassword(new ResetPasswordDto(props, token))
      .then(() => {
        if (callback) callback()
        showSuccessToast('authentication.password-reset.success')
      })
      .catch(showErrorToast)
  }

  return { forgotPassword, resetPassword }
}
