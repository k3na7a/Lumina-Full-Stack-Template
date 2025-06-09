import { AxiosError } from 'axios'

import { AuthStore, useAuthStore } from '@/app/store/authentication.store'
import { ToastStore, useToastStore } from '@/app/components/toast/store/toast.store'

import {
  ForgotPassword,
  ForgotPasswordDto,
  ResetPassword,
  ResetPasswordDto
} from '@/library/apis/localhost/dto/user.dto'

class GuestController {
  public static forgotPassword = async (props: ForgotPassword, callback?: () => void): Promise<void> => {
    const { forgotPassword }: AuthStore = useAuthStore()
    const { addToast }: ToastStore = useToastStore()

    await forgotPassword(new ForgotPasswordDto(props))
      .then(() => {
        if (callback) callback()
        addToast({
          title: 'Password Reset Email Sent',
          body: "We've sent a link to your email so you can reset your password. Please check your inbox.",
          options: { theme: 'success' }
        })
      })
      .catch((error: AxiosError) =>
        addToast({ title: error.response?.statusText || 'ERROR', body: error.message, options: { theme: 'danger' } })
      )
  }

  public static resetPassword = async (props: ResetPassword, token: string, callback?: () => void): Promise<void> => {
    const { resetPassword }: AuthStore = useAuthStore()
    const { addToast }: ToastStore = useToastStore()

    await resetPassword(new ResetPasswordDto(props, token))
      .then(() => {
        if (callback) callback()
        addToast({
          title: 'Password Reset Successful',
          body: "Your password has been changed successfully. You're all set!",
          options: { theme: 'success' }
        })
      })
      .catch((error: AxiosError) =>
        addToast({ title: error.response?.statusText || 'ERROR', body: error.message, options: { theme: 'danger' } })
      )
  }
}

export { GuestController }
