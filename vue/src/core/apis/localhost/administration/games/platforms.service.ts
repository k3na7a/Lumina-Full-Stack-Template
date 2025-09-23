import { AxiosInstance, AxiosResponse } from 'axios'

import { PaginationDto, PaginationOptions } from '@lib/dto/pagination.dto'
import { AxiosService } from '@/shared/utils/axios.util'
import { CreatePlatformDto, PlatformDto, iPlatform } from '@lib/dto/platform.dto'

class platforms {
  private readonly $api: AxiosInstance

  constructor(api: AxiosInstance) {
    this.$api = api
  }

  public readonly getPaginated = async (
    params: PaginationOptions,
    token: string
  ): Promise<PaginationDto<PlatformDto>> => {
    const response: AxiosResponse = await this.$api.get(
      'administration/games-and-software/platforms',
      AxiosService.requestConfig({ token, params })
    )

    const games: PlatformDto[] = response.data['data'].map((game: iPlatform) => new PlatformDto(game))
    return new PaginationDto(games, response.data['meta'])
  }

  public readonly create = async (body: CreatePlatformDto, token: string): Promise<PlatformDto> => {
    const response: AxiosResponse = await this.$api.put<iPlatform>(
      'administration/games-and-software/platforms',
      body,
      AxiosService.requestConfig({ token })
    )

    return new PlatformDto(response.data)
  }

  public readonly update = async (id: string, body: CreatePlatformDto, token: string): Promise<PlatformDto> => {
    const response: AxiosResponse = await this.$api.patch<iPlatform>(
      `administration/games-and-software/platforms/${id}`,
      body,
      AxiosService.requestConfig({ token })
    )

    return new PlatformDto(response.data)
  }

  public readonly delete = async (id: string, token: string): Promise<PlatformDto> => {
    const response: AxiosResponse = await this.$api.delete<iPlatform>(
      `administration/games-and-software/platforms/${id}`,
      AxiosService.requestConfig({ token })
    )

    return new PlatformDto(response.data)
  }
}

export { platforms }
