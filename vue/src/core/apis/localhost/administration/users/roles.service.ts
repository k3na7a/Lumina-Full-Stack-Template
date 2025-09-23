import { AxiosInstance, AxiosResponse } from 'axios'

import { AxiosService } from '@/core/utils/axios.util'

import { PaginationDto, PaginationOptions } from '@lib/dto/pagination.dto'
import { CreateRoleDto, iRole, RoleDto } from '@lib/dto/role.dto'

class roles {
  private readonly $api: AxiosInstance

  constructor(api: AxiosInstance) {
    this.$api = api
  }

  public readonly create = async (params: CreateRoleDto, token: string): Promise<RoleDto> => {
    const response: AxiosResponse<iRole, any> = await this.$api.put<iRole>(
      'administration/user-management/roles',
      params,
      AxiosService.requestConfig({ token })
    )

    return new RoleDto(response.data)
  }

  public readonly getPaginated = async (params: PaginationOptions, token: string): Promise<PaginationDto<RoleDto>> => {
    const response: AxiosResponse = await this.$api.get(
      'administration/user-management/roles',
      AxiosService.requestConfig({ token, params })
    )

    const roles: RoleDto[] = response.data['data'].map((role: iRole) => new RoleDto(role))
    return new PaginationDto(roles, response.data['meta'])
  }

  public readonly getById = async (id: string, token: string): Promise<RoleDto> => {
    const response: AxiosResponse<iRole, any> = await this.$api.get(
      `administration/user-management/roles/${id}`,
      AxiosService.requestConfig({ token })
    )

    return new RoleDto(response.data)
  }

  public readonly update = async (id: string, payload: CreateRoleDto, token: string): Promise<RoleDto> => {
    const response: AxiosResponse<iRole, any> = await this.$api.patch<iRole>(
      `administration/user-management/roles/${id}`,
      payload,
      AxiosService.requestConfig({ token })
    )

    return new RoleDto(response.data)
  }

  public readonly remove = async (id: string, token: string): Promise<RoleDto> => {
    const response: AxiosResponse<iRole, any> = await this.$api.delete<iRole>(
      `administration/user-management/roles/${id}`,
      AxiosService.requestConfig({ token })
    )

    return new RoleDto(response.data)
  }
}

export { roles }
