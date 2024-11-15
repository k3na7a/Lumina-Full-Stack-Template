import { PaginationOptions, PaginationDto } from '@/library/data/dto/pagination.dto'
import { AxiosService } from '@/library/utilities/helpers/axios.util'
import { ILocalStorageUtil } from '@/library/utilities/helpers/local-storage.util'
import { AxiosInstance, AxiosResponse } from 'axios'
import { CreateSeriesDto, SeriesDto } from '@/library/data/dto/games/series.dto'

class series {
  private readonly $api: AxiosInstance
  private readonly $token: ILocalStorageUtil

  constructor(api: AxiosInstance, token: ILocalStorageUtil) {
    this.$api = api
    this.$token = token
  }

  public readonly create = async (params: CreateSeriesDto): Promise<SeriesDto> => {
    return this.$api
      .put<SeriesDto>('admin/game-library/series', params, AxiosService.requestConfig({ token: this.$token.getItem() }))
      .then((response: AxiosResponse) => response.data)
  }

  public readonly getAll = async (): Promise<Array<SeriesDto>> => {
    return this.$api
      .get<Array<SeriesDto>>('admin/game-library/series', AxiosService.requestConfig({ token: this.$token.getItem() }))
      .then((response: AxiosResponse) => response.data.map((platform: SeriesDto) => new SeriesDto(platform)))
  }

  public readonly getPaginated = async (params: PaginationOptions): Promise<PaginationDto<SeriesDto>> => {
    return this.$api
      .get<PaginationDto<SeriesDto>>(
        'admin/game-library/series/paginated',
        AxiosService.requestConfig({ token: this.$token.getItem(), params })
      )
      .then(
        (response: AxiosResponse) =>
          new PaginationDto<SeriesDto>(
            response.data['data'].map((series: SeriesDto) => new SeriesDto(series)),
            response.data['meta']
          )
      )
  }

  public readonly update = async (id: string, payload: CreateSeriesDto): Promise<SeriesDto> => {
    return this.$api
      .patch<SeriesDto>(
        `admin/game-library/series/${id}`,
        payload,
        AxiosService.requestConfig({ token: this.$token.getItem() })
      )
      .then((response: AxiosResponse) => new SeriesDto(response.data))
  }

  public readonly remove = async (id: string): Promise<SeriesDto> => {
    return this.$api
      .delete<SeriesDto>(
        `admin/game-library/series/${id}`,
        AxiosService.requestConfig({ token: this.$token.getItem() })
      )
      .then((response: AxiosResponse) => new SeriesDto(response.data))
  }
}

export { series }
