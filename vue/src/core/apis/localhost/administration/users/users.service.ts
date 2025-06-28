import { AxiosInstance, AxiosResponse } from 'axios'

import { ILocalStorageUtil } from '@/core/utils/local-storage.util'
import { PaginationDto, PaginationOptions } from '@/library/dto/pagination.dto'
import { AxiosService } from '@/core/utils/axios.util'
import { iUser, UpdateUserDto, UserDto } from '@/library/dto/user.dto'

class users {
  private readonly $api: AxiosInstance
  private readonly $token: ILocalStorageUtil

  constructor(api: AxiosInstance, token: ILocalStorageUtil) {
    this.$api = api
    this.$token = token
  }

  private readonly requestConfigWith = (options: Partial<{ content: string; data: object; params: object }>) =>
    AxiosService.requestConfig({ token: this.$token.getItem(), ...options })

  public readonly getPaginated = async (params: PaginationOptions): Promise<PaginationDto<UserDto>> => {
    const response: AxiosResponse = await this.$api.get(
      'administration/user-management/users',
      this.requestConfigWith({ params })
    )

    const users: UserDto[] = response.data['data'].map((user: iUser) => new UserDto(user))
    return new PaginationDto(users, response.data['meta'])
  }

  public readonly getById = async (id: string): Promise<UserDto> => {
    const response: AxiosResponse = await this.$api.get(
      `administration/user-management/users/${id}`,
      this.requestConfigWith({})
    )

    return new UserDto(response.data)
  }

  public readonly update = async (id: string, payload: UpdateUserDto): Promise<UserDto> => {
    const formData = new FormData()

    Object.keys(payload).forEach((key: string) => {
      if (Object(payload)[key]) formData.append(key, Object(payload)[key])
    })

    const response: AxiosResponse<iUser, any> = await this.$api.patch<iUser>(
      `administration/user-management/users/${id}`,
      formData,
      this.requestConfigWith({ content: 'multipart/form-data' })
    )

    return new UserDto(response.data)
  }

  public readonly remove = async (id: string): Promise<UserDto> => {
    const response: AxiosResponse<iUser, any> = await this.$api.delete<iUser>(
      `administration/user-management/users/${id}`,
      this.requestConfigWith({})
    )

    return new UserDto(response.data)
  }
}

export { users }
