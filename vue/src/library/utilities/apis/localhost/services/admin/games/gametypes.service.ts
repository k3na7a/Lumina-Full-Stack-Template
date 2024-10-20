import { CreateGametypeDto, GametypeDto } from '@/library/data/dto/games/gametype.dto'
import { PaginationOptions, PaginationDto } from '@/library/data/dto/pagination.dto'
import { AxiosService } from '@/library/utilities/helpers/axios.util'
import { ILocalStorageUtil } from '@/library/utilities/helpers/local-storage.util'
import { AxiosInstance, AxiosResponse } from 'axios'

class gametypes {
  private readonly $api: AxiosInstance
  private readonly $token: ILocalStorageUtil

  constructor(api: AxiosInstance, token: ILocalStorageUtil) {
    this.$api = api
    this.$token = token
  }

  public readonly create = async (params: CreateGametypeDto): Promise<GametypeDto> => {
    return this.$api
      .put<GametypeDto>(
        'admin/game-library/gametypes',
        params,
        AxiosService.requestConfig({ token: this.$token.getItem() })
      )
      .then((response: AxiosResponse) => response.data)
  }

  public readonly getAll = async (): Promise<Array<GametypeDto>> => {
    return this.$api
      .get<Array<GametypeDto>>(
        'admin/game-library/gametypes',
        AxiosService.requestConfig({ token: this.$token.getItem() })
      )
      .then((response: AxiosResponse) => response.data.map((platform: GametypeDto) => new GametypeDto(platform)))
  }

  public readonly getPaginated = async (params: PaginationOptions): Promise<PaginationDto<GametypeDto>> => {
    return this.$api
      .get<PaginationDto<GametypeDto>>(
        'admin/game-library/gametypes/paginated',
        AxiosService.requestConfig({ token: this.$token.getItem(), params })
      )
      .then(
        (response: AxiosResponse) =>
          new PaginationDto<GametypeDto>(
            response.data['data'].map((genre: GametypeDto) => new GametypeDto(genre)),
            response.data['meta']
          )
      )
  }

  public readonly update = async (id: string, payload: CreateGametypeDto): Promise<GametypeDto> => {
    return this.$api
      .patch<GametypeDto>(
        `admin/game-library/gametypes/${id}`,
        payload,
        AxiosService.requestConfig({ token: this.$token.getItem() })
      )
      .then((response: AxiosResponse) => new GametypeDto(response.data))
  }

  public readonly remove = async (id: string): Promise<GametypeDto> => {
    return this.$api
      .delete<GametypeDto>(
        `admin/game-library/gametypes/${id}`,
        AxiosService.requestConfig({ token: this.$token.getItem() })
      )
      .then((response: AxiosResponse) => new GametypeDto(response.data))
  }
}

export { gametypes }
