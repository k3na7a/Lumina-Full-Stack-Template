import { AxiosInstance } from 'axios'

import { JWTDto, IJWT } from '@/library/dto/JWT.dto'
import { RegisterDto, ResetPasswordDto } from '@/library/dto/user.dto'
import { AxiosService } from '@/core/utils/axios.util'

class authentication {
  private readonly $api: AxiosInstance

  constructor(api: AxiosInstance) {
    this.$api = api
  }

  public readonly verifyToken = async (): Promise<JWTDto> => {
    const response = await this.$api.get<IJWT>(
      'authentication/verify-token',
      AxiosService.requestConfig({ withCredentials: true })
    )
    return new JWTDto(response.data)
  }

  public readonly register = async (payload: RegisterDto): Promise<JWTDto> => {
    const response = await this.$api.put<IJWT>(
      'authentication/register',
      payload,
      AxiosService.requestConfig({ withCredentials: true })
    )
    return new JWTDto(response.data)
  }

  public readonly signIn = async (payload: { email: string; password: string }): Promise<JWTDto> => {
    const response = await this.$api.post<IJWT>(
      'authentication/sign-in',
      payload,
      AxiosService.requestConfig({ withCredentials: true })
    )
    return new JWTDto(response.data)
  }

  public readonly forgotPassword = async (payload: { email: string; redirect: string }): Promise<void> => {
    await this.$api.post<void>('authentication/forgot-password', payload)
  }

  public readonly signOut = async (): Promise<void> => {
    await this.$api.post<JWTDto>('authentication/sign-out', {}, AxiosService.requestConfig({ withCredentials: true }))
  }

  public readonly resetPassword = async (payload: ResetPasswordDto, token: string): Promise<void> => {
    await this.$api.post<void>('authentication/reset-password', payload, AxiosService.requestConfig({ token }))
  }
}

export { authentication }
