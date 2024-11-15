import { PaginationOptions, PaginationDto, PaginationMeta } from '@/library/data/dto/pagination.dto'
import { LocalhostAPI } from '@/library/apis/localhost/localhost.api'
import { ModalStore, useModalStore } from '@/app/components/modal/store/modal.store'
import { ToastStore, useToastStore } from '@/app/components/toast/store/toast.store'

import { AxiosError } from 'axios'
import { markRaw } from 'vue'

import GameModal from '../components/modals/game.modal.vue'
import ConfirmModal from '@/app/components/modal/templates/confirm.modal.vue'
import ImageUploadModal from '@/app/components/modal/templates/image-upload.modal.vue'

import { igame, CreateGameDto, GameDto } from '@/library/data/dto/games/game.dto'

class GameService {
  public static updateCover = (game: GameDto, success?: (game: GameDto) => void): void => {
    const { openModal, closeModal }: ModalStore = useModalStore()
    const { addToast }: ToastStore = useToastStore()

    openModal({
      view: markRaw(ImageUploadModal),
      properties: {
        callback: async ({ image }: { image: File }): Promise<void> => {
          console.log(image)
          await LocalhostAPI.administration.game_library.games
            .updateCover(game.id, image)
            .then((val: GameDto) => {
              if (success) success(val)
              closeModal()
            })
            .catch((error: AxiosError) =>
              addToast({
                title: error.response?.statusText || 'ERROR',
                body: error.message,
                options: { theme: 'danger' }
              })
            )
        },
        item: game.name,
        title: 'administration.game-library.games.single.cover.modal-title',
        action: 'actions.update-cover'
      }
    })
  }

  public static create(success?: (value: any) => void): void {
    const { openModal, closeModal }: ModalStore = useModalStore()
    const { addToast }: ToastStore = useToastStore()

    openModal({
      view: markRaw(GameModal),
      properties: {
        title: 'administration.game-library.games.create.title',
        action: 'administration.game-library.games.create.action',
        callback: async (values: igame) => {
          await LocalhostAPI.administration.game_library.games
            .create(new CreateGameDto(values))
            .then((value: GameDto) => {
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

  public static async update(game_id: string, values: igame, success?: (value: GameDto) => void): Promise<void> {
    const { addToast }: ToastStore = useToastStore()

    await LocalhostAPI.administration.game_library.games
      .update(game_id, new CreateGameDto(values))
      .then((value: GameDto) => {
        if (success) success(value)
      })
      .catch((error: AxiosError) => {
        addToast({
          title: error.response?.statusText || 'ERROR',
          body: error.message,
          options: { theme: 'danger' }
        })
      })
  }

  public static async getPaginated(params: PaginationOptions): Promise<PaginationDto<GameDto>> {
    const { addToast }: ToastStore = useToastStore()
    return LocalhostAPI.administration.game_library.games.getPaginated(params).catch((error: AxiosError) => {
      addToast({ title: error.response?.statusText || 'ERROR', body: error.message, options: { theme: 'danger' } })
      return { data: [], meta: new PaginationMeta({ pageOptions: params, itemCount: 0 }) }
    })
  }

  public static async getSingle(slug: string, success?: (value: GameDto) => void): Promise<void> {
    const { addToast }: ToastStore = useToastStore()
    await LocalhostAPI.administration.game_library.games
      .findOne(slug)
      .then((value: GameDto) => {
        if (success) success(value)
      })
      .catch((error: AxiosError) => {
        addToast({ title: error.response?.statusText || 'ERROR', body: error.message, options: { theme: 'danger' } })
      })
  }

  public static remove(game: GameDto, success?: (value: GameDto) => void): void {
    const { openModal, closeModal }: ModalStore = useModalStore()
    const { addToast }: ToastStore = useToastStore()

    openModal({
      view: markRaw(ConfirmModal),
      properties: {
        close: closeModal,
        callback: async (): Promise<void> => {
          await LocalhostAPI.administration.game_library.games
            .remove(game.id)
            .then((value: GameDto) => {
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
        item: game.name,
        title: 'administration.game-library.games.single.delete.modal.title',
        body: 'administration.game-library.games.single.delete.modal.body',
        action: 'actions.delete-game'
      }
    })
  }
}

export { GameService }
