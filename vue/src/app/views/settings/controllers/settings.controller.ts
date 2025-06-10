import { markRaw } from 'vue'
import { AxiosError } from 'axios'

import PasswordModal from '@/app/components/modal/templates/password.modal.vue'
import UploadImageModalComponent from '@/app/components/modal/templates/image-upload.modal.vue'

import { ModalStore, useModalStore } from '@/app/store/modal.store'
import { AuthStore, useAuthStore } from '@/app/store/authentication.store'
import { ToastStore, useToastStore } from '@/app/store/toast.store'

import {
  DeleteAccount,
  DeleteAccountDto,
  UpdateEmail,
  UpdateEmailDto,
  UpdatePassword,
  UpdatePasswordDto,
  UpdateProfile,
  UpdateProfileDto
} from '@/library/apis/localhost/dto/user.dto'
import ConfirmModal from '@/app/components/modal/templates/confirm.modal.vue'

class SettingsController {
  private readonly modalStore: ModalStore = useModalStore()
  private readonly authStore: AuthStore = useAuthStore()
  private readonly toastStore: ToastStore = useToastStore()

  private readonly $t: (key: string) => string

  constructor(t: (key: string) => string) {
    this.$t = t
  }

  public updateAvatar = (): void => {
    const { openModal, closeModal } = this.modalStore
    const { updateAvatar } = this.authStore
    const { addToast } = this.toastStore

    const t = this.$t

    openModal({
      view: markRaw(UploadImageModalComponent),
      properties: {
        title: t('settings.profile.avatar.modal-title'),
        action: t('actions.update-avatar'),
        callback: async ({ image }: { image: File }): Promise<void> => {
          await updateAvatar(image)
            .then(() => {
              console.log('[Axios] POST /profile/avatar request succeeded')
              addToast({
                title: t('settings.profile.avatar.success.title'),
                body: t('settings.profile.avatar.success.body'),
                options: { theme: 'success' }
              })
              closeModal()
            })
            .catch((error: AxiosError) => {
              console.warn(`[Axios] Failed to POST /profile/avatar : ${error.message}`)
              addToast({
                title: t('settings.profile.avatar.error.title'),
                body: t('settings.profile.avatar.error.title'),
                options: { theme: 'danger' }
              })
            })
        }
      }
    })
  }

  public removeAvatar = (): void => {
    const { removeAvatar } = this.authStore
    const { openModal, closeModal } = this.modalStore
    const { addToast } = this.toastStore

    const t = this.$t

    openModal({
      view: markRaw(ConfirmModal),
      properties: {
        title: t('settings.profile.remove-avatar.title'),
        body: t('settings.profile.remove-avatar.body'),
        action: t('settings.profile.remove-avatar.action'),
        close: closeModal,
        callback: async (): Promise<void> => {
          await removeAvatar()
            .then(() => {
              console.log('[Axios] DELETE /profile/avatar request succeeded')
              addToast({
                title: t('settings.profile.remove-avatar.error.title'),
                body: t('settings.profile.remove-avatar.error.title'),
                options: { theme: 'success' }
              })
              closeModal()
            })
            .catch((error: AxiosError) => {
              console.warn(`[Axios] Failed to DELETE /profile/avatar : ${error.message}`)
              addToast({
                title: t('settings.profile.remove-avatar.error.title'),
                body: t('settings.profile.remove-avatar.error.title'),
                options: { theme: 'danger' }
              })
            })
        }
      }
    })
  }

  public updateProfile = async (props: UpdateProfile): Promise<void> => {
    const { updateProfile } = this.authStore
    const { addToast } = this.toastStore

    const t = this.$t

    await updateProfile(new UpdateProfileDto(props))
      .then(() => {
        console.log('[Axios] PATCH /profile request succeeded')
        addToast({
          title: t('settings.profile.profile-settings.success.title'),
          body: t('settings.profile.profile-settings.success.body'),
          options: { theme: 'success' }
        })
      })
      .catch((error: AxiosError) => {
        console.warn(`[Axios] Failed to PATCH /profile : ${error.message}`)
        addToast({
          title: t('settings.profile.profile-settings.error.title'),
          body: t('settings.profile.profile-settings.error.body'),
          options: { theme: 'danger' }
        })
      })
  }

  public disableAccount = (): void => {
    const { openModal, closeModal } = this.modalStore
    const { deleteAccount } = this.authStore
    const { addToast } = this.toastStore

    const t = this.$t

    openModal({
      view: markRaw(PasswordModal),
      size: 'md',
      properties: {
        title: t('authentication.disable-account.modal-title'),
        body: t('authentication.disable-account.modal-body'),
        action: t('actions.disable-account'),
        close: closeModal,
        callback: async (props: DeleteAccount): Promise<void> => {
          await deleteAccount(new DeleteAccountDto(props))
            .then(() => {
              console.log('[Axios] DELETE /user request succeeded')
              addToast({
                title: t('settings.profile.disable-account.success.title'),
                body: t('settings.profile.disable-account.success.body'),
                options: { theme: 'success' }
              })
              closeModal()
            })
            .catch((error: AxiosError) => {
              console.warn(`[Axios] Failed to DELETE /user : ${error.message}`)
              addToast({
                title: t('settings.profile.disable-account.error.title'),
                body: t('settings.profile.disable-account.error.body'),
                options: { theme: 'danger' }
              })
            })
        }
      }
    })
  }

  public updateEmail = async (props: UpdateEmail): Promise<void> => {
    const { updateEmail } = this.authStore
    const { addToast } = this.toastStore

    const t = this.$t

    await updateEmail(new UpdateEmailDto(props))
      .then(() => {
        console.log('[Axios] PATCH /update-email request succeeded')
        addToast({
          title: t('settings.security-privacy.contact.email.success.title'),
          body: t('settings.security-privacy.contact.email.success.body'),
          options: { theme: 'success' }
        })
      })
      .catch((error: AxiosError) => {
        console.warn(`[Axios] Failed to PATCH /update-email : ${error.message}`)
        addToast({
          title: t('settings.security-privacy.contact.email.error.title'),
          body: t('settings.security-privacy.contact.email.error.body'),
          options: { theme: 'danger' }
        })
      })
  }

  public updatePassword = async (props: UpdatePassword): Promise<void> => {
    const { updatePassword } = this.authStore
    const { addToast } = this.toastStore

    const t = this.$t

    await updatePassword(new UpdatePasswordDto(props))
      .then(() => {
        console.log('[Axios] PATCH /update-password request succeeded')
        addToast({
          title: t('settings.security-privacy.security.password.success.title'),
          body: t('settings.security-privacy.security.password.success.body'),
          options: { theme: 'success' }
        })
      })
      .catch((error: AxiosError) => {
        console.warn(`[Axios] Failed to PATCH /update-password : ${error.message}`)
        addToast({
          title: t('settings.security-privacy.security.password.success.title'),
          body: t('settings.security-privacy.security.password.success.body'),
          options: { theme: 'danger' }
        })
      })
  }
}

export { SettingsController }
