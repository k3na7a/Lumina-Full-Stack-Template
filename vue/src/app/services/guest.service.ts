import { AxiosError } from 'axios'

import { AuthStore, useAuthStore } from '@/app/store/authentication.store'
import { ToastStore, useToastStore } from '@/app/store/toast.store'

import { ForgotPassword, ForgotPasswordDto, ResetPassword, ResetPasswordDto } from '@/library/data/dto/user.dto'

class GuestService {
  public static forgotPassword = async (props: ForgotPassword, callback?: () => void): Promise<void> => {
    const { forgotPassword }: AuthStore = useAuthStore()
    const { addToast }: ToastStore = useToastStore()

    await forgotPassword(new ForgotPasswordDto(props))
      .then(callback)
      .catch((error: AxiosError) =>
        addToast({ title: error.response?.statusText || 'ERROR', body: error.message, options: { theme: 'danger' } })
      )
  }

  public static resetPassword = async (props: ResetPassword, token: string, callback?: () => void): Promise<void> => {
    const { resetPassword }: AuthStore = useAuthStore()
    const { addToast }: ToastStore = useToastStore()

    await resetPassword(new ResetPasswordDto(props, token))
      .then(callback)
      .catch((error: AxiosError) =>
        addToast({ title: error.response?.statusText || 'ERROR', body: error.message, options: { theme: 'danger' } })
      )
  }
}

export { GuestService }
