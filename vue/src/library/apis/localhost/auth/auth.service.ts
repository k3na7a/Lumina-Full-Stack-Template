import { AxiosInstance, AxiosResponse } from 'axios'

import { ILocalStorageUtil } from '@/library/utils/local-storage.util'
import { AxiosService } from '@/library/utils/axios.util'
import {
  RegisterDto,
  ResetPasswordDto,
  UpdateEmailDto,
  UpdatePasswordDto,
  UpdateProfileDto
} from '@/library/data/dto/user.dto'
import { JWTDto } from '@/library/data/dto/JWT.dto'

class authentication {
  private readonly $api: AxiosInstance
  private readonly $token: ILocalStorageUtil

  constructor(api: AxiosInstance, token: ILocalStorageUtil) {
    this.$api = api
    this.$token = token
  }

  public readonly register = async (payload: RegisterDto): Promise<JWTDto> => {
    return this.$api.put<JWTDto>('auth/register', payload).then((response: AxiosResponse) => new JWTDto(response.data))
  }

  public readonly signIn = async (payload: { email: string; password: string }): Promise<JWTDto> => {
    return this.$api.post<JWTDto>('auth/sign-in', payload).then((response: AxiosResponse) => new JWTDto(response.data))
  }

  public readonly signOut = async (): Promise<void> => {
    await this.$api.post<JWTDto>('auth/sign-out', {}, AxiosService.requestConfig({ token: this.$token.getItem() }))
  }

  public readonly verifyToken = async (): Promise<JWTDto> => {
    return this.$api
      .post<JWTDto>('auth/verify-token', {}, AxiosService.requestConfig({ token: this.$token.getItem() }))
      .then((response: AxiosResponse) => new JWTDto(response.data))
  }

  public readonly forgotPassword = async (payload: { email: string; redirect: string }): Promise<void> => {
    await this.$api.post('auth/forgot-password', payload)
  }

  public readonly resetPassword = async (payload: ResetPasswordDto): Promise<void> => {
    await this.$api.patch('auth/reset-password', payload, AxiosService.requestConfig({ token: payload.token }))
  }

  public readonly updateProfile = async (payload: UpdateProfileDto): Promise<JWTDto> => {
    return this.$api
      .patch<JWTDto>('auth/update-profile', payload, AxiosService.requestConfig({ token: this.$token.getItem() }))
      .then((response: AxiosResponse) => new JWTDto(response.data))
  }

  public readonly updateEmail = async (payload: UpdateEmailDto): Promise<JWTDto> => {
    return this.$api
      .patch<JWTDto>('auth/update-email', payload, AxiosService.requestConfig({ token: this.$token.getItem() }))
      .then((response: AxiosResponse) => new JWTDto(response.data))
  }

  public readonly updatePassword = async (payload: UpdatePasswordDto): Promise<JWTDto> => {
    return this.$api
      .patch<JWTDto>('auth/update-password', payload, AxiosService.requestConfig({ token: this.$token.getItem() }))
      .then((response: AxiosResponse) => new JWTDto(response.data))
  }

  public readonly updateAvatar = async (payload: File): Promise<JWTDto> => {
    const formData = new FormData()
    formData.append('avatar', payload)

    return this.$api
      .patch<JWTDto>(
        'auth/update-avatar',
        formData,
        AxiosService.requestConfig({ token: this.$token.getItem(), content: 'multipart/form-data' })
      )
      .then((response: AxiosResponse) => new JWTDto(response.data))
  }

  public readonly removeAvatar = async (): Promise<JWTDto> => {
    return this.$api
      .delete<JWTDto>('auth/remove-avatar', AxiosService.requestConfig({ token: this.$token.getItem() }))
      .then((response: AxiosResponse) => new JWTDto(response.data))
  }

  public readonly deleteAccount = async (payload: { password: string }): Promise<void> => {
    await this.$api.delete(
      'auth/delete-account',
      AxiosService.requestConfig({ token: this.$token.getItem(), data: payload })
    )
  }
}

export { authentication }
