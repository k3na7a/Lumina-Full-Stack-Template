import { AxiosError } from 'axios'
import { markRaw } from 'vue'

import { PaginationOptions, PaginationDto, PaginationMeta } from '@/library/data/dto/pagination.dto'
import { LocalhostAPI } from '@/library/apis/localhost/localhost.api'
import { ToastStore, useToastStore } from '@/app/components/toast/store/toast.store'
import { CreatePublisherDto, ipublisher, PublisherDto } from '@/library/data/dto/games/publisher.dto'
import { ModalStore, useModalStore } from '@/app/components/modal/store/modal.store'

import PublisherModal from '../components/modals/publisher.modal.vue'
import ConfirmModal from '@/app/components/modal/templates/confirm.modal.vue'

class PublisherService {
  public static create(success?: (value: PublisherDto) => void): void {
    const { openModal, closeModal }: ModalStore = useModalStore()
    const { addToast }: ToastStore = useToastStore()

    openModal({
      view: markRaw(PublisherModal),
      properties: {
        title: 'administration.game-library.publishers.create.title',
        action: 'actions.update-publisher',
        callback: async (values: ipublisher) => {
          await LocalhostAPI.administration.game_library.publishers
            .create(new CreatePublisherDto(values))
            .then((value: PublisherDto) => {
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

  public static update(publisher: PublisherDto, success?: (value: PublisherDto) => void): void {
    const { openModal, closeModal }: ModalStore = useModalStore()
    const { addToast }: ToastStore = useToastStore()

    openModal({
      view: markRaw(PublisherModal),
      properties: {
        title: 'administration.game-library.publishers.update.title',
        action: 'actions.update-publisher',
        publisher,
        callback: async (values: ipublisher) => {
          await LocalhostAPI.administration.game_library.publishers
            .update(publisher.id, new CreatePublisherDto(values))
            .then((value: PublisherDto) => {
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

  public static async getPaginated(params: PaginationOptions): Promise<PaginationDto<PublisherDto>> {
    const { addToast }: ToastStore = useToastStore()
    return LocalhostAPI.administration.game_library.publishers.getPaginated(params).catch((error: AxiosError) => {
      addToast({ title: error.response?.statusText || 'ERROR', body: error.message, options: { theme: 'danger' } })
      return { data: [], meta: new PaginationMeta({ pageOptions: params, itemCount: 0 }) }
    })
  }

  public static async getAll(): Promise<Array<PublisherDto>> {
    const { addToast }: ToastStore = useToastStore()
    return LocalhostAPI.administration.game_library.publishers.getAll().catch((error: AxiosError) => {
      addToast({ title: error.response?.statusText || 'ERROR', body: error.message, options: { theme: 'danger' } })
      return []
    })
  }

  public static remove(publisher: PublisherDto, success?: (value: PublisherDto) => void): void {
    const { openModal, closeModal }: ModalStore = useModalStore()
    const { addToast }: ToastStore = useToastStore()

    openModal({
      view: markRaw(ConfirmModal),
      properties: {
        close: closeModal,
        callback: async (): Promise<void> => {
          await LocalhostAPI.administration.game_library.publishers
            .remove(publisher.id)
            .then((value: PublisherDto) => {
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
        item: publisher.name,
        title: 'administration.game-library.publishers.delete.title',
        body: 'administration.game-library.publishers.delete.body',
        action: 'actions.delete-publisher'
      }
    })
  }
}

export { PublisherService }
