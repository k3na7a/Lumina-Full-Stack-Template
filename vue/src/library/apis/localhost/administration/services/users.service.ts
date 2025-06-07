import { AxiosInstance, AxiosResponse } from 'axios'

import { ILocalStorageUtil } from '@/library/utils/local-storage.util'
import { PaginationDto, PaginationOptions } from '@/library/apis/localhost/dto/pagination.dto'
import { AxiosService } from '@/library/utils/axios.util'
import { iUser, UpdateUserDto, UserDto } from '@/library/apis/localhost/dto/user.dto'

class users {
  private readonly $api: AxiosInstance
  private readonly $token: ILocalStorageUtil

  private get authConfig() {
    return AxiosService.requestConfig({ token: this.$token.getItem() })
  }

  private readonly requestConfigWith = (options: Partial<{ content: string; data: object }>) =>
    AxiosService.requestConfig({ token: this.$token.getItem(), ...options })

  constructor(api: AxiosInstance, token: ILocalStorageUtil) {
    this.$api = api
    this.$token = token
  }

  public readonly getUsersPaginated = async (params: PaginationOptions): Promise<PaginationDto<UserDto>> => {
    const response: AxiosResponse = await this.$api.get('administration/user-management/users', {
      ...this.authConfig,
      params
    })

    const users: UserDto[] = response.data['data'].map((user: iUser) => new UserDto(user))
    return new PaginationDto(users, response.data['meta'])
  }

  public readonly updateUser = async (id: string, payload: UpdateUserDto): Promise<UserDto> => {
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

  public readonly deleteUser = async (id: string): Promise<UserDto> => {
    const response: AxiosResponse<iUser, any> = await this.$api.delete<iUser>(
      `administration/user-management/users/${id}`,
      this.authConfig
    )

    return new UserDto(response.data)
  }
}

export { users }
