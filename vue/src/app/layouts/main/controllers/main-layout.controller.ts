import { markRaw } from 'vue'
import { AxiosError } from 'axios'

import SignInModal from '../components/modals/signin.modal.vue'
import RegisterModal from '../components/modals/register.modal.vue'
import ConfirmationModal from '@/app/components/modal/confirm.modal.vue'

import { ModalStore, useModalStore } from '@/app/store/modal.store'
import { AuthStore, useAuthStore } from '@/app/store/authentication.store'
import { ToastStore, useToastStore } from '@/app/store/toast.store'

import { credentials } from '@/library/dto/JWT.dto'

export class MainLayoutController {
  public static signin = (): void => {
    const { openModal, closeModal }: ModalStore = useModalStore()
    const { signIn }: AuthStore = useAuthStore()
    const { addToast }: ToastStore = useToastStore()

    openModal({
      view: markRaw(SignInModal),
      properties: {
        close: closeModal,
        callback: async (values: credentials): Promise<void> => {
          signIn(values)
            .then(closeModal)
            .catch((error: AxiosError) =>
              addToast({ title: error.response?.statusText || 'ERROR', body: error.message })
            )
        }
      }
    })
  }

  public static register = (): void => {
    const { openModal, closeModal }: ModalStore = useModalStore()
    // const { signIn }: AuthStore = useAuthStore()
    // const { addToast }: ToastStore = useToastStore()

    openModal({
      view: markRaw(RegisterModal),
      properties: {
        close: closeModal,
        callback: async (): Promise<void> => {}
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
            .catch((error: AxiosError) =>
              addToast({ title: error.response?.statusText || 'ERROR', body: error.message })
            )
        },
        title: 'Log out of Testhub',
        body: 'Are you sure you want to log out of Testhub?',
        action: 'actions.log-out'
      }
    })
  }
}
