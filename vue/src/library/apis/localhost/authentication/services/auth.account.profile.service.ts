import { AxiosInstance } from 'axios'

import { ILocalStorageUtil } from '@/library/utils/local-storage.util'
import { AxiosService } from '@/library/utils/axios.util'
import { UpdateProfileDto } from '@/library/apis/localhost/dto/user.dto'
import { IJWT, JWTDto } from '@/library/apis/localhost/dto/JWT.dto'

class Profile {
  private readonly $api: AxiosInstance
  private readonly $token: ILocalStorageUtil

  constructor(api: AxiosInstance, token: ILocalStorageUtil) {
    this.$api = api
    this.$token = token
  }

  private requestConfigWith = (options: Partial<{ content: string; data: object }>) =>
    AxiosService.requestConfig({ token: this.$token.getItem(), ...options })

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

export { Profile }
