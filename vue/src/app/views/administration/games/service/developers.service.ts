import { AxiosError } from 'axios'
import { markRaw } from 'vue'

import { PaginationOptions, PaginationDto, PaginationMeta } from '@/library/data/dto/pagination.dto'
import { LocalhostAPI } from '@/library/utilities/apis/localhost/localhost.api'
import { ToastStore, useToastStore } from '@/library/components/toast/store/toast.store'
import { CreateDeveloperDto, DeveloperDto } from '@/library/data/dto/games/developer.dto'
import { ModalStore, useModalStore } from '@/library/components/modal/store/modal.store'

import DeveloperModal from '../components/developer.modal.vue'
import ConfirmModal from '@/library/components/modal/templates/confirm.modal.vue'

class DeveloperService {
  public static create(success?: (value: DeveloperDto) => void): void {
    const { openModal, closeModal }: ModalStore = useModalStore()
    const { addToast }: ToastStore = useToastStore()

    openModal({
      view: markRaw(DeveloperModal),
      properties: {
        title: 'Create new Developer',
        action: 'Create Developer',
        callback: async (values: any) => {
          await LocalhostAPI.administration.game_library.developers
            .create(new CreateDeveloperDto(values))
            .then((value: DeveloperDto) => {
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

  public static update(developer: DeveloperDto, success?: (value: DeveloperDto) => void): void {
    const { openModal, closeModal }: ModalStore = useModalStore()
    const { addToast }: ToastStore = useToastStore()

    openModal({
      view: markRaw(DeveloperModal),
      properties: {
        title: `Update ${developer.name}`,
        action: 'Update Developer',
        developer,
        callback: async (values: any) => {
          await LocalhostAPI.administration.game_library.developers
            .update(developer.id, new CreateDeveloperDto(values))
            .then((value: DeveloperDto) => {
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

  public static async getPaginated(params: PaginationOptions): Promise<PaginationDto<DeveloperDto>> {
    const { addToast }: ToastStore = useToastStore()
    return LocalhostAPI.administration.game_library.developers.getPaginated(params).catch((error: AxiosError) => {
      addToast({ title: error.response?.statusText || 'ERROR', body: error.message, options: { theme: 'danger' } })
      return { data: [], meta: new PaginationMeta({ pageOptions: params, itemCount: 0 }) }
    })
  }

  public static async getAll(): Promise<Array<DeveloperDto>> {
    const { addToast }: ToastStore = useToastStore()
    return LocalhostAPI.administration.game_library.developers.getAll().catch((error: AxiosError) => {
      addToast({ title: error.response?.statusText || 'ERROR', body: error.message, options: { theme: 'danger' } })
      return []
    })
  }

  public static remove(developer: DeveloperDto, success?: (value: DeveloperDto) => void): void {
    const { openModal, closeModal }: ModalStore = useModalStore()
    const { addToast }: ToastStore = useToastStore()

    openModal({
      view: markRaw(ConfirmModal),
      properties: {
        close: closeModal,
        callback: async (): Promise<void> => {
          await LocalhostAPI.administration.game_library.developers
            .remove(developer.id)
            .then((value: DeveloperDto) => {
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
        title: `Remove ${developer.name}`,
        body: `Are you sure you want to remove ${developer.name}?`,
        action: 'Remove Genre'
      }
    })
  }
}

export { DeveloperService }
