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

  private readonly debug: boolean = false

  constructor(t: (key: string) => string) {
    this.$t = t
  }

  public readonly register = (): void => {
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
              this.debug && console.log('[Axios] PUT /register request succeeded')
              addToast({
                title: t('forms.success'),
                body: t('authentication.register.success'),
                options: { theme: 'success' }
              })
              closeModal()
            })
            .catch((error: AxiosError) => {
              this.debug && console.warn(`[Axios] Failed to PUT /register : ${error.message}`)
              addToast({
                title: t('forms.error-general'),
                body: error.message,
                options: { theme: 'danger' }
              })
            })
        }
      }
    })
  }

  public readonly signin = (): void => {
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
              this.debug && console.log('[Axios] POST /sign-in request succeeded')
              addToast({
                title: t('forms.success'),
                body: t('authentication.log-in.success'),
                options: { theme: 'success' }
              })
              closeModal()
            })
            .catch((error: AxiosError) => {
              this.debug && console.warn(`[Axios] Failed to POST /sign-in : ${error.message}`)
              addToast({
                title: t('forms.error-general'),
                body: error.message,
                options: { theme: 'danger' }
              })
            })
        }
      }
    })
  }

  public readonly signout = (): void => {
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
              this.debug && console.log('[Axios] POST /sign-out request succeeded')
              addToast({
                title: t('forms.success'),
                body: t('authentication.log-out.success'),
                options: { theme: 'success' }
              })
              closeModal()
            })
            .catch((error: AxiosError) => {
              this.debug && console.warn(`[Axios] Failed to POST /sign-out : ${error.message}`)
              addToast({
                title: t('forms.error-general'),
                body: error.message,
                options: { theme: 'danger' }
              })
            })
        }
      }
    })
  }
}

export { MainController }
