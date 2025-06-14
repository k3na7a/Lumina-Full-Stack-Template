import { markRaw } from 'vue'
import { AxiosError } from 'axios'

import { ToastStore, useToastStore } from '@/app/store/toast.store'
import { LocalhostAPI } from '@/library/apis/localhost/localhost.api'
import { ModalStore, useModalStore } from '@/app/store/modal.store'
import { PaginationDto, PaginationMeta, PaginationOptions } from '@/library/apis/localhost/dto/pagination.dto'
import { CreateGameDto, GameDto, icreategame } from '@/library/apis/localhost/dto/game.dto'

import NewGameModal from '@/app/views/administration/games/components/new-game.component.vue'
import ConfirmDeleteModal from '@/app/components/modal/templates/permanently-delete.component.vue'

class GamesAdminController {
  private readonly modalStore: ModalStore = useModalStore()
  private readonly toastStore: ToastStore = useToastStore()

  private readonly $api = LocalhostAPI.administration.games
  private readonly $t: (key: string) => string

  private readonly debug: boolean = false

  constructor(t: (key: string) => string) {
    this.$t = t
  }

  public readonly getGamesPaginated = async (params: PaginationOptions): Promise<PaginationDto<GameDto>> => {
    const { addToast } = this.toastStore

    const t = this.$t
    const api = this.$api

    return api
      .getGamesPaginated(params)
      .then((response: PaginationDto<GameDto>) => {
        this.debug && console.log(`[Axios] GET /games (paginated) request succeeded`)
        return response
      })
      .catch((error: AxiosError) => {
        this.debug && console.warn(`[Axios] Failed to GET /games (paginated) : ${error.message}`)
        addToast({
          title: t('forms.error-general'),
          body: error.message,
          options: { theme: 'danger' }
        })
        return { data: [], meta: new PaginationMeta({ pageOptions: params, itemCount: 0 }) }
      })
  }

  public readonly create = (success?: (value: GameDto) => void | Promise<void>): void => {
    const { openModal, closeModal } = this.modalStore
    const { addToast } = this.toastStore

    const t = this.$t
    const api = this.$api

    openModal({
      view: markRaw(NewGameModal),
      properties: {
        callback: async (values: icreategame) => {
          await api
            .create(new CreateGameDto(values))
            .then((value: GameDto) => {
              this.debug && console.log(`[Axios] PUT /games request succeeded`)
              if (success) success(value)
              addToast({
                title: t('forms.success-general'),
                body: t('administration.games-and-software.games.create.success'),
                options: { theme: 'success' }
              })
              closeModal()
            })
            .catch((error: AxiosError) => {
              this.debug && console.warn(`[Axios] Failed to PUT /games : ${error.message}`)
              addToast({
                title: t('forms.error-general'),
                body: error.message,
                options: { theme: 'danger' }
              })
            })
        }
      }
    })
  }

  public readonly delete = (game: GameDto, success?: (value: GameDto) => void | Promise<void>): void => {
    const { openModal, closeModal } = this.modalStore
    const { addToast } = this.toastStore
    const { id } = game

    const t = this.$t
    const api = this.$api

    openModal({
      view: markRaw(ConfirmDeleteModal),
      properties: {
        title: t('administration.users.single.delete-account.modal-title'),
        action: t('actions.disable-account'),
        close: closeModal,
        callback: async (): Promise<void> => {
          await api
            .delete(id)
            .then((value: GameDto) => {
              this.debug && console.log(`[Axios] DELETE /user ID ${id} request succeeded`)
              if (success) success(value)
              addToast({
                title: t('forms.success-general'),
                body: t('administration.users.single.delete-account.success'),
                options: { theme: 'success' }
              })
              closeModal()
            })
            .catch((error: AxiosError) => {
              this.debug && console.warn(`[Axios] Failed to DELETE user ID ${id}: ${error.message}`)
              addToast({
                title: t('forms.error-general'),
                body: error.message,
                options: { theme: 'danger' }
              })
            })
        }
      }
    })
  }
}

export { GamesAdminController }
