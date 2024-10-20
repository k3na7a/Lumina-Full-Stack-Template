import { AxiosInstance, AxiosResponse } from 'axios'

import { ILocalStorageUtil } from '@/library/utilities/helpers/local-storage.util'
import { PaginationDto, PaginationOptions } from '@/library/data/dto/pagination.dto'
import { AxiosService } from '@/library/utilities/helpers/axios.util'
import { iUser, UpdateUserDto, UserDto } from '@/library/data/dto/user/user.dto'

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

  public readonly updateUser = async (id: string, payload: UpdateUserDto): Promise<UserDto> => {
    const formData = new FormData()

    Object.keys(payload).forEach((key: string) => {
      if (Object(payload)[key]) formData.append(key, Object(payload)[key])
    })

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

export { users }
