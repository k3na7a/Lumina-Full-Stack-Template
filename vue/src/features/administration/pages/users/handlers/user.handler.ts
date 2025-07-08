import { AxiosError } from 'axios'
import { markRaw } from 'vue'

import { ToastStore, useToastStore } from '@/core/store/toast.store'
import { ModalStore, useModalStore } from '@/core/store/modal.store'

import ConfirmDeleteModal from '@/shared/components/modal/permanently-delete.component.vue'
import NewUserModal from '../components/user.component.vue'

import { PaginationOptions, PaginationDto, PaginationMeta } from '@/library/dto/pagination.dto'
import { UserDto, UpdateUser, UpdateUserDto } from '@/library/dto/user.dto'
import { LocalhostAPI } from '@/core/apis/localhost/localhost.api'
import { AppStore, useAppStore } from '@/core/store/app.store'

export function useUserAdminHandler(t: (key: string) => string): {
  getById: (id: string) => Promise<UserDto>
  getPaginated: (params: PaginationOptions) => Promise<PaginationDto<UserDto>>
  update(user: UserDto, success?: (value: UserDto) => void): void
  remove: (user: UserDto, success?: (value: UserDto) => void | Promise<void>) => void
} {
  const toastStore: ToastStore = useToastStore()
  const modalStore: ModalStore = useModalStore()
  const appStore: AppStore = useAppStore()

  const api = LocalhostAPI.administration.users

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

  async function getById(id: string): Promise<UserDto> {
    const token = await appStore.getValidAccessToken()
    if (!token) throw new Error('Could not get valid access token')

    return api.getById(id, token)
  }

  async function getPaginated(params: PaginationOptions): Promise<PaginationDto<UserDto>> {
    const token = await appStore.getValidAccessToken()
    if (!token) throw new Error('Could not get valid access token')

    return api.getPaginated(params, token).catch((error: AxiosError) => {
      showErrorToast(error)
      return { data: [], meta: new PaginationMeta({ pageOptions: params, itemCount: 0 }) }
    })
  }

  function update(user: UserDto, success?: (value: UserDto) => void): void {
    const { openModal, closeModal } = modalStore
    const { id } = user

    openModal({
      view: markRaw(NewUserModal),
      properties: {
        user,
        callback: async (values: UpdateUser): Promise<void> => {
          const token = await appStore.getValidAccessToken()
          if (!token) throw new Error('Could not get valid access token')

          await api
            .update(id, new UpdateUserDto(values), token)
            .then((value: UserDto) => {
              if (success) success(value)
              showSuccessToast('administration.users.user-table.update.success')
              closeModal()
            })
            .catch(showErrorToast)
        }
      }
    })
  }

  function remove(user: UserDto, success?: (value: UserDto) => void | Promise<void>): void {
    const { openModal, closeModal } = modalStore
    const { id } = user

    openModal({
      view: markRaw(ConfirmDeleteModal),
      properties: {
        title: t('administration.users.user-table.delete.title'),
        action: t('actions.disable-account'),
        close: closeModal,
        callback: async (): Promise<void> => {
          const token = await appStore.getValidAccessToken()
          if (!token) throw new Error('Could not get valid access token')

          await api
            .remove(id, token)
            .then((value: UserDto) => {
              if (success) success(value)
              showSuccessToast('administration.users.user-table.delete.success')
              closeModal()
            })
            .catch(showErrorToast)
        }
      }
    })
  }

  return { getById, getPaginated, update, remove }
}
