import { AxiosError } from 'axios'
import { markRaw } from 'vue'

import { ToastStore, useToastStore } from '@/core/store/toast.store'
import { ModalStore, useModalStore } from '@/core/store/modal.store'

import ConfirmDeleteModal from '@/shared/components/modal/permanently-delete.component.vue'
import NewPermissionModal from '../components/permission.component.vue'

import { PaginationOptions, PaginationDto, PaginationMeta } from '@lib/dto/pagination.dto'
import { LocalhostAPI } from '@/core/apis/localhost/localhost.api'
import { AppStore, useAppStore } from '@/core/store/app.store'
import { CreatePermissionDto, iCreatePermission, PermissionDto } from '@lib/dto/permission.dto'

export function usePermissionAdminHandler(t: (key: string) => string): {
  create: (success?: (value: PermissionDto) => void | Promise<void>) => void
  getById: (id: string) => Promise<PermissionDto>
  getPaginated: (params: PaginationOptions) => Promise<PaginationDto<PermissionDto>>
  update(permission: PermissionDto, success?: (value: PermissionDto) => void): void
  remove: (permission: PermissionDto, success?: (value: PermissionDto) => void | Promise<void>) => void
} {
  const toastStore: ToastStore = useToastStore()
  const modalStore: ModalStore = useModalStore()
  const appStore: AppStore = useAppStore()

  const api = LocalhostAPI.administration.permissions

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

  function create(success?: (value: PermissionDto) => void | Promise<void>): void {
    const { openModal, closeModal } = modalStore
    openModal({
      view: markRaw(NewPermissionModal),
      properties: {
        title: 'administration.user-management.permissions.create.title',
        callback: async (values: iCreatePermission): Promise<void> => {
          const token = await appStore.getValidAccessToken()
          if (!token) throw new Error('Could not get valid access token')
          await api
            .create(new CreatePermissionDto(values), token)
            .then((value: PermissionDto) => {
              if (success) success(value)
              showSuccessToast('administration.user-management.permissions.create.success')
              closeModal()
            })
            .catch(showErrorToast)
        }
      }
    })
  }

  async function getById(id: string): Promise<PermissionDto> {
    const token = await appStore.getValidAccessToken()
    if (!token) throw new Error('Could not get valid access token')

    return api.getById(id, token)
  }

  async function getPaginated(params: PaginationOptions): Promise<PaginationDto<PermissionDto>> {
    const token = await appStore.getValidAccessToken()
    if (!token) throw new Error('Could not get valid access token')

    return api.getPaginated(params, token).catch((error: AxiosError) => {
      showErrorToast(error)
      return { data: [], meta: new PaginationMeta({ pageOptions: params, itemCount: 0 }) }
    })
  }

  function update(permission: PermissionDto, success?: (value: PermissionDto) => void): void {
    const { openModal, closeModal } = modalStore
    const { id } = permission
    openModal({
      view: markRaw(NewPermissionModal),
      properties: {
        permission,
        title: 'administration.user-management.permissions.update.title',
        callback: async (values: iCreatePermission): Promise<void> => {
          const token = await appStore.getValidAccessToken()
          if (!token) throw new Error('Could not get valid access token')
          await api
            .update(id, new CreatePermissionDto(values), token)
            .then((value: PermissionDto) => {
              if (success) success(value)
              showSuccessToast('administration.user-management.permissions.update.success')
              closeModal()
            })
            .catch(showErrorToast)
        }
      }
    })
  }

  function remove(role: PermissionDto, success?: (value: PermissionDto) => void | Promise<void>): void {
    const { openModal, closeModal } = modalStore
    const { id } = role

    openModal({
      view: markRaw(ConfirmDeleteModal),
      properties: {
        title: t('administration.user-management.permissions.delete.title'),
        action: t('actions.save-changes'),
        close: closeModal,
        callback: async (): Promise<void> => {
          const token = await appStore.getValidAccessToken()
          if (!token) throw new Error('Could not get valid access token')

          await api
            .remove(id, token)
            .then((value: PermissionDto) => {
              if (success) success(value)
              showSuccessToast('administration.user-management.permissions.delete.success')
              closeModal()
            })
            .catch(showErrorToast)
        }
      }
    })
  }

  return { getById, getPaginated, update, remove, create }
}
