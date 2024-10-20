import { PaginationOptions, PaginationDto, PaginationMeta } from '@/library/data/dto/pagination.dto'
import { LocalhostAPI } from '@/library/utilities/apis/localhost/localhost.api'
import { ModalStore, useModalStore } from '@/library/components/modal/store/modal.store'
import { ToastStore, useToastStore } from '@/library/components/toast/store/toast.store'

import { AxiosError } from 'axios'
import { markRaw } from 'vue'

import GameModal from '../components/game.modal.vue'
import ConfirmModal from '@/library/components/modal/templates/confirm.modal.vue'
import { igame, CreateGameDto, GameDto } from '@/library/data/dto/games/game.dto'

class GameService {
  public static create(success?: (value: any) => void): void {
    const { openModal, closeModal }: ModalStore = useModalStore()
    const { addToast }: ToastStore = useToastStore()

    openModal({
      view: markRaw(GameModal),
      properties: {
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

  public static async getPaginated(params: PaginationOptions): Promise<PaginationDto<GameDto>> {
    const { addToast }: ToastStore = useToastStore()
    return LocalhostAPI.administration.game_library.games.getPaginated(params).catch((error: AxiosError) => {
      addToast({ title: error.response?.statusText || 'ERROR', body: error.message, options: { theme: 'danger' } })
      return { data: [], meta: new PaginationMeta({ pageOptions: params, itemCount: 0 }) }
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
        title: `Remove ${game.name}`,
        body: `Are you sure you want to remove ${game.name}?`,
        action: 'Remove Game'
      }
    })
  }
}

export { GameService }
