import { AxiosError } from 'axios'
import { markRaw } from 'vue'

import { ToastStore, useToastStore } from '@/app/store/toast.store'
import { LocalhostAPI } from '@/library/apis/localhost/localhost.api'
import { PaginationDto, PaginationMeta, PaginationOptions } from '@/library/apis/localhost/dto/pagination.dto'
import { UpdateUser, UpdateUserDto, UserDto } from '@/library/apis/localhost/dto/user.dto'
import { ModalStore, useModalStore } from '@/app/store/modal.store'

import UploadImageModal from '@/app/components/modal/templates/image-upload.modal.vue'
import ConfirmModal from '@/app/components/modal/templates/confirm.modal.vue'
import ConfirmDeleteModal from '@/app/components/modal/templates/permanently-delete.component.vue'

class UserAdminController {
  private readonly modalStore: ModalStore = useModalStore()
  private readonly toastStore: ToastStore = useToastStore()

  private readonly $api = LocalhostAPI.administration.users
  private readonly $t: (key: string) => string

  private readonly debug: boolean = false

  constructor(t: (key: string) => string) {
    this.$t = t
  }

  public readonly getUserById = async (id: string): Promise<UserDto> => {
    const api = this.$api

    return api
      .getUserById(id)
      .then((response: UserDto) => {
        this.debug && console.log(`[Axios] GET /user ID ${id} request succeeded`)
        return response
      })
      .catch((error: AxiosError) => {
        this.debug && console.warn(`[Axios] Failed to GET /user ID ${id} : ${error.message}`)
        throw new Error(error.message)
      })
  }

  public readonly getUsersPaginated = async (params: PaginationOptions): Promise<PaginationDto<UserDto>> => {
    const { addToast } = this.toastStore

    const t = this.$t
    const api = this.$api

    return api
      .getUsersPaginated(params)
      .then((response: PaginationDto<UserDto>) => {
        this.debug && console.log(`[Axios] GET /users request succeeded (paginated)`)
        return response
      })
      .catch((error: AxiosError) => {
        this.debug && console.warn(`[Axios] Failed to GET /users (paginated) : ${error.message}`)
        addToast({
          title: t('forms.error-general'),
          body: error.message,
          options: { theme: 'danger' }
        })
        return { data: [], meta: new PaginationMeta({ pageOptions: params, itemCount: 0 }) }
      })
  }

  public readonly updateUser = async (
    user: UserDto,
    payload: UpdateUser,
    success?: (value: UserDto) => void
  ): Promise<void> => {
    const { addToast } = this.toastStore
    const { id } = user

    const t = this.$t
    const api = this.$api

    await api
      .updateUser(id, new UpdateUserDto(payload))
      .then((response: UserDto) => {
        this.debug && console.log(`[Axios] PATCH /user ID ${id} request succeeded`)
        if (success) success(response)
        addToast({
          title: t('forms.success-general'),
          body: t('administration.users.single.account-details.success'),
          options: { theme: 'success' }
        })
        return response
      })
      .catch((error: AxiosError) => {
        this.debug && console.warn(`[Axios] Failed to PATCH user ID ${id} : ${error.message}`)
        addToast({
          title: t('forms.error-general'),
          body: error.message,
          options: { theme: 'danger' }
        })
        return user
      })
  }

  public readonly deleteUser = (user: UserDto, success?: (value: UserDto) => void | Promise<void>): void => {
    const { openModal, closeModal } = this.modalStore
    const { addToast } = this.toastStore
    const { id } = user

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
            .deleteUser(id)
            .then((value: UserDto) => {
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

  public readonly updateAvatar = (user: UserDto, success?: (value: UserDto) => void | Promise<void>): void => {
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
              this.debug && console.log(`[Axios] PATCH /avatar request succeeded`)
              if (success) success(value)
              addToast({
                title: t('forms.success-general'),
                body: t('administration.users.single.avatar.success'),
                options: { theme: 'success' }
              })
              closeModal()
            })
            .catch((error: AxiosError) => {
              this.debug && console.warn(`[Axios] Failed to PATCH /avatar : ${error.message}`)
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

  public readonly removeAvatar = (user: UserDto, success?: (value: UserDto) => void | Promise<void>): void => {
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
              this.debug && console.log(`[Axios] DELETE /avatar request succeeded`)
              if (success) success(value)
              addToast({
                title: t('forms.success-general'),
                body: t('administration.users.single.remove-avatar.success'),
                options: { theme: 'success' }
              })
              closeModal()
            })
            .catch((error: AxiosError) => {
              this.debug && console.warn(`[Axios] Failed to DELETE /avatar : ${error.message}`)
              addToast({
                title: t('forms.error-general'),
                body: `${error.message}`,
                options: { theme: 'danger' }
              })
            })
        }
      }
    })
  }
}

export { UserAdminController }
