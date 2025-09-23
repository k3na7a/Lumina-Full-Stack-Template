import { AxiosInstance } from 'axios'

import { AxiosService } from '@/shared/utils/axios.util'
import { iUser, UpdateProfileDto, UserDto } from '@lib/dto/user.dto'

class profile {
  private readonly $api: AxiosInstance

  constructor(api: AxiosInstance) {
    this.$api = api
  }

  public readonly updateProfile = async (payload: UpdateProfileDto, token: string): Promise<UserDto> => {
    const response = await this.$api.patch<iUser>(
      'settings/profile/update',
      payload,
      AxiosService.requestConfig({ token })
    )
    return new UserDto(response.data)
  }

  public readonly updateAvatar = async (payload: File, token: string): Promise<UserDto> => {
    const formData = new FormData()
    formData.append('avatar', payload)

    const response = await this.$api.post<iUser>(
      'settings/profile/avatar/upload',
      formData,
      AxiosService.requestConfig({ token, content: 'multipart/form-data' })
    )

    return new UserDto(response.data)
  }

  public readonly removeAvatar = async (token: string): Promise<UserDto> => {
    const response = await this.$api.delete<iUser>(
      'settings/profile/avatar/remove',
      AxiosService.requestConfig({ token })
    )
    return new UserDto(response.data)
  }
}

export { profile }
