import { AxiosError } from 'axios'
import { markRaw } from 'vue'

import { PaginationOptions, PaginationDto, PaginationMeta } from '@/library/data/dto/pagination.dto'
import { LocalhostAPI } from '@/library/apis/localhost/localhost.api'
import { ToastStore, useToastStore } from '@/app/components/toast/store/toast.store'
import { CreateGametypeDto, GametypeDto, igametype } from '@/library/data/dto/games/gametype.dto'
import { ModalStore, useModalStore } from '@/app/components/modal/store/modal.store'

import GametypeModal from '../components/modals/gametype.modal.vue'
import ConfirmModal from '@/app/components/modal/templates/confirm.modal.vue'

class GametypeService {
  public static create(success?: (value: GametypeDto) => void): void {
    const { openModal, closeModal }: ModalStore = useModalStore()
    const { addToast }: ToastStore = useToastStore()

    openModal({
      view: markRaw(GametypeModal),
      properties: {
        title: 'administration.game-library.gametypes.create.title',
        action: 'actions.create-gametype',
        callback: async (values: igametype) => {
          await LocalhostAPI.administration.game_library.gametypes
            .create(new CreateGametypeDto(values))
            .then((value: GametypeDto) => {
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

  public static update(gametype: GametypeDto, success?: (value: GametypeDto) => void): void {
    const { openModal, closeModal }: ModalStore = useModalStore()
    const { addToast }: ToastStore = useToastStore()

    openModal({
      view: markRaw(GametypeModal),
      properties: {
        title: 'administration.game-library.gametypes.update.title',
        action: 'actions.update-gametype',
        gametype,
        callback: async (values: igametype) => {
          await LocalhostAPI.administration.game_library.gametypes
            .update(gametype.id, new CreateGametypeDto(values))
            .then((value: GametypeDto) => {
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

  public static async getPaginated(params: PaginationOptions): Promise<PaginationDto<GametypeDto>> {
    const { addToast }: ToastStore = useToastStore()
    return LocalhostAPI.administration.game_library.gametypes.getPaginated(params).catch((error: AxiosError) => {
      addToast({ title: error.response?.statusText || 'ERROR', body: error.message, options: { theme: 'danger' } })
      return { data: [], meta: new PaginationMeta({ pageOptions: params, itemCount: 0 }) }
    })
  }

  public static async getAll(): Promise<Array<GametypeDto>> {
    const { addToast }: ToastStore = useToastStore()
    return LocalhostAPI.administration.game_library.gametypes.getAll().catch((error: AxiosError) => {
      addToast({ title: error.response?.statusText || 'ERROR', body: error.message, options: { theme: 'danger' } })
      return []
    })
  }

  public static remove(gametype: GametypeDto, success?: (value: GametypeDto) => void): void {
    const { openModal, closeModal }: ModalStore = useModalStore()
    const { addToast }: ToastStore = useToastStore()

    openModal({
      view: markRaw(ConfirmModal),
      properties: {
        close: closeModal,
        callback: async (): Promise<void> => {
          await LocalhostAPI.administration.game_library.gametypes
            .remove(gametype.id)
            .then((value: GametypeDto) => {
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
        item: gametype.name,
        title: 'administration.game-library.gametypes.delete.title',
        body: 'administration.game-library.gametypes.delete.body',
        action: 'actions.delete-gametype'
      }
    })
  }
}

export { GametypeService }
