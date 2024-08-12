import { markRaw } from 'vue'
import { AxiosError } from 'axios'

import PasswordModal from '@/app/components/modal/password.modal.vue'

import { ModalStore, useModalStore } from '@/app/store/modal.store'
import { AuthStore, useAuthStore } from '@/app/store/authentication.store'
import { ToastStore, useToastStore } from '@/app/store/toast.store'

import {
  DeleteAccount,
  UpdateProfile,
  UpdateProfileDto,
  UpdateEmailDto,
  UpdateEmail,
  UpdatePasswordDto,
  UpdatePassword,
  DeleteAccountDto
} from '@/library/dto/user.dto'

export class ProfileController {
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
          await deleteAccount(new DeleteAccountDto(props))
            .then(closeModal)
            .catch((error: AxiosError) =>
              addToast({ title: error.response?.statusText || 'ERROR', body: error.message })
            )
        },
        title: 'Disable your Testhub account',
        body: 'Are you sure you want to permanently disable your Testhub account?',
        action: 'Disable Account'
      }
    })
  }

  public static updateEmail = async (props: UpdateEmail): Promise<void> => {
    const { updateEmail }: AuthStore = useAuthStore()
    const { addToast }: ToastStore = useToastStore()

    await updateEmail(new UpdateEmailDto(props)).catch((error: AxiosError) =>
      addToast({ title: error.response?.statusText || 'ERROR', body: error.message })
    )
  }

  public static updatePassword = async (props: UpdatePassword): Promise<void> => {
    const { updatePassword }: AuthStore = useAuthStore()
    const { addToast }: ToastStore = useToastStore()

    await updatePassword(new UpdatePasswordDto(props)).catch((error: AxiosError) =>
      addToast({ title: error.response?.statusText || 'ERROR', body: error.message })
    )
  }

  public static updateProfile = async (props: UpdateProfile): Promise<void> => {
    const { updateProfile }: AuthStore = useAuthStore()
    const { addToast }: ToastStore = useToastStore()

    await updateProfile(new UpdateProfileDto(props)).catch((error: AxiosError) =>
      addToast({ title: error.response?.statusText || 'ERROR', body: error.message })
    )
  }
}
