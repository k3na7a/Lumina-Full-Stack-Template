import { AxiosInstance } from 'axios'

import { AxiosService } from '@/core/utils/axios.util'
import { UpdateEmailDto, UpdatePasswordDto } from '@/library/dto/user.dto'
import { IJWT, JWTDto } from '@/library/dto/JWT.dto'

class security {
  private readonly $api: AxiosInstance

  constructor(api: AxiosInstance) {
    this.$api = api
  }

  public readonly updateEmail = async (payload: UpdateEmailDto, token: string): Promise<JWTDto> => {
    const response = await this.$api.patch<IJWT>(
      'settings/security-and-privacy/update-email',
      payload,
      AxiosService.requestConfig({ token })
    )

    return new JWTDto(response.data)
  }

  public readonly updatePassword = async (payload: UpdatePasswordDto, token: string): Promise<JWTDto> => {
    const response = await this.$api.patch<IJWT>(
      'settings/security-and-privacy/update-password',
      payload,
      AxiosService.requestConfig({ token })
    )

    return new JWTDto(response.data)
  }

  public readonly deleteAccount = async (payload: { password: string }, token: string): Promise<void> => {
    await this.$api.delete<void>(
      'settings/security-and-privacy/delete-account',
      AxiosService.requestConfig({ token, data: payload })
    )
  }
}

export { security }
