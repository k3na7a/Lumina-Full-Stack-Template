import { AxiosError } from 'axios'
import { markRaw } from 'vue'

import { PaginationOptions, PaginationDto, PaginationMeta } from '@/library/data/dto/pagination.dto'
import { LocalhostAPI } from '@/library/utilities/apis/localhost/localhost.api'
import { ToastStore, useToastStore } from '@/library/components/toast/store/toast.store'
import { CreatePublisherDto, PublisherDto } from '@/library/data/dto/games/publisher.dto'
import { ModalStore, useModalStore } from '@/library/components/modal/store/modal.store'

import PublisherModal from '../components/publisher.modal.vue'
import ConfirmModal from '@/library/components/modal/templates/confirm.modal.vue'

class PublisherService {
  public static create(success?: (value: PublisherDto) => void): void {
    const { openModal, closeModal }: ModalStore = useModalStore()
    const { addToast }: ToastStore = useToastStore()

    openModal({
      view: markRaw(PublisherModal),
      properties: {
        title: 'Create new Publisher',
        action: 'Create Publisher',
        callback: async (values: any) => {
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
        title: `Update ${publisher.name}`,
        action: 'Update Publisher',
        publisher,
        callback: async (values: any) => {
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
        title: `Remove ${publisher.name}`,
        body: `Are you sure you want to remove ${publisher.name}?`,
        action: 'Remove Genre'
      }
    })
  }
}

export { PublisherService }
