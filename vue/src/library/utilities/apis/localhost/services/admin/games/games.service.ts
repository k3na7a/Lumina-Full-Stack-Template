import { PaginationOptions, PaginationDto } from '@/library/data/dto/pagination.dto'
import { AxiosService } from '@/library/utilities/helpers/axios.util'
import { ILocalStorageUtil } from '@/library/utilities/helpers/local-storage.util'
import { AxiosInstance, AxiosResponse } from 'axios'
import { CreateGameDto, GameDto, game } from '@/library/data/dto/games/game.dto'

class games {
  private readonly $api: AxiosInstance
  private readonly $token: ILocalStorageUtil

  constructor(api: AxiosInstance, token: ILocalStorageUtil) {
    this.$api = api
    this.$token = token
  }

  public readonly create = async (params: CreateGameDto): Promise<GameDto> => {
    const formData = new FormData()

    Object.keys(params).forEach((key: string) => {
      if (Object(params)[key]) formData.append(key, Object(params)[key])
    })

    return this.$api
      .put<GameDto>(
        'admin/game-library/games',
        params,
        AxiosService.requestConfig({ token: this.$token.getItem(), content: 'multipart/form-data' })
      )
      .then((response: AxiosResponse) => new GameDto(response.data))
  }

  public readonly update = async (id: string, params: CreateGameDto): Promise<GameDto> => {
    const formData = new FormData()

    Object.keys(params).forEach((key: string) => {
      if (Object(params)[key]) formData.append(key, Object(params)[key])
    })

    return this.$api
      .patch<GameDto>(
        `admin/game-library/games/${id}`,
        params,
        AxiosService.requestConfig({ token: this.$token.getItem(), content: 'multipart/form-data' })
      )
      .then((response: AxiosResponse) => new GameDto(response.data))
  }

  public readonly getPaginated = async (params: PaginationOptions): Promise<PaginationDto<GameDto>> => {
    return this.$api
      .get<PaginationDto<GameDto>>(
        'admin/game-library/games/paginated',
        AxiosService.requestConfig({ token: this.$token.getItem(), params })
      )
      .then((response: AxiosResponse) => {
        return new PaginationDto<GameDto>(
          response.data['data'].map((game: game) => new GameDto(game)),
          response.data['meta']
        )
      })
  }

  public readonly remove = async (id: string): Promise<GameDto> => {
    return this.$api
      .delete<GameDto>(`admin/game-library/games/${id}`, AxiosService.requestConfig({ token: this.$token.getItem() }))
      .then((response: AxiosResponse) => response.data)
  }
}

export { games }
