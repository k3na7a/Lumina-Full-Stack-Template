import { CreatePublisherDto, PublisherDto } from '@/library/data/dto/games/publisher.dto'
import { PaginationOptions, PaginationDto } from '@/library/data/dto/pagination.dto'
import { AxiosService } from '@/library/utilities/helpers/axios.util'
import { ILocalStorageUtil } from '@/library/utilities/helpers/local-storage.util'
import { AxiosInstance, AxiosResponse } from 'axios'

class publishers {
  private readonly $api: AxiosInstance
  private readonly $token: ILocalStorageUtil

  constructor(api: AxiosInstance, token: ILocalStorageUtil) {
    this.$api = api
    this.$token = token
  }

  public readonly create = async (params: CreatePublisherDto): Promise<PublisherDto> => {
    return this.$api
      .put<PublisherDto>(
        'admin/game-library/publishers',
        params,
        AxiosService.requestConfig({ token: this.$token.getItem() })
      )
      .then((response: AxiosResponse) => response.data)
  }

  public readonly getAll = async (): Promise<Array<PublisherDto>> => {
    return this.$api
      .get<Array<PublisherDto>>(
        'admin/game-library/publishers',
        AxiosService.requestConfig({ token: this.$token.getItem() })
      )
      .then((response: AxiosResponse) => response.data.map((platform: PublisherDto) => new PublisherDto(platform)))
  }

  public readonly getPaginated = async (params: PaginationOptions): Promise<PaginationDto<PublisherDto>> => {
    return this.$api
      .get<PaginationDto<PublisherDto>>(
        'admin/game-library/publishers/paginated',
        AxiosService.requestConfig({ token: this.$token.getItem(), params })
      )
      .then(
        (response: AxiosResponse) =>
          new PaginationDto<PublisherDto>(
            response.data['data'].map((genre: PublisherDto) => new PublisherDto(genre)),
            response.data['meta']
          )
      )
  }

  public readonly update = async (id: string, payload: CreatePublisherDto): Promise<PublisherDto> => {
    return this.$api
      .patch<PublisherDto>(
        `admin/game-library/publishers/${id}`,
        payload,
        AxiosService.requestConfig({ token: this.$token.getItem() })
      )
      .then((response: AxiosResponse) => new PublisherDto(response.data))
  }

  public readonly remove = async (id: string): Promise<PublisherDto> => {
    return this.$api
      .delete<PublisherDto>(
        `admin/game-library/publishers/${id}`,
        AxiosService.requestConfig({ token: this.$token.getItem() })
      )
      .then((response: AxiosResponse) => new PublisherDto(response.data))
  }
}

export { publishers }
