import { AxiosError } from 'axios'
import { markRaw } from 'vue'

import { PaginationOptions, PaginationDto, PaginationMeta } from '@/library/dto/pagination.dto'
import { PlatformDto, icreateplatform, CreatePlatformDto } from '@/library/dto/platform.dto'
import { LocalhostAPI } from '@/core/apis/localhost/localhost.api'
import { ModalStore, useModalStore } from '@/core/store/modal.store'
import { ToastStore, useToastStore } from '@/core/store/toast.store'

import ConfirmDeleteModal from '@/shared/components/modal/permanently-delete.component.vue'
import NewPlatformModal from '../components/platform.component.vue'
import { AppStore, useAppStore } from '@/core/store/app.store'

export function usePlatformAdminHandler(t: (key: string) => string): {
  create: (success?: (value: PlatformDto) => void | Promise<void>) => void
  paginate: (params: PaginationOptions) => Promise<PaginationDto<PlatformDto>>
  update: (platform: PlatformDto, success?: (value: PlatformDto) => void | Promise<void>) => void
  remove(platform: PlatformDto, success?: (value: PlatformDto) => void | Promise<void>): void
} {
  const toastStore: ToastStore = useToastStore()
  const modalStore: ModalStore = useModalStore()
  const appStore: AppStore = useAppStore()

  const api = LocalhostAPI.administration.platforms

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

  function create(success?: (value: PlatformDto) => void | Promise<void>): void {
    const { openModal, closeModal } = modalStore

    openModal({
      view: markRaw(NewPlatformModal),
      properties: {
        title: 'administration.games-and-software.platforms.create.title',
        callback: async (values: icreateplatform) => {
          const token = await appStore.getValidAccessToken()
          if (!token) throw new Error('Could not get valid access token')

          await api
            .create(new CreatePlatformDto(values), token)
            .then((value: PlatformDto) => {
              if (success) success(value)
              showSuccessToast('administration.games-and-software.platforms.create.success')
              closeModal()
            })
            .catch(showErrorToast)
        }
      }
    })
  }

  async function paginate(params: PaginationOptions): Promise<PaginationDto<PlatformDto>> {
    const token = await appStore.getValidAccessToken()
    if (!token) throw new Error('Could not get valid access token')

    return api.getPaginated(params, token).catch((error: AxiosError) => {
      showErrorToast(error)
      return { data: [], meta: new PaginationMeta({ pageOptions: params, itemCount: 0 }) }
    })
  }

  function update(platform: PlatformDto, success?: (value: PlatformDto) => void | Promise<void>): void {
    const { openModal, closeModal } = modalStore
    const { id } = platform

    openModal({
      view: markRaw(NewPlatformModal),
      properties: {
        platform,
        title: 'administration.games-and-software.platforms.update.title',
        callback: async (values: icreateplatform) => {
          const token = await appStore.getValidAccessToken()
          if (!token) throw new Error('Could not get valid access token')

          await api
            .update(id, new CreatePlatformDto(values), token)
            .then((value: PlatformDto) => {
              if (success) success(value)
              showSuccessToast('administration.games-and-software.platforms.update.success')
              closeModal()
            })
            .catch(showErrorToast)
        }
      }
    })
  }

  function remove(platform: PlatformDto, success?: (value: PlatformDto) => void | Promise<void>): void {
    const { openModal, closeModal } = modalStore

    openModal({
      view: markRaw(ConfirmDeleteModal),
      properties: {
        title: t('administration.games-and-software.platforms.delete.title'),
        action: t('actions.save-changes'),
        close: closeModal,
        callback: async () => {
          const token = await appStore.getValidAccessToken()
          if (!token) throw new Error('Could not get valid access token')

          await api
            .delete(platform.id, token)
            .then((value: PlatformDto) => {
              if (success) success(value)
              showSuccessToast('administration.games-and-software.platforms.delete.success')
              closeModal()
            })
            .catch(showErrorToast)
        }
      }
    })
  }

  return { create, paginate, remove, update }
}
