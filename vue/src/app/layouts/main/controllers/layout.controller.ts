import { markRaw } from 'vue'
import { AxiosError } from 'axios'

import SignInModal from '@/app/layouts/main/components/modals/signin-modal.component.vue'
import RegisterModal from '@/app/layouts/main/components/modals/register-modal.component.vue'
import ConfirmationModal from '@/app/components/modal/templates/confirm.modal.vue'

import { ModalStore, useModalStore } from '@/app/components/modal/store/modal.store'
import { AuthStore, useAuthStore } from '@/app/store/authentication.store'
import { ToastStore, useToastStore } from '@/app/components/toast/store/toast.store'

import { Register, RegisterDto } from '@/library/apis/localhost/dto/user.dto'
import { credentials } from '@/library/apis/localhost/dto/JWT.dto'

class MainController {
  public static signin = (): void => {
    const { openModal, closeModal }: ModalStore = useModalStore()
    const { signIn }: AuthStore = useAuthStore()
    const { addToast }: ToastStore = useToastStore()

    openModal({
      view: markRaw(SignInModal),
      properties: {
        callback: async (values: credentials): Promise<void> => {
          await signIn(values)
            .then(closeModal)
            .catch((error: AxiosError) => {
              console.warn('[Axios] Failed to POST sign-in')
              addToast({
                title: error.response?.statusText || 'ERROR',
                body: error.message,
                options: { theme: 'danger' }
              })
            })
        }
      }
    })
  }

  public static register = (): void => {
    const { openModal, closeModal }: ModalStore = useModalStore()
    const { register }: AuthStore = useAuthStore()
    const { addToast }: ToastStore = useToastStore()

    openModal({
      view: markRaw(RegisterModal),
      properties: {
        callback: async (values: Register): Promise<void> => {
          await register(new RegisterDto(values))
            .then(closeModal)
            .catch((error: AxiosError) => {
              console.warn('[Axios] Failed to PUT register')
              addToast({
                title: error.response?.statusText || 'ERROR',
                body: error.message,
                options: { theme: 'danger' }
              })
            })
        }
      }
    })
  }

  public static signout = (): void => {
    const { openModal, closeModal }: ModalStore = useModalStore()
    const { signOut }: AuthStore = useAuthStore()
    const { addToast }: ToastStore = useToastStore()

    openModal({
      view: markRaw(ConfirmationModal),
      properties: {
        close: closeModal,
        callback: async (): Promise<void> => {
          await signOut()
            .then(closeModal)
            .catch((error: AxiosError) => {
              console.warn('[Axios] Failed to POST sign-out')
              addToast({
                title: error.response?.statusText || 'ERROR',
                body: error.message,
                options: { theme: 'danger' }
              })
            })
        },
        title: 'authentication.log-out.modal-title',
        body: 'authentication.log-out.modal-body',
        action: 'actions.log-out'
      }
    })
  }
}

export { MainController }
