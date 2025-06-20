import { markRaw } from 'vue'
import { AxiosError } from 'axios'

import SignInModal from '@/shared/layouts/main/components/modals/signin-modal.component.vue'
import RegisterModal from '@/shared/layouts/main/components/modals/register-modal.component.vue'
import ConfirmationModal from '@/shared/components/modal/templates/confirm.modal.vue'

import { credentials } from '@/core/apis/dto/JWT.dto'
import { Register, RegisterDto } from '@/core/apis/dto/user.dto'
import { AuthStore, useAuthStore } from '@/core/store/authentication.store'
import { ModalStore, useModalStore } from '@/core/store/modal.store'
import { ToastStore, useToastStore } from '@/core/store/toast.store'

export function useMainHandler(t: (key: string) => string): {
  register: () => void
  signin: () => void
  signout: () => void
} {
  const modalStore: ModalStore = useModalStore()
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

  function register(): void {
    const { openModal, closeModal } = modalStore
    const { register } = authStore

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
    const { signIn } = authStore

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
    const { signOut }: AuthStore = useAuthStore()

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

  return { register, signin, signout }
}
