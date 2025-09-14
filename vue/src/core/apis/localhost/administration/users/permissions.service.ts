import { AxiosInstance, AxiosResponse } from 'axios'

import { AxiosService } from '@/core/utils/axios.util'

import { PaginationDto, PaginationOptions } from '@lib/dto/pagination.dto'
import { CreatePermissionDto, iPermission, PermissionDto } from '@lib/dto/permission.dto'

class permissions {
  private readonly $api: AxiosInstance

  constructor(api: AxiosInstance) {
    this.$api = api
  }

  public readonly create = async (params: CreatePermissionDto, token: string): Promise<PermissionDto> => {
    const response: AxiosResponse<iPermission, any> = await this.$api.put<iPermission>(
      'administration/user-management/permissions',
      params,
      AxiosService.requestConfig({ token })
    )

    return new PermissionDto(response.data)
  }

  public readonly getPaginated = async (
    params: PaginationOptions,
    token: string
  ): Promise<PaginationDto<PermissionDto>> => {
    const response: AxiosResponse = await this.$api.get(
      'administration/user-management/permissions',
      AxiosService.requestConfig({ token, params })
    )

    const result: PermissionDto[] = response.data['data'].map((role: iPermission) => new PermissionDto(role))
    return new PaginationDto(result, response.data['meta'])
  }

  public readonly getById = async (id: string, token: string): Promise<PermissionDto> => {
    const response: AxiosResponse<iPermission, any> = await this.$api.get<iPermission>(
      `administration/user-management/permissions/${id}`,
      AxiosService.requestConfig({ token })
    )

    return new PermissionDto(response.data)
  }

  public readonly update = async (id: string, payload: CreatePermissionDto, token: string): Promise<PermissionDto> => {
    const response: AxiosResponse<iPermission, any> = await this.$api.patch<iPermission>(
      `administration/user-management/permissions/${id}`,
      payload,
      AxiosService.requestConfig({ token })
    )

    return new PermissionDto(response.data)
  }

  public readonly remove = async (id: string, token: string): Promise<PermissionDto> => {
    const response: AxiosResponse<iPermission, any> = await this.$api.delete<iPermission>(
      `administration/user-management/permissions/${id}`,
      AxiosService.requestConfig({ token })
    )

    return new PermissionDto(response.data)
  }
}

export { permissions }
