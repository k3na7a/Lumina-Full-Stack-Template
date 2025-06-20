import { AxiosError } from 'axios'
import { markRaw } from 'vue'

import { ToastStore, useToastStore } from '@/core/store/toast.store'
import { ModalStore, useModalStore } from '@/core/store/modal.store'

import UploadImageModal from '@/shared/components/modal/templates/image-upload.modal.vue'
import ConfirmModal from '@/shared/components/modal/templates/confirm.modal.vue'
import ConfirmDeleteModal from '@/shared/components/modal/templates/permanently-delete.component.vue'

import { PaginationOptions, PaginationDto, PaginationMeta } from '@/core/apis/dto/pagination.dto'
import { UserDto, UpdateUser, UpdateUserDto } from '@/core/apis/dto/user.dto'
import { LocalhostAPI } from '@/core/apis/localhost/localhost.api'

export function useUserAdminHandler(t: (key: string) => string): {
  getById: (id: string) => Promise<UserDto>
  getPaginated: (params: PaginationOptions) => Promise<PaginationDto<UserDto>>
  update: (user: UserDto, payload: UpdateUser, success?: (value: UserDto) => void) => Promise<void>
  remove: (user: UserDto, success?: (value: UserDto) => void | Promise<void>) => void
  uploadAvatar: (user: UserDto, success?: (value: UserDto) => void | Promise<void>) => void
  removeAvatar: (user: UserDto, success?: (value: UserDto) => void | Promise<void>) => void
} {
  const toastStore: ToastStore = useToastStore()
  const modalStore: ModalStore = useModalStore()

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
    return api.getUserById(id)
  }

  async function getPaginated(params: PaginationOptions): Promise<PaginationDto<UserDto>> {
    return api.getUsersPaginated(params).catch((error: AxiosError) => {
      showErrorToast(error)
      return { data: [], meta: new PaginationMeta({ pageOptions: params, itemCount: 0 }) }
    })
  }

  async function update(user: UserDto, payload: UpdateUser, success?: (value: UserDto) => void): Promise<void> {
    const { id } = user
    await api
      .updateUser(id, new UpdateUserDto(payload))
      .then((response: UserDto) => {
        if (success) success(response)
        showSuccessToast('administration.users.single.account-details.success')
      })
      .catch(showErrorToast)
  }

  function remove(user: UserDto, success?: (value: UserDto) => void | Promise<void>): void {
    const { openModal, closeModal } = modalStore
    const { id } = user

    openModal({
      view: markRaw(ConfirmDeleteModal),
      properties: {
        title: t('administration.users.single.delete-account.modal-title'),
        action: t('actions.disable-account'),
        close: closeModal,
        callback: async (): Promise<void> => {
          await api
            .deleteUser(id)
            .then((value: UserDto) => {
              if (success) success(value)
              showSuccessToast('administration.users.single.delete-account.success')
              closeModal()
            })
            .catch(showErrorToast)
        }
      }
    })
  }

  function uploadAvatar(user: UserDto, success?: (value: UserDto) => void | Promise<void>): void {
    const { openModal, closeModal } = modalStore
    const { id } = user

    openModal({
      view: markRaw(UploadImageModal),
      properties: {
        title: t('administration.users.single.avatar.title'),
        action: t('actions.update-avatar'),
        callback: async ({ image }: { image: File }): Promise<void> => {
          await api.profile
            .updateAvatar(id, image)
            .then((value: UserDto) => {
              if (success) success(value)
              showSuccessToast('administration.users.single.avatar.success')
              closeModal()
            })
            .catch(showErrorToast)
        }
      }
    })
  }

  function removeAvatar(user: UserDto, success?: (value: UserDto) => void | Promise<void>): void {
    const { openModal, closeModal } = modalStore

    openModal({
      view: markRaw(ConfirmModal),
      properties: {
        title: t('administration.users.single.remove-avatar.title'),
        body: t('administration.users.single.remove-avatar.body'),
        action: t('actions.remove-avatar'),
        close: closeModal,
        callback: async (): Promise<void> => {
          await api.profile
            .removeAvatar(user.id)
            .then((value: UserDto) => {
              if (success) success(value)
              showSuccessToast('administration.users.single.remove-avatar.success')
              closeModal()
            })
            .catch(showErrorToast)
        }
      }
    })
  }

  return { getById, getPaginated, update, remove, uploadAvatar, removeAvatar }
}
