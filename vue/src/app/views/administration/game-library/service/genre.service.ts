import { AxiosError } from 'axios'

import { PaginationOptions, PaginationDto, PaginationMeta } from '@/library/data/dto/pagination.dto'
import { LocalhostAPI } from '@/library/apis/localhost/localhost.api'
import { ToastStore, useToastStore } from '@/app/components/toast/store/toast.store'
import { ModalStore, useModalStore } from '@/app/components/modal/store/modal.store'
import { markRaw } from 'vue'

import GenreModal from '../components/modals/genre.modal.vue'
import ConfirmModal from '@/app/components/modal/templates/confirm.modal.vue'
import { GenreDto, CreateGenreDto, igenre } from '@/library/data/dto/games/genre.dto'

class GenreService {
  public static create(success?: (value: GenreDto) => void): void {
    const { openModal, closeModal }: ModalStore = useModalStore()
    const { addToast }: ToastStore = useToastStore()

    openModal({
      view: markRaw(GenreModal),
      properties: {
        title: 'administration.game-library.genres.create.title',
        action: 'actions.create-genre',
        callback: async (values: igenre) => {
          await LocalhostAPI.administration.game_library.genres
            .create(new CreateGenreDto(values))
            .then((value: GenreDto) => {
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

  public static update(genre: GenreDto, success?: (value: GenreDto) => void): void {
    const { openModal, closeModal }: ModalStore = useModalStore()
    const { addToast }: ToastStore = useToastStore()

    openModal({
      view: markRaw(GenreModal),
      properties: {
        genre,
        title: 'administration.game-library.genres.update.title',
        action: 'actions.update-genre',
        callback: async (values: igenre) => {
          await LocalhostAPI.administration.game_library.genres
            .update(genre.id, new CreateGenreDto(values))
            .then((value: GenreDto) => {
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

  public static async getPaginated(params: PaginationOptions): Promise<PaginationDto<GenreDto>> {
    const { addToast }: ToastStore = useToastStore()
    return LocalhostAPI.administration.game_library.genres.getPaginated(params).catch((error: AxiosError) => {
      addToast({ title: error.response?.statusText || 'ERROR', body: error.message, options: { theme: 'danger' } })
      return { data: [], meta: new PaginationMeta({ pageOptions: params, itemCount: 0 }) }
    })
  }

  public static async getAll(): Promise<Array<GenreDto>> {
    const { addToast }: ToastStore = useToastStore()
    return LocalhostAPI.administration.game_library.genres.getAll().catch((error: AxiosError) => {
      addToast({ title: error.response?.statusText || 'ERROR', body: error.message, options: { theme: 'danger' } })
      return []
    })
  }

  public static remove(genre: GenreDto, success?: (value: GenreDto) => void): void {
    const { openModal, closeModal }: ModalStore = useModalStore()
    const { addToast }: ToastStore = useToastStore()

    openModal({
      view: markRaw(ConfirmModal),
      properties: {
        close: closeModal,
        callback: async (): Promise<void> => {
          await LocalhostAPI.administration.game_library.genres
            .remove(genre.id)
            .then((value: GenreDto) => {
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
        item: genre.name,
        title: 'administration.game-library.genres.delete.title',
        body: 'administration.game-library.genres.delete.body',
        action: 'actions.delete-genre'
      }
    })
  }
}

export { GenreService }
