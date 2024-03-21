import { AxiosInstance, AxiosResponse } from 'axios'

import { ILocalStorageUtil } from '@/helpers/utils/local-storage.util'
import { AxiosService } from '@/plugins/axios.plugin'
import { JWTDto } from '../dto/JWT.dto'

class authentication {
  private readonly $api: AxiosInstance
  private readonly $token: ILocalStorageUtil

  constructor(api: AxiosInstance, token: ILocalStorageUtil) {
    this.$api = api
    this.$token = token
  }

  public readonly signIn = async (payload: { email: string; password: string }): Promise<JWTDto> => {
    return this.$api
      .post<JWTDto>('auth/sign-in', payload)
      .then((response: AxiosResponse) => new JWTDto(response['data']))
  }

  public readonly signOut = async (): Promise<JWTDto> => {
    return this.$api
      .post<JWTDto>('auth/sign-out', null, AxiosService.requestConfig({ token: this.$token.getItem() }))
      .then((response: AxiosResponse) => new JWTDto(response['data']))
  }
}

export { authentication }
