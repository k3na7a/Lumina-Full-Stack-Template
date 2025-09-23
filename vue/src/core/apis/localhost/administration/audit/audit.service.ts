import { AxiosInstance, AxiosResponse } from 'axios'

import { PaginationDto, PaginationOptions } from '@lib/dto/pagination.dto'
import { AxiosService } from '@/shared/utils/axios.util'
import { AuditEventDto, AuditEvent } from '@lib/dto/audit.dto'

class audit {
  private readonly $api: AxiosInstance

  constructor(api: AxiosInstance) {
    this.$api = api
  }

  public readonly getPaginated = async (
    params: PaginationOptions,
    token: string
  ): Promise<PaginationDto<AuditEventDto>> => {
    const response: AxiosResponse = await this.$api.get(
      'administration/audit-events',
      AxiosService.requestConfig({ token, params })
    )

    const audit_event: AuditEventDto[] = response.data['data'].map(
      (audit_event: AuditEvent) => new AuditEventDto(audit_event)
    )

    return new PaginationDto(audit_event, response.data['meta'])
  }
}

export { audit }
