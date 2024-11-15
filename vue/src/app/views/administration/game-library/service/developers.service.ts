import { AxiosError } from 'axios'
import { markRaw } from 'vue'

import { PaginationOptions, PaginationDto, PaginationMeta } from '@/library/data/dto/pagination.dto'
import { LocalhostAPI } from '@/library/apis/localhost/localhost.api'
import { ToastStore, useToastStore } from '@/app/components/toast/store/toast.store'
import { CreateDeveloperDto, DeveloperDto, ideveloper } from '@/library/data/dto/games/developer.dto'
import { ModalStore, useModalStore } from '@/app/components/modal/store/modal.store'

import DeveloperModal from '../components/modals/developer.modal.vue'
import ConfirmModal from '@/app/components/modal/templates/confirm.modal.vue'

class DeveloperService {
  public static create(success?: (value: DeveloperDto) => void): void {
    const { openModal, closeModal }: ModalStore = useModalStore()
    const { addToast }: ToastStore = useToastStore()

    openModal({
      view: markRaw(DeveloperModal),
      properties: {
        title: 'administration.game-library.developers.create.title',
        action: 'actions.create-developer',
        callback: async (values: ideveloper) => {
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
        title: 'administration.game-library.developers.update.title',
        action: 'actions.update-developer',
        developer,
        callback: async (values: ideveloper) => {
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
        item: developer.name,
        title: 'administration.game-library.developers.delete.title',
        body: 'administration.game-library.developers.delete.body',
        action: 'actions.delete-developer'
      }
    })
  }
}

export { DeveloperService }
