import { AxiosInstance, AxiosResponse } from 'axios'

import { ILocalStorageUtil } from '@/core/utils/local-storage.util'
import { PaginationDto, PaginationOptions } from '@/core/apis/dto/pagination.dto'
import { AxiosService } from '@/core/utils/axios.util'
import { CreateGameDto, GameDto, iGame } from '@/core/apis/dto/game.dto'

class games {
  private readonly $api: AxiosInstance
  private readonly $token: ILocalStorageUtil

  private readonly requestConfigWith = (options: Partial<{ content: string; data: object; params: object }>) =>
    AxiosService.requestConfig({ token: this.$token.getItem(), ...options })

  constructor(api: AxiosInstance, token: ILocalStorageUtil) {
    this.$api = api
    this.$token = token
  }

  public readonly getGamesPaginated = async (params: PaginationOptions): Promise<PaginationDto<GameDto>> => {
    const response: AxiosResponse = await this.$api.get(
      'administration/games-and-software/games',
      this.requestConfigWith({ params })
    )

    const games: GameDto[] = response.data['data'].map((game: iGame) => new GameDto(game))
    return new PaginationDto(games, response.data['meta'])
  }

  public readonly create = async (params: CreateGameDto): Promise<GameDto> => {
    const formData = new FormData()

    Object.keys(params).forEach((key: string) => {
      if (Object(params)[key]) formData.append(key, Object(params)[key])
    })

    const response = await this.$api.put<iGame>(
      'administration/games-and-software/games',
      params,
      this.requestConfigWith({ content: 'multipart/form-data' })
    )

    return new GameDto(response.data)
  }

  public readonly delete = async (id: string): Promise<GameDto> => {
    const response = await this.$api.delete<iGame>(
      `administration/games-and-software/games/${id}`,
      this.requestConfigWith({})
    )

    return new GameDto(response.data)
  }
}

export { games }
