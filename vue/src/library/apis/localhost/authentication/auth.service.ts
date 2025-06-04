import { AxiosInstance } from 'axios'

import { ILocalStorageUtil } from '@/library/utils/local-storage.util'
import { AxiosService } from '@/library/utils/axios.util'
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

  private get authConfig() {
    return AxiosService.requestConfig({ token: this.$token.getItem() })
  }

  constructor(api: AxiosInstance, token: ILocalStorageUtil) {
    this.$api = api
    this.$token = token
  }

  private requestConfigWith = (options: Partial<{ content: string; data: object }>) =>
    AxiosService.requestConfig({ token: this.$token.getItem(), ...options })

  public readonly register = async (payload: RegisterDto): Promise<JWTDto> => {
    const response = await this.$api.put<IJWT>('auth/register', payload)
    return new JWTDto(response.data)
  }

  public readonly signIn = async (payload: { email: string; password: string }): Promise<JWTDto> => {
    const response = await this.$api.post<IJWT>('auth/sign-in', payload)
    return new JWTDto(response.data)
  }

  public readonly signOut = async (): Promise<void> => {
    await this.$api.post<JWTDto>('auth/sign-out', {}, this.authConfig)
  }

  public readonly verifyToken = async (): Promise<JWTDto> => {
    const response = await this.$api.post<IJWT>('auth/verify-token', {}, this.authConfig)

    return new JWTDto(response.data)
  }

  public readonly forgotPassword = async (payload: { email: string; redirect: string }): Promise<void> => {
    await this.$api.post<void>('auth/forgot-password', payload)
  }

  public readonly resetPassword = async (payload: ResetPasswordDto): Promise<void> => {
    await this.$api.patch<void>('auth/reset-password', payload, this.authConfig)
  }

  public readonly updateProfile = async (payload: UpdateProfileDto): Promise<JWTDto> => {
    const response = await this.$api.patch<IJWT>('auth/update-profile', payload, this.authConfig)

    return new JWTDto(response.data)
  }

  public readonly updateEmail = async (payload: UpdateEmailDto): Promise<JWTDto> => {
    const response = await this.$api.patch<IJWT>('auth/update-email', payload, this.authConfig)

    return new JWTDto(response.data)
  }

  public readonly updatePassword = async (payload: UpdatePasswordDto): Promise<JWTDto> => {
    const response = await this.$api.patch<IJWT>('auth/update-password', payload, this.authConfig)

    return new JWTDto(response.data)
  }

  public readonly updateAvatar = async (payload: File): Promise<JWTDto> => {
    const formData = new FormData()
    formData.append('avatar', payload)

    const response = await this.$api.patch<IJWT>(
      'auth/update-avatar',
      formData,
      this.requestConfigWith({ content: 'multipart/form-data' })
    )

    return new JWTDto(response.data)
  }

  public readonly removeAvatar = async (): Promise<JWTDto> => {
    const response = await this.$api.delete<IJWT>('auth/remove-avatar', this.authConfig)

    return new JWTDto(response.data)
  }

  public readonly deleteAccount = async (payload: { password: string }): Promise<void> => {
    await this.$api.delete<void>('auth/delete-account', this.requestConfigWith({ data: payload }))
  }
}

export { authentication }
