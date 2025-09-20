import { AxiosError } from 'axios'

import { PaginationDto, PaginationMeta } from '@lib/dto/pagination.dto'
import { LocalhostAPI } from '@/core/apis/localhost/localhost.api'
import { ToastStore, useToastStore } from '@/core/store/toast.store'

import { AppStore, useAppStore } from '@/core/store/app.store'
import { AuditEventDto, AuditPaginationOptions } from '@lib/dto/audit.dto'

export function useHistoryAdminHandler(t: (key: string) => string): {
  paginate: (params: AuditPaginationOptions) => Promise<PaginationDto<AuditEventDto>>
} {
  const toastStore: ToastStore = useToastStore()
  const appStore: AppStore = useAppStore()

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

  return { paginate }
}
