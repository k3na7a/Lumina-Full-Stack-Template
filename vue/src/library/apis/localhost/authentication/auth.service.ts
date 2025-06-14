import { AxiosInstance } from 'axios'

import { ILocalStorageUtil } from '@/library/utilities/local-storage.util'
import { AxiosService } from '@/library/utilities/axios.util'
import {
  RegisterDto,
  ResetPasswordDto,
  UpdateEmailDto,
  UpdatePasswordDto,
  UpdateProfileDto
} from '@/library/apis/localhost/dto/user.dto'
import { IJWT, JWTDto } from '@/library/apis/localhost/dto/JWT.dto'

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

  public readonly updateEmail = async (payload: UpdateEmailDto): Promise<JWTDto> => {
    const response = await this.$api.patch<IJWT>('authentication/account/email', payload, this.requestConfigWith({}))

    return new JWTDto(response.data)
  }

  public readonly updatePassword = async (payload: UpdatePasswordDto): Promise<JWTDto> => {
    const response = await this.$api.patch<IJWT>('authentication/account/password', payload, this.requestConfigWith({}))

    return new JWTDto(response.data)
  }

  public readonly deleteAccount = async (payload: { password: string }): Promise<void> => {
    await this.$api.delete<void>('authentication/account', this.requestConfigWith({ data: payload }))
  }

  public readonly updateProfile = async (payload: UpdateProfileDto): Promise<JWTDto> => {
    const response = await this.$api.patch<IJWT>('authentication/account/profile', payload, this.requestConfigWith({}))
    return new JWTDto(response.data)
  }

  public readonly updateAvatar = async (payload: File): Promise<JWTDto> => {
    const formData = new FormData()
    formData.append('avatar', payload)

    const response = await this.$api.post<IJWT>(
      'authentication/account/profile/avatar',
      formData,
      this.requestConfigWith({ content: 'multipart/form-data' })
    )

    return new JWTDto(response.data)
  }

  public readonly removeAvatar = async (): Promise<JWTDto> => {
    const response = await this.$api.delete<IJWT>('authentication/account/profile/avatar', this.requestConfigWith({}))
    return new JWTDto(response.data)
  }
}

export { authentication }
