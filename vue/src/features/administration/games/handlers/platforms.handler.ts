import { AxiosError } from 'axios'
import { markRaw } from 'vue'

import NewPlatformModal from '../components/new-platform.component.vue'

import { PaginationOptions, PaginationDto, PaginationMeta } from '@/core/apis/dto/pagination.dto'
import { PlatformDto, icreateplatform, CreatePlatformDto } from '@/core/apis/dto/platform.dto'
import { LocalhostAPI } from '@/core/apis/localhost/localhost.api'
import { ModalStore, useModalStore } from '@/core/store/modal.store'
import { ToastStore, useToastStore } from '@/core/store/toast.store'

export function usePlatformAdminHandler(t: (key: string) => string): {
  create: (success?: (value: PlatformDto) => void | Promise<void>) => void
  getPaginated: (params: PaginationOptions) => Promise<PaginationDto<PlatformDto>>
} {
  const toastStore: ToastStore = useToastStore()
  const modalStore: ModalStore = useModalStore()

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
        callback: async (values: icreateplatform) => {
          await api
            .create(new CreatePlatformDto(values))
            .then((value: PlatformDto) => {
              if (success) success(value)
              showSuccessToast('administration.games-and-software.games.create.success')
              closeModal()
            })
            .catch(showErrorToast)
        }
      }
    })
  }

  async function getPaginated(params: PaginationOptions): Promise<PaginationDto<PlatformDto>> {
    return api.getPaginated(params).catch((error: AxiosError) => {
      showErrorToast(error)
      return { data: [], meta: new PaginationMeta({ pageOptions: params, itemCount: 0 }) }
    })
  }

  return { create, getPaginated }
}
