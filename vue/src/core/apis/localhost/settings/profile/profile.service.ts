import { AxiosInstance } from 'axios'

import { ILocalStorageUtil } from '@/core/utilities/local-storage.util'
import { AxiosService } from '@/core/utilities/axios.util'
import { UpdateProfileDto } from '@/core/apis/dto/user.dto'
import { IJWT, JWTDto } from '@/core/apis/dto/JWT.dto'

class profile {
  private readonly $api: AxiosInstance
  private readonly $token: ILocalStorageUtil

  constructor(api: AxiosInstance, token: ILocalStorageUtil) {
    this.$api = api
    this.$token = token
  }

  private readonly requestConfigWith = (options: Partial<{ content: string; data: object; params: object }>) =>
    AxiosService.requestConfig({ token: this.$token.getItem(), ...options })

  public readonly updateProfile = async (payload: UpdateProfileDto): Promise<JWTDto> => {
    const response = await this.$api.patch<IJWT>('settings/profile/update', payload, this.requestConfigWith({}))
    return new JWTDto(response.data)
  }

  public readonly updateAvatar = async (payload: File): Promise<JWTDto> => {
    const formData = new FormData()
    formData.append('avatar', payload)

    const response = await this.$api.post<IJWT>(
      'settings/profile/avatar/upload',
      formData,
      this.requestConfigWith({ content: 'multipart/form-data' })
    )

    return new JWTDto(response.data)
  }

  public readonly removeAvatar = async (): Promise<JWTDto> => {
    const response = await this.$api.delete<IJWT>('settings/profile/avatar/remove', this.requestConfigWith({}))
    return new JWTDto(response.data)
  }
}

export { profile }
