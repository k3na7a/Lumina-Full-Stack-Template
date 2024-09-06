import { markRaw } from 'vue'
import { AxiosError } from 'axios'

import SignInModal from '../components/modal/signin-modal.component.vue'
import RegisterModal from '../components/modal/register-modal.component.vue'
import ConfirmationModal from '@/components/modal/confirm-modal.component.vue'

import { ModalStore, useModalStore } from '@/store/modal.store'
import { AuthStore, useAuthStore } from '@/store/authentication.store'
import { ToastStore, useToastStore } from '@/store/toast.store'

import PasswordModal from '@/components/modal/password-modal.component.vue'

import { credentials } from '@/library/dto/JWT.dto'
import {
  DeleteAccount,
  DeleteAccountDto,
  ForgotPassword,
  ForgotPasswordDto,
  Register,
  RegisterDto,
  ResetPassword,
  ResetPasswordDto,
  UpdateEmail,
  UpdateEmailDto,
  UpdatePassword,
  UpdatePasswordDto,
  UpdateProfile,
  UpdateProfileDto
} from '@/library/dto/user.dto'

export class AuthService {
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
    const { register }: AuthStore = useAuthStore()
    const { addToast }: ToastStore = useToastStore()

    openModal({
      view: markRaw(RegisterModal),
      properties: {
        close: closeModal,
        callback: async (values: Register): Promise<void> => {
          register(new RegisterDto(values))
            .then(closeModal)
            .catch((error: AxiosError) =>
              addToast({ title: error.response?.statusText || 'ERROR', body: error.message })
            )
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
            .catch((error: AxiosError) =>
              addToast({ title: error.response?.statusText || 'ERROR', body: error.message })
            )
        },
        title: 'authentication.log-out.modal-title',
        body: 'authentication.log-out.modal-body',
        action: 'actions.log-out'
      }
    })
  }

  public static forgotPassword = async (props: ForgotPassword, callback?: () => void): Promise<void> => {
    const { forgotPassword }: AuthStore = useAuthStore()
    const { addToast }: ToastStore = useToastStore()

    await forgotPassword(new ForgotPasswordDto(props))
      .then(callback)
      .catch((error: AxiosError) => addToast({ title: error.response?.statusText || 'ERROR', body: error.message }))
  }

  public static resetPassword = async (props: ResetPassword, token: string, callback?: () => void): Promise<void> => {
    const { resetPassword }: AuthStore = useAuthStore()
    const { addToast }: ToastStore = useToastStore()

    await resetPassword(new ResetPasswordDto(props, token))
      .then(callback)
      .catch((error: AxiosError) => addToast({ title: error.response?.statusText || 'ERROR', body: error.message }))
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
        title: 'authentication.disable-account.modal-title',
        body: 'authentication.disable-account.modal-body',
        action: 'actions.disable-account'
      }
    })
  }
}
