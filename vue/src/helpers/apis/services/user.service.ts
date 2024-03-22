import { AxiosInstance, AxiosResponse } from 'axios'

import { ILocalStorageUtil } from '@/helpers/utils/local-storage.util'
import { AxiosService } from '@/plugins/axios.plugin'

import { UserDto } from '../dto/user.dto'

class users {
  private readonly $api: AxiosInstance
  private readonly $token: ILocalStorageUtil

  constructor(api: AxiosInstance, token: ILocalStorageUtil) {
    this.$api = api
    this.$token = token
  }

  public readonly getMe = async (): Promise<UserDto> => {
    return this.$api
      .get<UserDto>('users', AxiosService.requestConfig({ token: this.$token.getItem() }))
      .then((response: AxiosResponse) => new UserDto(response['data']))
  }
}

export { users }
