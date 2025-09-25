import { AxiosError } from 'axios'
import { markRaw } from 'vue'

import { PaginationDto, PaginationMeta } from '@lib/dto/pagination.dto'
import { AuditEventDto, AuditPaginationOptions } from '@lib/dto/audit.dto'

import { LocalhostAPI } from '@/core/apis/localhost/localhost.api'
import { ToastStore, useToastStore } from '@/core/store/toast.store'
import { AppStore, useAppStore } from '@/core/store/app.store'
import { ModalStore, useModalStore } from '@/core/store/modal.store'

import EventModal from '../components/event.modal.vue'

export function useHistoryAdminHandler(t: (key: string) => string): {
  paginate: (params: AuditPaginationOptions) => Promise<PaginationDto<AuditEventDto>>
  view: (event: AuditEventDto) => void
} {
  const toastStore: ToastStore = useToastStore()
  const appStore: AppStore = useAppStore()
  const modalStore: ModalStore = useModalStore()

  const api = LocalhostAPI.administration.audit

  function showErrorToast(error: AxiosError): void {
    const { addToast } = toastStore

    addToast({
      title: t('forms.error-general'),
      body: error.message,
      options: { theme: 'danger' }
    })
  }

  async function paginate(params: AuditPaginationOptions): Promise<PaginationDto<AuditEventDto>> {
    const token = await appStore.getValidAccessToken()
    if (!token) throw new Error('Could not get valid access token')

    return api.getPaginated(params, token).catch((error: AxiosError) => {
      showErrorToast(error)
      return { data: [], meta: new PaginationMeta({ pageOptions: params, itemCount: 0 }) }
    })
  }

  function view(event: AuditEventDto): void {
    const { openModal } = modalStore
    openModal({
      view: markRaw(EventModal),
      size: 'lg',
      properties: {
        title: 'administration.activity-logs.modal-title',
        event
      }
    })
  }

  return { paginate, view }
}
