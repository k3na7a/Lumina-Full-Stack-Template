import { AxiosError } from 'axios'

import { CreateSeriesDto, SeriesDto } from '@/library/apis/localhost/dto/game-library.dto'
import { PaginationOptions, PaginationDto, PaginationMeta } from '@/library/apis/localhost/dto/pagination.dto'
import { LocalhostAPI } from '@/library/apis/localhost/localhost.api'
import { ToastStore, useToastStore } from '@/app/store/toast.store'
import { ModalStore, useModalStore } from '@/app/store/modal.store'
import { markRaw } from 'vue'

import ConfirmModal from '@/app/components/modal/confirm.modal.vue'
import SeriesModal from '../components/series.modal.vue'

class SeriesService {
  public static create(success?: (value: SeriesDto) => void): void {
    const { openModal, closeModal }: ModalStore = useModalStore()
    const { addToast }: ToastStore = useToastStore()

    openModal({
      view: markRaw(SeriesModal),
      properties: {
        title: 'Create new Series',
        action: 'Create Series',
        callback: async (values: any) => {
          await LocalhostAPI.administration.game_library.series
            .create(new CreateSeriesDto(values))
            .then((value: SeriesDto) => {
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

  public static update(series: SeriesDto, success?: (value: SeriesDto) => void): void {
    const { openModal, closeModal }: ModalStore = useModalStore()
    const { addToast }: ToastStore = useToastStore()

    openModal({
      view: markRaw(SeriesModal),
      properties: {
        series,
        title: `Update ${series.name}`,
        action: `Update Series`,
        callback: async (values: any) => {
          await LocalhostAPI.administration.game_library.series
            .update(series.id, new CreateSeriesDto(values))
            .then((value: SeriesDto) => {
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

  public static async getPaginated(params: PaginationOptions): Promise<PaginationDto<SeriesDto>> {
    const { addToast }: ToastStore = useToastStore()
    return LocalhostAPI.administration.game_library.series.getPaginated(params).catch((error: AxiosError) => {
      addToast({ title: error.response?.statusText || 'ERROR', body: error.message, options: { theme: 'danger' } })
      return { data: [], meta: new PaginationMeta({ pageOptions: params, itemCount: 0 }) }
    })
  }

  public static async getAll(): Promise<Array<SeriesDto>> {
    const { addToast }: ToastStore = useToastStore()
    return LocalhostAPI.administration.game_library.series.getAll().catch((error: AxiosError) => {
      addToast({ title: error.response?.statusText || 'ERROR', body: error.message, options: { theme: 'danger' } })
      return []
    })
  }

  public static remove(series: SeriesDto, success?: (value: SeriesDto) => void): void {
    const { openModal, closeModal }: ModalStore = useModalStore()
    const { addToast }: ToastStore = useToastStore()

    openModal({
      view: markRaw(ConfirmModal),
      properties: {
        close: closeModal,
        callback: async (): Promise<void> => {
          await LocalhostAPI.administration.game_library.series
            .remove(series.id)
            .then((value: SeriesDto) => {
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
        title: `Remove ${series.name}`,
        body: `Are you sure you want to remove ${series.name}?`,
        action: 'Remove Series'
      }
    })
  }
}

export { SeriesService }
