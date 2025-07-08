import { AxiosInstance } from 'axios'

import { AxiosService } from '@/core/utils/axios.util'
import { UpdateEmailDto, UpdatePasswordDto } from '@/library/dto/user.dto'
import { IJWT, JWTDto } from '@/library/dto/JWT.dto'

class security {
  private readonly $api: AxiosInstance

  constructor(api: AxiosInstance) {
    this.$api = api
  }

  public readonly updateEmail = async (payload: UpdateEmailDto): Promise<JWTDto> => {
    const response = await this.$api.patch<IJWT>(
      'settings/security-and-privacy/update-email',
      payload,
      AxiosService.requestConfig({ withCredentials: true })
    )

    return new JWTDto(response.data)
  }

  public readonly updatePassword = async (payload: UpdatePasswordDto): Promise<JWTDto> => {
    const response = await this.$api.patch<IJWT>(
      'settings/security-and-privacy/update-password',
      payload,
      AxiosService.requestConfig({ withCredentials: true })
    )

    return new JWTDto(response.data)
  }

  public readonly deleteAccount = async (payload: { password: string }): Promise<void> => {
    await this.$api.delete<void>(
      'settings/security-and-privacy/delete-account',
      AxiosService.requestConfig({ data: payload, withCredentials: true })
    )
  }
}

export { security }
