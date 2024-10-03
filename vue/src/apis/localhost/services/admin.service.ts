import { AxiosInstance, AxiosResponse } from 'axios'

import { ILocalStorageUtil } from '@/utilities/local-storage.util'
import { PaginationDto, PaginationOptions } from '@/apis/localhost/dto/pagination.dto'
import { AxiosService } from '@/utilities/axios.util'
import { iUser, UpdateUserDto, UserDto } from '@/apis/localhost/dto/user.dto'

class users {
  private readonly $api: AxiosInstance
  private readonly $token: ILocalStorageUtil

  constructor(api: AxiosInstance, token: ILocalStorageUtil) {
    this.$api = api
    this.$token = token
  }

  public readonly getUsersPaginated = async (params: PaginationOptions): Promise<PaginationDto<UserDto>> => {
    return this.$api
      .get('admin/users/paginated', AxiosService.requestConfig({ token: this.$token.getItem(), params }))
      .then(
        (response: AxiosResponse) =>
          new PaginationDto<UserDto>(
            response.data['data'].map((user: iUser) => new UserDto(user)),
            response.data['meta']
          )
      )
  }

  public readonly getUserCount = async (): Promise<number> => {
    return this.$api
      .get(`admin/users/count`, AxiosService.requestConfig({ token: this.$token.getItem() }))
      .then((response: AxiosResponse) => Number(response.data))
  }

  public readonly getUserById = async (id: string): Promise<UserDto> => {
    return this.$api
      .get(`admin/users/${id}`, AxiosService.requestConfig({ token: this.$token.getItem() }))
      .then((response: AxiosResponse) => new UserDto(response.data))
  }

  public readonly updateUser = async (id: string, payload: UpdateUserDto): Promise<UserDto> => {
    const formData = new FormData()

    Object.keys(payload).forEach((key: string) => {
      if (Object(payload)[key]) formData.append(key, Object(payload)[key])
    })

    console.log(payload)

    return this.$api
      .patch<UserDto>(
        `admin/users/${id}`,
        formData,
        AxiosService.requestConfig({ token: this.$token.getItem(), content: 'multipart/form-data' })
      )
      .then((response: AxiosResponse) => new UserDto(response.data))
  }

  public readonly deleteUser = async (id: string): Promise<UserDto> => {
    return this.$api
      .delete<UserDto>(`admin/users/${id}`, AxiosService.requestConfig({ token: this.$token.getItem() }))
      .then((response: AxiosResponse) => new UserDto(response.data))
  }
}

class administration {
  public readonly users: users

  constructor(api: AxiosInstance, token: ILocalStorageUtil) {
    this.users = new users(api, token)
  }
}

export { administration }
