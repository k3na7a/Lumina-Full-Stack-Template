import { AxiosInstance, AxiosResponse } from 'axios'

import { ILocalStorageUtil } from '@/core/utilities/local-storage.util'
import { PaginationDto, PaginationOptions } from '@/core/apis/dto/pagination.dto'
import { AxiosService } from '@/core/utilities/axios.util'
import { iUser, UpdateUserDto, UserDto } from '@/core/apis/dto/user.dto'

class profile {
  private readonly $api: AxiosInstance
  private readonly $token: ILocalStorageUtil

  private readonly requestConfigWith = (options: Partial<{ content: string; data: object; params: object }>) =>
    AxiosService.requestConfig({ token: this.$token.getItem(), ...options })

  constructor(api: AxiosInstance, token: ILocalStorageUtil) {
    this.$api = api
    this.$token = token
  }

  public readonly updateAvatar = async (id: string, payload: File): Promise<UserDto> => {
    const formData = new FormData()
    formData.append('avatar', payload)

    const response = await this.$api.post<iUser>(
      `administration/user-management/users/${id}/profile/avatar`,
      formData,
      this.requestConfigWith({ content: 'multipart/form-data' })
    )

    return new UserDto(response.data)
  }

  public readonly removeAvatar = async (id: string): Promise<UserDto> => {
    const response = await this.$api.delete<iUser>(
      `administration/user-management/users/${id}/profile/avatar`,
      this.requestConfigWith({})
    )

    return new UserDto(response.data)
  }
}

class users {
  private readonly $api: AxiosInstance
  private readonly $token: ILocalStorageUtil

  public readonly profile: profile

  constructor(api: AxiosInstance, token: ILocalStorageUtil) {
    this.$api = api
    this.$token = token
    this.profile = new profile(api, token)
  }

  private readonly requestConfigWith = (options: Partial<{ content: string; data: object; params: object }>) =>
    AxiosService.requestConfig({ token: this.$token.getItem(), ...options })

  public readonly getUsersPaginated = async (params: PaginationOptions): Promise<PaginationDto<UserDto>> => {
    const response: AxiosResponse = await this.$api.get(
      'administration/user-management/users',
      this.requestConfigWith({ params })
    )

    const users: UserDto[] = response.data['data'].map((user: iUser) => new UserDto(user))
    return new PaginationDto(users, response.data['meta'])
  }

  public readonly getUserById = async (id: string): Promise<UserDto> => {
    const response: AxiosResponse = await this.$api.get(
      `administration/user-management/users/${id}`,
      this.requestConfigWith({})
    )

    return new UserDto(response.data)
  }

  public readonly updateUser = async (id: string, payload: UpdateUserDto): Promise<UserDto> => {
    const response: AxiosResponse<iUser, any> = await this.$api.patch<iUser>(
      `administration/user-management/users/${id}`,
      payload,
      this.requestConfigWith({})
    )

    return new UserDto(response.data)
  }

  public readonly deleteUser = async (id: string): Promise<UserDto> => {
    const response: AxiosResponse<iUser, any> = await this.$api.delete<iUser>(
      `administration/user-management/users/${id}`,
      this.requestConfigWith({})
    )

    return new UserDto(response.data)
  }
}

export { users }
