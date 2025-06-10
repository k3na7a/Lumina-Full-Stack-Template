import { markRaw } from 'vue'
import { AxiosError } from 'axios'

import SignInModal from '@/app/layouts/main/components/modals/signin-modal.component.vue'
import RegisterModal from '@/app/layouts/main/components/modals/register-modal.component.vue'
import ConfirmationModal from '@/app/components/modal/templates/confirm.modal.vue'

import { ModalStore, useModalStore } from '@/app/store/modal.store'
import { AuthStore, useAuthStore } from '@/app/store/authentication.store'
import { ToastStore, useToastStore } from '@/app/store/toast.store'

import { Register, RegisterDto } from '@/library/apis/localhost/dto/user.dto'
import { credentials } from '@/library/apis/localhost/dto/JWT.dto'

class MainController {
  private readonly modalStore: ModalStore = useModalStore()
  private readonly authStore: AuthStore = useAuthStore()
  private readonly toastStore: ToastStore = useToastStore()

  private readonly $t: (key: string) => string

  constructor(t: (key: string) => string) {
    this.$t = t
  }

  public register = (): void => {
    const { openModal, closeModal } = this.modalStore
    const { register } = this.authStore
    const { addToast } = this.toastStore

    const t = this.$t

    openModal({
      view: markRaw(RegisterModal),
      properties: {
        callback: async (values: Register): Promise<void> => {
          await register(new RegisterDto(values))
            .then(() => {
              console.log('[Axios] PUT /register request succeeded')
              addToast({
                title: t('authentication.register.success.title'),
                body: t('authentication.register.success.body'),
                options: { theme: 'success' }
              })
              closeModal()
            })
            .catch((error: AxiosError) => {
              console.warn(`[Axios] Failed to PUT /register : ${error.message}`)
              addToast({
                title: t('authentication.register.error.title'),
                body: t('authentication.register.error.body'),
                options: { theme: 'danger' }
              })
            })
        }
      }
    })
  }

  public signin = (): void => {
    const { addToast } = this.toastStore
    const { closeModal, openModal } = this.modalStore
    const { signIn } = this.authStore

    const t = this.$t

    openModal({
      view: markRaw(SignInModal),
      properties: {
        callback: async (values: credentials): Promise<void> => {
          await signIn(values)
            .then(() => {
              console.log('[Axios] POST /sign-in request succeeded')
              addToast({
                title: t('authentication.log-in.success.title'),
                body: t('authentication.log-in.success.body'),
                options: { theme: 'success' }
              })
              closeModal()
            })
            .catch((error: AxiosError) => {
              console.warn(`[Axios] Failed to POST /sign-in : ${error.message}`)
              addToast({
                title: t('authentication.log-in.error.title'),
                body: t('authentication.log-in.error.body'),
                options: { theme: 'danger' }
              })
            })
        }
      }
    })
  }

  public signout = (): void => {
    const { openModal, closeModal }: ModalStore = useModalStore()
    const { signOut }: AuthStore = useAuthStore()
    const { addToast }: ToastStore = useToastStore()

    const t = this.$t

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
              console.log('[Axios] POST /sign-out request succeeded')
              addToast({
                title: t('authentication.log-out.success.title'),
                body: t('authentication.log-out.success.body'),
                options: { theme: 'success' }
              })
              closeModal()
            })
            .catch((error: AxiosError) => {
              console.warn(`[Axios] Failed to POST /sign-out : ${error.message}`)
              addToast({
                title: t('authentication.log-out.error.title'),
                body: t('authentication.log-out.error.body'),
                options: { theme: 'danger' }
              })
            })
        }
      }
    })
  }
}

export { MainController }
