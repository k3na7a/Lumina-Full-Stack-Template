import { CreateGenreDto, GenreDto } from '@/library/apis/localhost/dto/game-library.dto'
import { PaginationOptions, PaginationDto } from '@/library/apis/localhost/dto/pagination.dto'
import { AxiosService } from '@/library/utilities/axios.util'
import { ILocalStorageUtil } from '@/library/utilities/local-storage.util'
import { AxiosInstance, AxiosResponse } from 'axios'

class genres {
  private readonly $api: AxiosInstance
  private readonly $token: ILocalStorageUtil

  constructor(api: AxiosInstance, token: ILocalStorageUtil) {
    this.$api = api
    this.$token = token
  }

  public readonly create = async (params: CreateGenreDto): Promise<GenreDto> => {
    return this.$api
      .put<GenreDto>('admin/game-library/genres', params, AxiosService.requestConfig({ token: this.$token.getItem() }))
      .then((response: AxiosResponse) => response.data)
  }

  public readonly getAll = async (): Promise<Array<GenreDto>> => {
    return this.$api
      .get<Array<GenreDto>>('admin/game-library/genres', AxiosService.requestConfig({ token: this.$token.getItem() }))
      .then((response: AxiosResponse) => response.data.map((platform: GenreDto) => new GenreDto(platform)))
  }

  public readonly getPaginated = async (params: PaginationOptions): Promise<PaginationDto<GenreDto>> => {
    return this.$api
      .get<PaginationDto<GenreDto>>(
        'admin/game-library/genres/paginated',
        AxiosService.requestConfig({ token: this.$token.getItem(), params })
      )
      .then(
        (response: AxiosResponse) =>
          new PaginationDto<GenreDto>(
            response.data['data'].map((genre: GenreDto) => new GenreDto(genre)),
            response.data['meta']
          )
      )
  }

  public readonly update = async (id: string, payload: CreateGenreDto): Promise<GenreDto> => {
    return this.$api
      .patch<GenreDto>(
        `admin/game-library/genres/${id}`,
        payload,
        AxiosService.requestConfig({ token: this.$token.getItem() })
      )
      .then((response: AxiosResponse) => new GenreDto(response.data))
  }

  public readonly remove = async (id: string): Promise<GenreDto> => {
    return this.$api
      .delete<GenreDto>(`admin/game-library/genres/${id}`, AxiosService.requestConfig({ token: this.$token.getItem() }))
      .then((response: AxiosResponse) => new GenreDto(response.data))
  }
}

export { genres }
