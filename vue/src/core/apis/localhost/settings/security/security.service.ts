import { AxiosInstance } from 'axios'

import { ILocalStorageUtil } from '@/core/utils/local-storage.util'
import { AxiosService } from '@/core/utils/axios.util'
import { UpdateEmailDto, UpdatePasswordDto } from '@/core/apis/dto/user.dto'
import { IJWT, JWTDto } from '@/core/apis/dto/JWT.dto'

class security {
  private readonly $api: AxiosInstance
  private readonly $token: ILocalStorageUtil

  constructor(api: AxiosInstance, token: ILocalStorageUtil) {
    this.$api = api
    this.$token = token
  }

  private readonly requestConfigWith = (options: Partial<{ content: string; data: object; params: object }>) =>
    AxiosService.requestConfig({ token: this.$token.getItem(), ...options })

  public readonly updateEmail = async (payload: UpdateEmailDto): Promise<JWTDto> => {
    const response = await this.$api.patch<IJWT>(
      'settings/security-and-privacy/update-email',
      payload,
      this.requestConfigWith({})
    )

    return new JWTDto(response.data)
  }

  public readonly updatePassword = async (payload: UpdatePasswordDto): Promise<JWTDto> => {
    const response = await this.$api.patch<IJWT>(
      'settings/security-and-privacy/update-password',
      payload,
      this.requestConfigWith({})
    )

    return new JWTDto(response.data)
  }

  public readonly deleteAccount = async (payload: { password: string }): Promise<void> => {
    await this.$api.delete<void>(
      'settings/security-and-privacy/delete-account',
      this.requestConfigWith({ data: payload })
    )
  }
}

export { security }
