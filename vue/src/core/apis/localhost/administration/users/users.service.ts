import { AxiosInstance, AxiosResponse } from 'axios'

import { PaginationDto, PaginationOptions } from '@lib/dto/pagination.dto'
import { AxiosService } from '@/shared/utils/axios.util'
import { iUser, UpdateUserDto, UserDto } from '@lib/dto/user.dto'

class users {
  private readonly $api: AxiosInstance

  constructor(api: AxiosInstance) {
    this.$api = api
  }

  public readonly getPaginated = async (params: PaginationOptions, token: string): Promise<PaginationDto<UserDto>> => {
    const response: AxiosResponse = await this.$api.get(
      'administration/user-management/users',
      AxiosService.requestConfig({ token, params })
    )

    const users: UserDto[] = response.data['data'].map((user: iUser) => new UserDto(user))
    return new PaginationDto(users, response.data['meta'])
  }

  public readonly getById = async (id: string, token: string): Promise<UserDto> => {
    const response: AxiosResponse = await this.$api.get(
      `administration/user-management/users/${id}`,
      AxiosService.requestConfig({ token })
    )

    return new UserDto(response.data)
  }

  public readonly update = async (id: string, payload: UpdateUserDto, token: string): Promise<UserDto> => {
    const formData = new FormData()

    Object.keys(payload).forEach((key: string) => {
      if (Object(payload)[key]) formData.append(key, Object(payload)[key])
    })

    const response: AxiosResponse<iUser, any> = await this.$api.patch<iUser>(
      `administration/user-management/users/${id}`,
      formData,
      AxiosService.requestConfig({ token, content: 'multipart/form-data' })
    )

    return new UserDto(response.data)
  }

  public readonly remove = async (id: string, token: string): Promise<UserDto> => {
    const response: AxiosResponse<iUser, any> = await this.$api.delete<iUser>(
      `administration/user-management/users/${id}`,
      AxiosService.requestConfig({ token })
    )

    return new UserDto(response.data)
  }
}

export { users }
