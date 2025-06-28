import { markRaw } from 'vue'
import { AxiosError } from 'axios'

import { GameDto, icreategame, CreateGameDto } from '@/core/apis/dto/game.dto'
import { PaginationOptions, PaginationDto, PaginationMeta } from '@/core/apis/dto/pagination.dto'
import { LocalhostAPI } from '@/core/apis/localhost/localhost.api'
import { ModalStore, useModalStore } from '@/core/store/modal.store'
import { ToastStore, useToastStore } from '@/core/store/toast.store'

import ConfirmDeleteModal from '@/shared/components/modal/permanently-delete.component.vue'

import NewGameModal from '../components/game.component.vue'

export function useGameAdminHandler(t: (key: string) => string): {
  create: (success?: (value: GameDto) => void | Promise<void>) => void
  getPaginated: (params: PaginationOptions) => Promise<PaginationDto<GameDto>>
  update: (game: GameDto, success?: (value: GameDto) => void | Promise<void>) => void
  remove: (game: GameDto, success?: (value: GameDto) => void | Promise<void>) => void
} {
  const toastStore: ToastStore = useToastStore()
  const modalStore: ModalStore = useModalStore()

  const api = LocalhostAPI.administration.games

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

  function create(success?: (value: GameDto) => void | Promise<void>): void {
    const { openModal, closeModal } = modalStore

    openModal({
      view: markRaw(NewGameModal),
      properties: {
        callback: async (values: icreategame): Promise<void> => {
          await api
            .create(new CreateGameDto(values))
            .then((value: GameDto) => {
              if (success) success(value)
              showSuccessToast('administration.games-and-software.games.create.success')
              closeModal()
            })
            .catch(showErrorToast)
        }
      }
    })
  }

  async function getPaginated(params: PaginationOptions): Promise<PaginationDto<GameDto>> {
    return api.getGamesPaginated(params).catch((error: AxiosError) => {
      showErrorToast(error)
      return { data: [], meta: new PaginationMeta({ pageOptions: params, itemCount: 0 }) }
    })
  }

  function update(_: GameDto, _a?: (value: GameDto) => void | Promise<void>): void {
    // const { openModal, closeModal } = modalStore
    // const { id } = game
    // openModal({
    //   view: markRaw(NewGameModal),
    //   properties: {
    //     game: game,
    //     callback: async (values: icreategame): Promise<void> => {
    //       // await api
    //       //   .update(id, new CreateGameDto(values))
    //       //   .then((value: GameDto) => {
    //       //     if (success) success(value)
    //       //     showSuccessToast('administration.games-and-software.games.delete.success')
    //       //     closeModal()
    //       //   })
    //       //   .catch(showErrorToast)
    //     }
    //   }
    // })
  }

  function remove(game: GameDto, success?: (value: GameDto) => void | Promise<void>): void {
    const { openModal, closeModal } = modalStore
    const { id } = game

    openModal({
      view: markRaw(ConfirmDeleteModal),
      properties: {
        title: t('administration.games-and-software.games.delete.title'),
        action: t('administration.games-and-software.games.delete.action'),
        close: closeModal,
        callback: async (): Promise<void> => {
          await api
            .delete(id)
            .then((value: GameDto) => {
              if (success) success(value)
              showSuccessToast('administration.games-and-software.games.delete.success')
              closeModal()
            })
            .catch(showErrorToast)
        }
      }
    })
  }

  return { create, getPaginated, update, remove }
}
