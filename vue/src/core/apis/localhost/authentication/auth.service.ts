import { AxiosInstance } from 'axios'

import { ILocalStorageUtil } from '@/core/utils/local-storage.util'
import { AxiosService } from '@/core/utils/axios.util'
import { JWTDto, IJWT } from '@/library/dto/JWT.dto'
import { RegisterDto, ResetPasswordDto } from '@/library/dto/user.dto'

class authentication {
  private readonly $api: AxiosInstance
  private readonly $token: ILocalStorageUtil

  constructor(api: AxiosInstance, token: ILocalStorageUtil) {
    this.$api = api
    this.$token = token
  }

  private readonly requestConfigWith = (options: Partial<{ content: string; data: object; params: object }>) =>
    AxiosService.requestConfig({ token: this.$token.getItem(), ...options })

  public readonly register = async (payload: RegisterDto): Promise<JWTDto> => {
    const response = await this.$api.put<IJWT>('authentication/register', payload)
    return new JWTDto(response.data)
  }

  public readonly verifyToken = async (): Promise<JWTDto> => {
    const response = await this.$api.get<IJWT>('authentication/verify-token', this.requestConfigWith({}))
    return new JWTDto(response.data)
  }

  public readonly signIn = async (payload: { email: string; password: string }): Promise<JWTDto> => {
    const response = await this.$api.post<IJWT>('authentication/sign-in', payload)
    return new JWTDto(response.data)
  }

  public readonly signOut = async (): Promise<void> => {
    await this.$api.post<JWTDto>('authentication/sign-out', {}, this.requestConfigWith({}))
  }

  public readonly forgotPassword = async (payload: { email: string; redirect: string }): Promise<void> => {
    await this.$api.post<void>('authentication/forgot-password', payload)
  }

  public readonly resetPassword = async (payload: ResetPasswordDto): Promise<void> => {
    await this.$api.post<void>('authentication/reset-password', payload, this.requestConfigWith({}))
  }
}

export { authentication }
