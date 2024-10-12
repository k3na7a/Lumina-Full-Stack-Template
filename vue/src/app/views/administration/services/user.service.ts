import { AxiosError } from 'axios'

import { ToastStore, useToastStore } from '@/app/store/toast.store'

import { LocalhostAPI } from '@/apis/localhost/localhost.api'
import { PaginationDto, PaginationMeta, PaginationOptions } from '@/apis/localhost/dto/pagination.dto'
import { UpdateUser, UpdateUserDto, UserDto } from '@/apis/localhost/dto/user.dto'
import { ModalStore, useModalStore } from '@/app/store/modal.store'
import { markRaw } from 'vue'

import ModalEditUserComponent from '../components/modals/update-user.modal.vue'
import ModalConfirmComponent from '@/app/components/modal/confirm.modal.vue'

class UserService {
  public static async getUsersPaginated(params: PaginationOptions): Promise<PaginationDto<UserDto>> {
    const { addToast }: ToastStore = useToastStore()
    return LocalhostAPI.administration.users.getUsersPaginated(params).catch((error: AxiosError) => {
      addToast({ title: error.response?.statusText || 'ERROR', body: error.message, options: { theme: 'danger' } })
      return { data: [], meta: new PaginationMeta({ pageOptions: params, itemCount: 0 }) }
    })
  }

  public static updateUser(user: UserDto, success?: (value: UserDto) => void): void {
    const { openModal, closeModal }: ModalStore = useModalStore()
    const { addToast }: ToastStore = useToastStore()

    openModal({
      view: markRaw(ModalEditUserComponent),
      properties: {
        user,
        callback: async (values: UpdateUser): Promise<void> => {
          LocalhostAPI.administration.users
            .updateUser(user.id, new UpdateUserDto(values))
            .then((value: UserDto) => {
              if (success) success(value)
              closeModal()
            })
            .catch((error: AxiosError) => {
              addToast({
                title: error.response?.statusText || 'ERROR',
                body: error.message,
                options: { theme: 'danger' }
              })
            })
        }
      }
    })
  }

  public static deleteUser(user: UserDto, success?: (value: UserDto) => void): void {
    const { openModal, closeModal }: ModalStore = useModalStore()
    const { addToast }: ToastStore = useToastStore()

    openModal({
      view: markRaw(ModalConfirmComponent),
      properties: {
        close: closeModal,
        callback: async (): Promise<void> => {
          LocalhostAPI.administration.users
            .deleteUser(user.id)
            .then((value: UserDto) => {
              if (success) success(value)
              closeModal()
            })
            .catch((error: AxiosError) => {
              addToast({
                title: error.response?.statusText || 'ERROR',
                body: error.message,
                options: { theme: 'danger' }
              })
            })
        },
        title: `Delete ${user.getFullName()}`,
        body: `Are you sure you want to delete user ${user.getFullName()}?`,
        action: 'Delete User'
      }
    })
  }
}

export { UserService }
