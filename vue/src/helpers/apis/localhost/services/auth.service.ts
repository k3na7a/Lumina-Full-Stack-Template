import { AxiosInstance, AxiosResponse } from 'axios'

import { ILocalStorageUtil } from '@/helpers/utils/local-storage.util'
import { AxiosService } from '@/plugins/axios.plugin'
import { JWTDto } from '@/library/dto/JWT.dto'
import { Profile } from '@/library/dto/user.dto'

class authentication {
  private readonly $api: AxiosInstance
  private readonly $token: ILocalStorageUtil

  constructor(api: AxiosInstance, token: ILocalStorageUtil) {
    this.$api = api
    this.$token = token
  }

  public readonly register = async (payload: { email: string; password: string }): Promise<JWTDto> => {
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
    await this.$api.post('auth/reset-password', payload, AxiosService.requestConfig({ token: payload.token }))
  }

  public readonly updateProfile = async (payload: Profile): Promise<JWTDto> => {
    return this.$api
      .post<JWTDto>('auth/update-profile', payload, AxiosService.requestConfig({ token: this.$token.getItem() }))
      .then((response: AxiosResponse) => new JWTDto(response.data))
  }

  public readonly updateEmail = async (payload: {
    password: string
    new_email: string
    confirm_new_email: string
  }): Promise<JWTDto> => {
    return this.$api
      .post<JWTDto>('auth/update-email', payload, AxiosService.requestConfig({ token: this.$token.getItem() }))
      .then((response: AxiosResponse) => new JWTDto(response.data))
  }

  public readonly updatePassword = async (payload: {
    old_password: string
    new_password: string
    confirm_new_password: string
  }): Promise<JWTDto> => {
    return this.$api
      .post<JWTDto>('auth/update-email', payload, AxiosService.requestConfig({ token: this.$token.getItem() }))
      .then((response: AxiosResponse) => new JWTDto(response.data))
  }

  public readonly deleteAccount = async (payload: { password: string }): Promise<void> => {
    await this.$api.post('auth/delete-account', payload, AxiosService.requestConfig({ token: this.$token.getItem() }))
  }
}

export { authentication }
