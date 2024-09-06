import { AxiosInstance, AxiosResponse } from 'axios'

import { ILocalStorageUtil } from '@/library/helpers/local-storage.util'
import { PaginationDto, PaginationOptions } from '@/library/dto/pagination.dto'
import { AxiosService } from '@/plugins/axios.plugin'
import { IUser, UserDto } from '@/library/dto/user.dto'

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
            response.data['data'].map((user: IUser) => new UserDto(user)),
            response.data['meta']
          )
      )
  }

  public readonly getUserById = async (id: string): Promise<UserDto> => {
    return this.$api
      .get(`admin/users/${id}`, AxiosService.requestConfig({ token: this.$token.getItem() }))
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
