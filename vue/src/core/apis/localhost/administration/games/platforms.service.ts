import { AxiosInstance, AxiosResponse } from 'axios'

import { ILocalStorageUtil } from '@/core/utils/local-storage.util'
import { PaginationDto, PaginationOptions } from '@/library/dto/pagination.dto'
import { AxiosService } from '@/core/utils/axios.util'
import { CreatePlatformDto, PlatformDto, iPlatform } from '@/library/dto/platform.dto'

class platforms {
  private readonly $api: AxiosInstance
  private readonly $token: ILocalStorageUtil

  private readonly requestConfigWith = (options: Partial<{ content: string; data: object; params: object }>) =>
    AxiosService.requestConfig({ token: this.$token.getItem(), ...options })

  constructor(api: AxiosInstance, token: ILocalStorageUtil) {
    this.$api = api
    this.$token = token
  }

  public readonly getPaginated = async (params: PaginationOptions): Promise<PaginationDto<PlatformDto>> => {
    const response: AxiosResponse = await this.$api.get(
      'administration/games-and-software/platforms',
      this.requestConfigWith({ params })
    )

    const games: PlatformDto[] = response.data['data'].map((game: iPlatform) => new PlatformDto(game))
    return new PaginationDto(games, response.data['meta'])
  }

  public readonly create = async (body: CreatePlatformDto): Promise<PlatformDto> => {
    const response: AxiosResponse = await this.$api.put<iPlatform>(
      'administration/games-and-software/platforms',
      body,
      this.requestConfigWith({})
    )
    return new PlatformDto(response.data)
  }
}

export { platforms }
