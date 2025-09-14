import { AxiosInstance } from 'axios'

import { JWTDto, IJWT, CsrfDto, ICSRF } from '@lib/dto/JWT.dto'
import { RegisterDto, ResetPasswordDto } from '@lib/dto/user.dto'
import { AxiosService } from '@/core/utils/axios.util'

class authentication {
  private readonly $api: AxiosInstance

  constructor(api: AxiosInstance) {
    this.$api = api
  }

  public readonly csrfToken = async (): Promise<CsrfDto> => {
    const response = await this.$api.get<ICSRF>(
      'authentication/csrf-token',
      AxiosService.requestConfig({ withCredentials: true })
    )
    return new CsrfDto(response.data)
  }

  public readonly verifyToken = async (csrfToken: string): Promise<JWTDto> => {
    const response = await this.$api.get<IJWT>(
      'authentication/verify-token',
      AxiosService.requestConfig({ withCredentials: true, csrfToken })
    )
    return new JWTDto(response.data)
  }

  public readonly register = async (payload: RegisterDto, csrfToken: string): Promise<JWTDto> => {
    const response = await this.$api.put<IJWT>(
      'authentication/register',
      payload,
      AxiosService.requestConfig({ withCredentials: true, csrfToken })
    )
    return new JWTDto(response.data)
  }

  public readonly signIn = async (payload: { email: string; password: string }, csrfToken: string): Promise<JWTDto> => {
    const response = await this.$api.post<IJWT>(
      'authentication/sign-in',
      payload,
      AxiosService.requestConfig({ withCredentials: true, csrfToken })
    )
    return new JWTDto(response.data)
  }

  public readonly forgotPassword = async (payload: { email: string; redirect: string }): Promise<void> => {
    await this.$api.post<void>('authentication/forgot-password', payload)
  }

  public readonly signOut = async (csrfToken: string): Promise<void> => {
    await this.$api.post<JWTDto>(
      'authentication/sign-out',
      {},
      AxiosService.requestConfig({ withCredentials: true, csrfToken })
    )
  }

  public readonly resetPassword = async (payload: ResetPasswordDto, token: string): Promise<void> => {
    await this.$api.post<void>('authentication/reset-password', payload, AxiosService.requestConfig({ token }))
  }
}

export { authentication }
