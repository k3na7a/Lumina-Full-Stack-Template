import { markRaw } from 'vue'
import { AxiosError } from 'axios'

import PasswordModal from '@/app/components/modal/templates/password.modal.vue'
import UploadImageModalComponent from '@/app/components/modal/templates/image-upload.modal.vue'

import { ModalStore, useModalStore } from '@/app/components/modal/store/modal.store'
import { AuthStore, useAuthStore } from '@/app/store/authentication.store'
import { ToastStore, useToastStore } from '@/app/components/toast/store/toast.store'

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
  public static updateAvatar = (): void => {
    const { openModal, closeModal }: ModalStore = useModalStore()
    const { updateAvatar }: AuthStore = useAuthStore()
    const { addToast }: ToastStore = useToastStore()

    openModal({
      view: markRaw(UploadImageModalComponent),
      properties: {
        callback: async ({ image }: { image: File }): Promise<void> => {
          await updateAvatar(image)
            .then(() => {
              addToast({
                title: 'Changes Saved',
                body: 'The profile picture has been updated successfully',
                options: { theme: 'success' }
              })
              closeModal()
            })
            .catch((error: AxiosError) => {
              console.warn('[Axios] Failed to PATCH profile.avatar')
              addToast({
                title: error.response?.statusText || 'ERROR',
                body: error.message,
                options: { theme: 'danger' }
              })
            })
        },
        title: 'settings.profile.avatar.modal-title',
        action: 'actions.update-avatar'
      }
    })
  }

  public static removeAvatar = (): void => {
    const { removeAvatar }: AuthStore = useAuthStore()
    const { openModal, closeModal }: ModalStore = useModalStore()
    const { addToast }: ToastStore = useToastStore()

    openModal({
      view: markRaw(ConfirmModal),
      properties: {
        close: closeModal,
        callback: async (): Promise<void> => {
          await removeAvatar()
            .then(() => {
              addToast({
                title: 'Changes Saved',
                body: 'The profile picture has been removed successfully',
                options: { theme: 'success' }
              })
              closeModal()
            })
            .catch((error: AxiosError) => {
              console.warn('[Axios] Failed to DELETE profile.avatar')
              addToast({
                title: error.response?.statusText || 'ERROR',
                body: error.message,
                options: { theme: 'danger' }
              })
            })
        },
        title: 'settings.profile.remove-avatar.title',
        body: 'settings.profile.remove-avatar.body',
        action: 'settings.profile.remove-avatar.action'
      }
    })
  }

  public static updateEmail = async (props: UpdateEmail): Promise<void> => {
    const { updateEmail }: AuthStore = useAuthStore()
    const { addToast }: ToastStore = useToastStore()

    await updateEmail(new UpdateEmailDto(props))
      .then(() => {
        addToast({
          title: 'Changes Saved',
          body: 'The email has been updated successfully',
          options: { theme: 'success' }
        })
      })
      .catch((error: AxiosError) => {
        console.warn('[Axios] Failed to PATCH user.email')
        addToast({ title: error.response?.statusText || 'ERROR', body: error.message, options: { theme: 'danger' } })
      })
  }

  public static updatePassword = async (props: UpdatePassword): Promise<void> => {
    const { updatePassword }: AuthStore = useAuthStore()
    const { addToast }: ToastStore = useToastStore()

    await updatePassword(new UpdatePasswordDto(props))
      .then(() => {
        addToast({
          title: 'Changes Saved',
          body: 'The password has been updated successfully',
          options: { theme: 'success' }
        })
      })
      .catch((error: AxiosError) => {
        console.warn('[Axios] Failed to PATCH user.password')
        addToast({ title: error.response?.statusText || 'ERROR', body: error.message, options: { theme: 'danger' } })
      })
  }

  public static updateProfile = async (props: UpdateProfile): Promise<void> => {
    const { updateProfile }: AuthStore = useAuthStore()
    const { addToast }: ToastStore = useToastStore()

    await updateProfile(new UpdateProfileDto(props))
      .then(() => {
        addToast({
          title: 'Changes Saved',
          body: 'The user profile has been updated successfully',
          options: { theme: 'success' }
        })
      })
      .catch((error: AxiosError) => {
        console.warn('[Axios] Failed to PATCH user.profile')
        addToast({ title: error.response?.statusText || 'ERROR', body: error.message, options: { theme: 'danger' } })
      })
  }

  public static disableAccount = (): void => {
    const { openModal, closeModal }: ModalStore = useModalStore()
    const { deleteAccount }: AuthStore = useAuthStore()
    const { addToast }: ToastStore = useToastStore()

    openModal({
      view: markRaw(PasswordModal),
      size: 'md',
      properties: {
        close: closeModal,
        callback: async (props: DeleteAccount): Promise<void> => {
          await deleteAccount(new DeleteAccountDto(props))
            .then(() => {
              addToast({
                title: 'Changes Saved',
                body: 'The user account has beend deleted successfully',
                options: { theme: 'success' }
              })
              closeModal()
            })
            .catch((error: AxiosError) => {
              console.warn('[Axios] Failed to DELETE user')
              addToast({
                title: error.response?.statusText || 'ERROR',
                body: error.message,
                options: { theme: 'danger' }
              })
            })
        },
        title: 'authentication.disable-account.modal-title',
        body: 'authentication.disable-account.modal-body',
        action: 'actions.disable-account'
      }
    })
  }
}

export { SettingsController }
