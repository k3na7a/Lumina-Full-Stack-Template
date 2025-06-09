import { AxiosError } from 'axios'
import { markRaw } from 'vue'

import { ToastStore, useToastStore } from '@/app/store/toast.store'
import { LocalhostAPI } from '@/library/apis/localhost/localhost.api'
import { PaginationDto, PaginationMeta, PaginationOptions } from '@/library/apis/localhost/dto/pagination.dto'
import { UpdateUser, UpdateUserDto, UserDto } from '@/library/apis/localhost/dto/user.dto'
import { ModalStore, useModalStore } from '@/app/store/modal.store'

import UploadImageModal from '@/app/components/modal/templates/image-upload.modal.vue'
import ConfirmModal from '@/app/components/modal/templates/confirm.modal.vue'

class UserAdminController {
  public static async getUsersPaginated(params: PaginationOptions): Promise<PaginationDto<UserDto>> {
    const { addToast }: ToastStore = useToastStore()
    return LocalhostAPI.administration.users.getUsersPaginated(params).catch((error: AxiosError) => {
      console.warn(`[Axios] Failed to GET users (paginated): ${error.message}`)
      addToast({ title: error.response?.statusText || 'ERROR', body: error.message, options: { theme: 'danger' } })
      return { data: [], meta: new PaginationMeta({ pageOptions: params, itemCount: 0 }) }
    })
  }

  public static async getUserById(id: string): Promise<UserDto> {
    return LocalhostAPI.administration.users.getUserById(id).catch((error: AxiosError) => {
      console.warn(`[Axios] Failed to GET user ID ${id}: ${error.message}`)
      throw new Error(`Unable to fetch user with ID ${id}: ${error.message}`)
    })
  }

  public static async updateUser(
    user: UserDto,
    payload: UpdateUser,
    success?: (value: UserDto) => void
  ): Promise<UserDto> {
    const { addToast }: ToastStore = useToastStore()
    const { id } = user

    return LocalhostAPI.administration.users
      .updateUser(id, new UpdateUserDto(payload))
      .then((response: UserDto) => {
        if (success) success(response)
        addToast({
          title: 'Changes Saved',
          body: 'The user profile has been updated successfully',
          options: { theme: 'success' }
        })
        return response
      })
      .catch((error: AxiosError) => {
        console.warn(`[Axios] Failed to UPDATE user ID ${id}: ${error.message}`)
        addToast({ title: error.response?.statusText || 'ERROR', body: error.message, options: { theme: 'danger' } })
        return user
      })
  }

  public static async deleteUser(user: UserDto, success?: (value: UserDto) => void): Promise<void> {
    const { openModal, closeModal }: ModalStore = useModalStore()
    const { addToast }: ToastStore = useToastStore()

    openModal({
      view: markRaw(ConfirmModal),
      properties: {
        close: closeModal,
        callback: async (): Promise<void> => {
          await LocalhostAPI.administration.users
            .deleteUser(user.id)
            .then((value: UserDto) => {
              if (success) success(value)
              addToast({
                title: 'Changes Saved',
                body: 'The user has been removed successfully',
                options: { theme: 'success' }
              })
              closeModal()
            })
            .catch((error: AxiosError) => {
              console.warn('[Axios] Failed to DELETE user.')

              addToast({
                title: error.response?.statusText || 'ERROR',
                body: error.message,
                options: { theme: 'danger' }
              })
            })
        },
        title: 'administration.users.delete-modal.title',
        body: 'administration.users.delete-modal.body',
        action: 'administration.users.delete-modal.action'
      }
    })
  }

  public static updateAvatar = (user: UserDto, success?: (value: UserDto) => void): void => {
    const { openModal, closeModal }: ModalStore = useModalStore()
    const { addToast }: ToastStore = useToastStore()

    openModal({
      view: markRaw(UploadImageModal),
      properties: {
        callback: async ({ image }: { image: File }): Promise<void> => {
          await LocalhostAPI.administration.users.profile
            .updateAvatar(user.id, image)
            .then((value: UserDto) => {
              if (success) success(value)
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
        title: 'administration.user.avatar.title',
        action: 'actions.update-avatar'
      }
    })
  }

  public static removeAvatar = (user: UserDto, success?: (value: UserDto) => void): void => {
    const { openModal, closeModal }: ModalStore = useModalStore()
    const { addToast }: ToastStore = useToastStore()

    openModal({
      view: markRaw(ConfirmModal),
      properties: {
        close: closeModal,
        callback: async (): Promise<void> => {
          await LocalhostAPI.administration.users.profile
            .removeAvatar(user.id)
            .then((value: UserDto) => {
              if (success) success(value)
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
        title: 'administration.user.avatar.remove-avatar.title',
        body: 'administration.user.avatar.remove-avatar.body',
        action: 'actions.remove-avatar'
      }
    })
  }
}

export { UserAdminController }
