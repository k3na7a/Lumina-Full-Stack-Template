import { markRaw } from 'vue'
import { AxiosError } from 'axios'

import UploadImageModal from '@/shared/components/modal/templates/image-upload.modal.vue'
import ConfirmModal from '@/shared/components/modal/templates/confirm.modal.vue'
import PasswordModal from '@/shared/components/modal/templates/password.modal.vue'

import {
  UpdateProfile,
  UpdateProfileDto,
  DeleteAccount,
  DeleteAccountDto,
  UpdateEmail,
  UpdateEmailDto,
  UpdatePassword,
  UpdatePasswordDto
} from '@/core/apis/dto/user.dto'

import { AuthStore, useAuthStore } from '@/core/store/authentication.store'
import { ModalStore, useModalStore } from '@/core/store/modal.store'
import { ToastStore, useToastStore } from '@/core/store/toast.store'

export function useSettingsHandler(t: (key: string) => string): {
  updateProfile: (props: UpdateProfile) => Promise<void>
  updateAvatar: () => void
  removeAvatar: () => void
  updateEmail: (props: UpdateEmail) => Promise<void>
  updatePassword: (props: UpdatePassword) => Promise<void>
  disableAccount: () => void
} {
  const authStore: AuthStore = useAuthStore()
  const toastStore: ToastStore = useToastStore()
  const modalStore: ModalStore = useModalStore()

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

  async function updateProfile(props: UpdateProfile): Promise<void> {
    const { updateProfile } = authStore

    await updateProfile(new UpdateProfileDto(props))
      .then(() => showSuccessToast('settings.profile.profile-settings.success'))
      .catch(showErrorToast)
  }

  function updateAvatar(): void {
    const { openModal, closeModal } = modalStore
    const { updateAvatar } = authStore

    openModal({
      view: markRaw(UploadImageModal),
      properties: {
        title: t('settings.profile.avatar.modal-title'),
        action: t('actions.update-avatar'),
        callback: async ({ image }: { image: File }): Promise<void> => {
          await updateAvatar(image)
            .then(() => {
              showSuccessToast('settings.profile.avatar.success')
              closeModal()
            })
            .catch(showErrorToast)
        }
      }
    })
  }

  function removeAvatar(): void {
    const { removeAvatar } = authStore
    const { openModal, closeModal } = modalStore

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
              showSuccessToast('settings.profile.remove-avatar.success')
              closeModal()
            })
            .catch(showErrorToast)
        }
      }
    })
  }

  async function updateEmail(props: UpdateEmail): Promise<void> {
    const { updateEmail } = authStore

    await updateEmail(new UpdateEmailDto(props))
      .then(() => showSuccessToast('settings.security-privacy.contact.email.success'))
      .catch(showErrorToast)
  }

  async function updatePassword(props: UpdatePassword): Promise<void> {
    const { updatePassword } = authStore

    await updatePassword(new UpdatePasswordDto(props))
      .then(() => showSuccessToast('settings.security-privacy.security.password.success'))
      .catch(showErrorToast)
  }

  function disableAccount(): void {
    const { openModal, closeModal } = modalStore
    const { deleteAccount } = authStore

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
              showSuccessToast('settings.profile.disable-account.success')
              closeModal()
            })
            .catch(showErrorToast)
        }
      }
    })
  }

  return { updateProfile, updateAvatar, removeAvatar, updateEmail, updatePassword, disableAccount }
}
