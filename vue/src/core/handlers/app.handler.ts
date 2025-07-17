import { markRaw } from 'vue'
import { AxiosError } from 'axios'

import SignInModal from '@/shared/components/modal/signin-modal.component.vue'
import RegisterModal from '@/shared/components/modal/register-modal.component.vue'
import ConfirmationModal from '@/shared/components/modal/confirm.modal.vue'

import { credentials } from '@/core/apis/localhost/dto/JWT.dto'
import { Register, RegisterDto } from '@/core/apis/localhost/administration/users/dto/user.dto'
import { AppStore, useAppStore } from '@/core/store/app.store'
import { ModalStore, useModalStore } from '@/core/store/modal.store'
import { ToastStore, useToastStore } from '@/core/store/toast.store'
import { ForgotPassword, ForgotPasswordDto, ResetPassword, ResetPasswordDto } from '@/core/apis/localhost/administration/users/dto/user.dto'

export type AppHandler = {
  register: () => void
  signin: () => void
  signout: () => void
  forgotPassword(props: ForgotPassword, callback?: () => void | Promise<void>): Promise<void>
  resetPassword(props: ResetPassword, token: string, callback?: () => void | Promise<void>): Promise<void>
}

export function useAppHandler(t: (key: string) => string): AppHandler {
  const modalStore: ModalStore = useModalStore()
  const appStore: AppStore = useAppStore()
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

  function register(): void {
    const { openModal, closeModal } = modalStore
    const { register } = appStore

    openModal({
      view: markRaw(RegisterModal),
      properties: {
        callback: async (values: Register): Promise<void> => {
          await register(new RegisterDto(values))
            .then(() => {
              showSuccessToast('authentication.register.success')
              closeModal()
            })
            .catch(showErrorToast)
        }
      }
    })
  }

  function signin(): void {
    const { closeModal, openModal } = modalStore
    const { signIn } = appStore

    openModal({
      view: markRaw(SignInModal),
      properties: {
        callback: async (values: credentials): Promise<void> => {
          await signIn(values)
            .then(() => {
              showSuccessToast('authentication.log-in.success')
              closeModal()
            })
            .catch(showErrorToast)
        }
      }
    })
  }

  function signout(): void {
    const { openModal, closeModal }: ModalStore = useModalStore()
    const { signOut } = appStore

    openModal({
      view: markRaw(ConfirmationModal),
      properties: {
        title: t('authentication.log-out.modal-title'),
        body: t('authentication.log-out.modal-body'),
        action: t('actions.log-out'),
        close: closeModal,
        callback: async (): Promise<void> => {
          await signOut()
            .then(() => {
              showSuccessToast('authentication.log-out.success')
              closeModal()
            })
            .catch(showErrorToast)
        }
      }
    })
  }

  async function forgotPassword(props: ForgotPassword, callback?: () => void | Promise<void>): Promise<void> {
    const { forgotPassword } = appStore

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
    const { resetPassword } = appStore

    await resetPassword(new ResetPasswordDto(props, token))
      .then(() => {
        if (callback) callback()
        showSuccessToast('authentication.password-reset.success')
      })
      .catch(showErrorToast)
  }

  return { register, signin, signout, forgotPassword, resetPassword }
}
