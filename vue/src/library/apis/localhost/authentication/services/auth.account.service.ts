import { AxiosInstance } from 'axios'

import { ILocalStorageUtil } from '@/library/utils/local-storage.util'
import { AxiosService } from '@/library/utils/axios.util'
import { UpdateEmailDto, UpdatePasswordDto } from '@/library/apis/localhost/dto/user.dto'
import { IJWT, JWTDto } from '@/library/apis/localhost/dto/JWT.dto'
import { Profile } from './auth.account.profile.service'

class Account {
  private readonly $api: AxiosInstance
  private readonly $token: ILocalStorageUtil

  public readonly profile: Profile

  constructor(api: AxiosInstance, token: ILocalStorageUtil) {
    this.$api = api
    this.$token = token

    this.profile = new Profile(api, token)
  }

  private requestConfigWith = (options: Partial<{ content: string; data: object }>) =>
    AxiosService.requestConfig({ token: this.$token.getItem(), ...options })

  public readonly verifyToken = async (): Promise<JWTDto> => {
    const response = await this.$api.get<IJWT>('authentication/account/verify-token', this.requestConfigWith({}))
    return new JWTDto(response.data)
  }

  public readonly signOut = async (): Promise<void> => {
    await this.$api.post<JWTDto>('authentication/account/sign-out', {}, this.requestConfigWith({}))
  }

  public readonly updateEmail = async (payload: UpdateEmailDto): Promise<JWTDto> => {
    const response = await this.$api.patch<IJWT>(
      'authentication/account/update-email',
      payload,
      this.requestConfigWith({})
    )

    return new JWTDto(response.data)
  }

  public readonly updatePassword = async (payload: UpdatePasswordDto): Promise<JWTDto> => {
    const response = await this.$api.patch<IJWT>(
      'authentication/account/update-password',
      payload,
      this.requestConfigWith({})
    )

    return new JWTDto(response.data)
  }

  public readonly deleteAccount = async (payload: { password: string }): Promise<void> => {
    await this.$api.delete<void>('authentication/account/delete-account', this.requestConfigWith({ data: payload }))
  }
}

export { Account }
