import { markRaw } from 'vue'
import { AxiosError } from 'axios'

import SignInModal from '@/app/components/modal/signin.modal.vue'
import ConfirmationModal from '@/app/components/modal/confirm.modal.vue'
import PasswordModal from '@/app/components/modal/password.modal.vue'

import { ModalStore, useModalStore } from '@/app/store/modal.store'
import { AuthStore, useAuthStore } from '@/app/store/authentication.store'
import { ToastStore, useToastStore } from '@/app/store/toast.store'

import { credentials } from '@/library/dto/JWT.dto'
import { DeleteAccount } from '@/library/dto/user.dto'

export class AuthController {
  public static signin = (_event?: MouseEvent): void => {
    const { openModal, closeModal }: ModalStore = useModalStore()
    const { signIn }: AuthStore = useAuthStore()
    const { addToast }: ToastStore = useToastStore()

    openModal({
      view: markRaw(SignInModal),
      properties: {
        close: closeModal,
        callback: (values: credentials) => {
          signIn(values)
            .then(closeModal)
            .catch((error: AxiosError) =>
              addToast({ title: error.response?.statusText || 'ERROR', body: error.message })
            )
        }
      }
    })
  }

  public static signout = (_event?: MouseEvent): void => {
    const { openModal, closeModal }: ModalStore = useModalStore()
    const { signOut }: AuthStore = useAuthStore()
    const { addToast }: ToastStore = useToastStore()

    openModal({
      view: markRaw(ConfirmationModal),
      size: 'sm',
      properties: {
        close: closeModal,
        callback: async (): Promise<void> => {
          await signOut()
            .then(closeModal)
            .catch((error: AxiosError) =>
              addToast({ title: error.response?.statusText || 'ERROR', body: error.message })
            )
        },
        title: 'Logging out',
        body: 'Are you sure you want to log out of Testhub?',
        action: 'actions.log-out'
      }
    })
  }

  public static disableAccount = (_event?: MouseEvent): void => {
    const { openModal, closeModal }: ModalStore = useModalStore()
    const { deleteAccount }: AuthStore = useAuthStore()
    const { addToast }: ToastStore = useToastStore()

    openModal({
      view: markRaw(PasswordModal),
      size: 'md',
      properties: {
        close: closeModal,
        callback: async (props: DeleteAccount): Promise<void> => {
          await deleteAccount(props)
            .then(closeModal)
            .catch((error: AxiosError) =>
              addToast({ title: error.response?.statusText || 'ERROR', body: error.message })
            )
        },
        title: 'Disable your Testhub account',
        body: 'Are you sure you want to permanently disable your Testhub account? This action cannot be undone',
        action: 'Disable Account'
      }
    })
  }
}
