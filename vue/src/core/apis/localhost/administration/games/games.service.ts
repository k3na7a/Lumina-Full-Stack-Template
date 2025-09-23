import { AxiosInstance, AxiosResponse } from 'axios'

import { PaginationDto, PaginationOptions } from '@lib/dto/pagination.dto'
import { AxiosService } from '@/shared/utils/axios.util'
import { CreateGameDto, GameDto, iGame } from '@lib/dto/game.dto'

class games {
  private readonly $api: AxiosInstance

  constructor(api: AxiosInstance) {
    this.$api = api
  }

  public readonly getGamesPaginated = async (
    params: PaginationOptions,
    token: string
  ): Promise<PaginationDto<GameDto>> => {
    const response: AxiosResponse = await this.$api.get(
      'administration/games-and-software/games',
      AxiosService.requestConfig({ token, params })
    )

    const games: GameDto[] = response.data['data'].map((game: iGame) => new GameDto(game))
    return new PaginationDto(games, response.data['meta'])
  }

  public readonly create = async (params: CreateGameDto, token: string): Promise<GameDto> => {
    const formData = new FormData()

    Object.keys(params).forEach((key: string) => {
      if (Object(params)[key]) formData.append(key, Object(params)[key])
    })

    const response = await this.$api.put<iGame>(
      'administration/games-and-software/games',
      params,
      AxiosService.requestConfig({ token, content: 'multipart/form-data' })
    )

    return new GameDto(response.data)
  }

  public readonly update = async (id: string, params: CreateGameDto, token: string) => {
    const formData = new FormData()

    Object.keys(params).forEach((key: string) => {
      if (Object(params)[key]) formData.append(key, Object(params)[key])
    })

    const response = await this.$api.patch<iGame>(
      `administration/games-and-software/games/${id}`,
      params,
      AxiosService.requestConfig({ token, content: 'multipart/form-data' })
    )

    return new GameDto(response.data)
  }

  public readonly delete = async (id: string, token: string): Promise<GameDto> => {
    const response = await this.$api.delete<iGame>(
      `administration/games-and-software/games/${id}`,
      AxiosService.requestConfig({ token })
    )

    return new GameDto(response.data)
  }
}

export { games }
