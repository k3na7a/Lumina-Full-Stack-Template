import { AxiosInstance, AxiosResponse } from 'axios'

import { ILocalStorageUtil } from '@/library/utilities/local-storage.util'
import { PaginationDto, PaginationOptions } from '@/library/apis/localhost/dto/pagination.dto'
import { AxiosService } from '@/library/utilities/axios.util'
import { PlatformDto, iPlatform } from '../../dto/platform.dto'

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
      'administration/games-and-software/games',
      this.requestConfigWith({ params })
    )

    const games: PlatformDto[] = response.data['data'].map((game: iPlatform) => new PlatformDto(game))
    return new PaginationDto(games, response.data['meta'])
  }
}

export { platforms }
