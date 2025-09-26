import { AxiosError } from 'axios'
import { markRaw } from 'vue'

import { ToastStore, useToastStore } from '@/core/store/toast.store'
import { ModalStore, useModalStore } from '@/core/store/modal.store'

import ConfirmDeleteModal from '@/shared/components/modal/permanently-delete.component.vue'

import { PaginationOptions, PaginationDto, PaginationMeta } from '@lib/dto/pagination.dto'
import { LocalhostAPI } from '@/core/apis/localhost/localhost.api'
import { AppStore, useAppStore } from '@/core/store/app.store'
import { CreateRoleDto, iCreateRole, RoleDto } from '@lib/dto/role.dto'

import NewRoleModal from '../components/role.component.vue'
import JSONDetailsModal from '@/shared/components/modal/JSON-details.modal.vue'

export function useRoleAdminHandler(t: (key: string) => string): {
  create: (success?: (value: RoleDto) => void | Promise<void>) => void
  getById: (id: string) => Promise<RoleDto>
  getPaginated: (params: PaginationOptions) => Promise<PaginationDto<RoleDto>>
  update(role: RoleDto, success?: (value: RoleDto) => void): void
  remove: (role: RoleDto, success?: (value: RoleDto) => void | Promise<void>) => void
  view: (value: RoleDto) => void
} {
  const toastStore: ToastStore = useToastStore()
  const modalStore: ModalStore = useModalStore()
  const appStore: AppStore = useAppStore()

  const api = LocalhostAPI.administration.roles

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

  function create(success?: (value: RoleDto) => void | Promise<void>): void {
    const { openModal, closeModal } = modalStore
    openModal({
      view: markRaw(NewRoleModal),
      properties: {
        title: 'administration.user-management.roles.create.title',
        callback: async (values: iCreateRole): Promise<void> => {
          const token = await appStore.getValidAccessToken()
          if (!token) throw new Error('Could not get valid access token')
          await api
            .create(new CreateRoleDto(values), token)
            .then((value: RoleDto) => {
              if (success) success(value)
              showSuccessToast('administration.user-management.roles.create.success')
              closeModal()
            })
            .catch(showErrorToast)
        }
      }
    })
  }

  function view(value: RoleDto): void {
    const { openModal } = modalStore

    openModal({
      view: markRaw(JSONDetailsModal),
      properties: {
        item: value.raw,
        title: 'administration.user-management.roles.view.title'
      }
    })
  }

  async function getById(id: string): Promise<RoleDto> {
    const token = await appStore.getValidAccessToken()
    if (!token) throw new Error('Could not get valid access token')

    return api.getById(id, token)
  }

  async function getPaginated(params: PaginationOptions): Promise<PaginationDto<RoleDto>> {
    const token = await appStore.getValidAccessToken()
    if (!token) throw new Error('Could not get valid access token')

    return api.getPaginated(params, token).catch((error: AxiosError) => {
      showErrorToast(error)
      return { data: [], meta: new PaginationMeta({ pageOptions: params, itemCount: 0 }) }
    })
  }

  function update(role: RoleDto, success?: (value: RoleDto) => void): void {
    const { openModal, closeModal } = modalStore
    const { id } = role
    openModal({
      view: markRaw(NewRoleModal),
      properties: {
        role,
        title: 'administration.user-management.roles.update.title',
        callback: async (values: iCreateRole): Promise<void> => {
          const token = await appStore.getValidAccessToken()
          if (!token) throw new Error('Could not get valid access token')
          await api
            .update(id, new CreateRoleDto(values), token)
            .then((value: RoleDto) => {
              if (success) success(value)
              showSuccessToast('administration.user-management.roles.update.success')
              closeModal()
            })
            .catch(showErrorToast)
        }
      }
    })
  }

  function remove(role: RoleDto, success?: (value: RoleDto) => void | Promise<void>): void {
    const { openModal, closeModal } = modalStore
    const { id } = role

    openModal({
      view: markRaw(ConfirmDeleteModal),
      properties: {
        title: t('administration.user-management.roles.delete.title'),
        action: t('actions.save-changes'),
        close: closeModal,
        callback: async (): Promise<void> => {
          const token = await appStore.getValidAccessToken()
          if (!token) throw new Error('Could not get valid access token')

          await api
            .remove(id, token)
            .then((value: RoleDto) => {
              if (success) success(value)
              showSuccessToast('administration.user-management.roles.delete.success')
              closeModal()
            })
            .catch(showErrorToast)
        }
      }
    })
  }

  return { getById, getPaginated, update, remove, create, view }
}
