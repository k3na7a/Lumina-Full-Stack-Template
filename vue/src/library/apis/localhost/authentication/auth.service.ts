import { AxiosInstance } from 'axios'

import { ILocalStorageUtil } from '@/library/utils/local-storage.util'
import { AxiosService } from '@/library/utils/axios.util'
import { RegisterDto, ResetPasswordDto } from '@/library/apis/localhost/dto/user.dto'
import { IJWT, JWTDto } from '@/library/apis/localhost/dto/JWT.dto'
import { Account } from './services/auth.account.service'

class authentication {
  private readonly $api: AxiosInstance
  private readonly $token: ILocalStorageUtil

  public readonly account: Account

  constructor(api: AxiosInstance, token: ILocalStorageUtil) {
    this.$api = api
    this.$token = token

    this.account = new Account(api, token)
  }

  private get authConfig() {
    return AxiosService.requestConfig({ token: this.$token.getItem() })
  }

  public readonly register = async (payload: RegisterDto): Promise<JWTDto> => {
    const response = await this.$api.put<IJWT>('authentication/register', payload)
    return new JWTDto(response.data)
  }

  public readonly signIn = async (payload: { email: string; password: string }): Promise<JWTDto> => {
    const response = await this.$api.post<IJWT>('authentication/sign-in', payload)
    return new JWTDto(response.data)
  }

  public readonly forgotPassword = async (payload: { email: string; redirect: string }): Promise<void> => {
    await this.$api.post<void>('authentication/forgot-password', payload)
  }

  public readonly resetPassword = async (payload: ResetPasswordDto): Promise<void> => {
    await this.$api.patch<void>('authentication/reset-password', payload, this.authConfig)
  }
}

export { authentication }
