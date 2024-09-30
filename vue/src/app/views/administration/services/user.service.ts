import { AxiosError } from 'axios'

import { ToastStore, useToastStore } from '@/app/store/toast.store'

import { LocalhostAPI } from '@/library/apis/localhost/localhost.api'
import { PaginationDto, PaginationMeta, PaginationOptions } from '@/library/dto/pagination.dto'
import { UserDto } from '@/library/dto/user.dto'
import { ModalStore, useModalStore } from '@/app/store/modal.store'
import { markRaw } from 'vue'

import ModalEditUserComponent from '../components/modals/update-user.modal.vue'
import ModalConfirmComponent from '@/app/components/modal/templates/confirm.modal.vue'

class UserService {
  public static async getUsersPaginated(params: PaginationOptions): Promise<PaginationDto<UserDto>> {
    const { addToast }: ToastStore = useToastStore()
    return LocalhostAPI.administration.users.getUsersPaginated(params).catch((error: AxiosError) => {
      addToast({ title: error.response?.statusText || 'ERROR', body: error.message })
      return { data: [], meta: new PaginationMeta({ pageOptions: params, itemCount: 0 }) }
    })
  }

  public static updateUser(user: UserDto): void {
    const { openModal }: ModalStore = useModalStore()
    // const { addToast }: ToastStore = useToastStore()

    openModal({
      view: markRaw(ModalEditUserComponent),
      properties: {
        user,
        callback: async (): Promise<void> => {}
      }
    })
  }

  public static deleteUser(user: UserDto): void {
    const { openModal, closeModal }: ModalStore = useModalStore()
    // const { addToast }: ToastStore = useToastStore()

    openModal({
      view: markRaw(ModalConfirmComponent),
      properties: {
        close: closeModal,
        callback: async (): Promise<void> => {},
        title: `Delete ${user.getFullName()}`,
        body: `Are you sure you want to delete ${user.getFullName()}?`,
        action: 'Delete User'
      }
    })
  }
}

export { UserService }
