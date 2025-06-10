import { AxiosError } from 'axios'
import { markRaw } from 'vue'

import { ToastStore, useToastStore } from '@/app/store/toast.store'
import { LocalhostAPI } from '@/library/apis/localhost/localhost.api'
import { PaginationDto, PaginationMeta, PaginationOptions } from '@/library/apis/localhost/dto/pagination.dto'
import { UpdateUser, UpdateUserDto, UserDto } from '@/library/apis/localhost/dto/user.dto'
import { ModalStore, useModalStore } from '@/app/store/modal.store'

import UploadImageModal from '@/app/components/modal/templates/image-upload.modal.vue'
import ConfirmModal from '@/app/components/modal/templates/confirm.modal.vue'

class UserAdminController {
  private readonly modalStore: ModalStore = useModalStore()
  private readonly toastStore: ToastStore = useToastStore()

  private readonly $api = LocalhostAPI.administration.users
  private readonly $t: (key: string) => string

  constructor(t: (key: string) => string) {
    this.$t = t
  }

  public async getUsersPaginated(params: PaginationOptions): Promise<PaginationDto<UserDto>> {
    const { addToast } = this.toastStore

    const t = this.$t
    const api = this.$api

    return api
      .getUsersPaginated(params)
      .then((response: PaginationDto<UserDto>) => {
        console.log(`[Axios] GET /users request succeeded (paginated)`)
        return response
      })
      .catch((error: AxiosError) => {
        console.warn(`[Axios] Failed to GET /users (paginated) : ${error.message}`)
        addToast({
          title: t('administration.users.user-table.error.title'),
          body: t('administration.users.user-table.error.body'),
          options: { theme: 'danger' }
        })
        return { data: [], meta: new PaginationMeta({ pageOptions: params, itemCount: 0 }) }
      })
  }

  public async getUserById(id: string): Promise<UserDto> {
    const t = this.$t
    const api = this.$api

    return api
      .getUserById(id)
      .then((response: UserDto) => {
        console.log(`[Axios] GET /user ID ${id} request succeeded`)
        return response
      })
      .catch((error: AxiosError) => {
        console.warn(`[Axios] Failed to GET /user ID ${id} : ${error.message}`)
        throw new Error(t('administration.users.single.error'))
      })
  }

  public async updateUser(user: UserDto, payload: UpdateUser, success?: (value: UserDto) => void): Promise<UserDto> {
    const { addToast } = this.toastStore
    const { id } = user

    const t = this.$t
    const api = this.$api

    return api
      .updateUser(id, new UpdateUserDto(payload))
      .then((response: UserDto) => {
        console.log(`[Axios] PATCH /user ID ${id} request succeeded`)
        if (success) success(response)
        addToast({
          title: t('administration.users.single.account-details.success.title'),
          body: t('administration.users.single.account-details.success.body'),
          options: { theme: 'success' }
        })
        return response
      })
      .catch((error: AxiosError) => {
        console.warn(`[Axios] Failed to PATCH user ID ${id}: ${error.message}`)
        addToast({
          title: t('administration.users.single.account-details.error.title'),
          body: t('administration.users.single.account-details.error.body'),
          options: { theme: 'danger' }
        })
        return user
      })
  }

  public deleteUser(user: UserDto, success?: (value: UserDto) => void): void {
    const { openModal, closeModal } = this.modalStore
    const { addToast } = this.toastStore
    const { id } = user

    const t = this.$t
    const api = this.$api

    openModal({
      view: markRaw(ConfirmModal),
      properties: {
        title: t('administration.users.single.delete-account.modal.title'),
        body: t('administration.users.single.delete-account.modal.body'),
        action: t('administration.users.single.delete-account.modal.action'),
        close: closeModal,
        callback: async (): Promise<void> => {
          await api
            .deleteUser(id)
            .then((value: UserDto) => {
              console.log(`[Axios] DELETE /user ID ${id} request succeeded`)
              if (success) success(value)
              addToast({
                title: t('administration.users.single.delete-account.success.title'),
                body: t('administration.users.single.delete-account.success.body'),
                options: { theme: 'success' }
              })
              closeModal()
            })
            .catch((error: AxiosError) => {
              console.warn(`[Axios] Failed to DELETE user ID ${id}: ${error.message}`)

              addToast({
                title: t('administration.users.single.delete-account.error.title'),
                body: t('administration.users.single.delete-account.error.body'),
                options: { theme: 'danger' }
              })
            })
        }
      }
    })
  }

  public updateAvatar = (user: UserDto, success?: (value: UserDto) => void): void => {
    const { openModal, closeModal } = this.modalStore
    const { addToast } = this.toastStore
    const { id } = user

    const t = this.$t
    const api = this.$api

    openModal({
      view: markRaw(UploadImageModal),
      properties: {
        title: t('administration.users.single.avatar.title'),
        action: t('actions.update-avatar'),
        callback: async ({ image }: { image: File }): Promise<void> => {
          await api.profile
            .updateAvatar(id, image)
            .then((value: UserDto) => {
              console.log(`[Axios] PATCH /avatar request succeeded`)
              if (success) success(value)
              addToast({
                title: t('administration.users.single.avatar.success.title'),
                body: t('administration.users.single.avatar.success.body'),
                options: { theme: 'success' }
              })
              closeModal()
            })
            .catch((error: AxiosError) => {
              console.warn(`[Axios] Failed to PATCH /avatar : ${error.message}`)
              addToast({
                title: t('administration.users.single.avatar.error.title'),
                body: t('administration.users.single.avatar.error.body'),
                options: { theme: 'danger' }
              })
            })
        }
      }
    })
  }

  public removeAvatar = (user: UserDto, success?: (value: UserDto) => void): void => {
    const { openModal, closeModal } = this.modalStore
    const { addToast } = this.toastStore

    const t = this.$t
    const api = this.$api

    openModal({
      view: markRaw(ConfirmModal),
      properties: {
        title: t('administration.users.single.remove-avatar.title'),
        body: t('administration.users.single.remove-avatar.body'),
        action: t('actions.remove-avatar'),
        close: closeModal,
        callback: async (): Promise<void> => {
          await api.profile
            .removeAvatar(user.id)
            .then((value: UserDto) => {
              console.log(`[Axios] DELETE /avatar request succeeded`)
              if (success) success(value)
              addToast({
                title: t('administration.users.single.remove-avatar.success.title'),
                body: t('administration.users.single.remove-avatar.success.body'),
                options: { theme: 'success' }
              })
              closeModal()
            })
            .catch((error: AxiosError) => {
              console.warn(`[Axios] Failed to DELETE /avatar : ${error.message}`)
              addToast({
                title: t('administration.users.single.remove-avatar.error.title'),
                body: t('administration.users.single.remove-avatar.error.body'),
                options: { theme: 'danger' }
              })
            })
        }
      }
    })
  }
}

export { UserAdminController }
