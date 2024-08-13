import { AxiosInstance, AxiosResponse } from 'axios'

import { ILocalStorageUtil } from '@/helpers/local-storage.util'
import { AxiosService } from '@/plugins/axios.plugin'
import { JWTDto } from '@/library/dto/JWT.dto'
import { Profile, RegisterDto, UpdateEmailDto, UpdatePasswordDto } from '@/library/dto/user.dto'

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

  public readonly forgotPassword = async (payload: { email: string }): Promise<void> => {
    await this.$api.post('auth/forgot-password', { email: payload.email })
  }

  public readonly resetPassword = async (payload: {
    token: string
    new_password: string
    confirm_password: string
  }): Promise<void> => {
    await this.$api.patch('auth/reset-password', payload, AxiosService.requestConfig({ token: payload.token }))
  }

  public readonly updateProfile = async (payload: Profile): Promise<JWTDto> => {
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

  public readonly deleteAccount = async (payload: { password: string }): Promise<void> => {
    await this.$api.delete(
      'auth/delete-account',
      AxiosService.requestConfig({ token: this.$token.getItem(), data: payload })
    )
  }
}

export { authentication }
