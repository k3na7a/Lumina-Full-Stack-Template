import { CreateDeveloperDto, DeveloperDto } from '@/library/data/dto/games/developer.dto'
import { PaginationOptions, PaginationDto } from '@/library/data/dto/pagination.dto'
import { AxiosService } from '@/library/utilities/helpers/axios.util'
import { ILocalStorageUtil } from '@/library/utilities/helpers/local-storage.util'
import { AxiosInstance, AxiosResponse } from 'axios'

class developers {
  private readonly $api: AxiosInstance
  private readonly $token: ILocalStorageUtil

  constructor(api: AxiosInstance, token: ILocalStorageUtil) {
    this.$api = api
    this.$token = token
  }

  public readonly create = async (params: CreateDeveloperDto): Promise<DeveloperDto> => {
    return this.$api
      .put<DeveloperDto>(
        'admin/game-library/developers',
        params,
        AxiosService.requestConfig({ token: this.$token.getItem() })
      )
      .then((response: AxiosResponse) => response.data)
  }

  public readonly getAll = async (): Promise<Array<DeveloperDto>> => {
    return this.$api
      .get<Array<DeveloperDto>>(
        'admin/game-library/developers',
        AxiosService.requestConfig({ token: this.$token.getItem() })
      )
      .then((response: AxiosResponse) => response.data.map((platform: DeveloperDto) => new DeveloperDto(platform)))
  }

  public readonly getPaginated = async (params: PaginationOptions): Promise<PaginationDto<DeveloperDto>> => {
    return this.$api
      .get<PaginationDto<DeveloperDto>>(
        'admin/game-library/developers/paginated',
        AxiosService.requestConfig({ token: this.$token.getItem(), params })
      )
      .then(
        (response: AxiosResponse) =>
          new PaginationDto<DeveloperDto>(
            response.data['data'].map((genre: DeveloperDto) => new DeveloperDto(genre)),
            response.data['meta']
          )
      )
  }

  public readonly update = async (id: string, payload: CreateDeveloperDto): Promise<DeveloperDto> => {
    return this.$api
      .patch<DeveloperDto>(
        `admin/game-library/developers/${id}`,
        payload,
        AxiosService.requestConfig({ token: this.$token.getItem() })
      )
      .then((response: AxiosResponse) => new DeveloperDto(response.data))
  }

  public readonly remove = async (id: string): Promise<DeveloperDto> => {
    return this.$api
      .delete<DeveloperDto>(
        `admin/game-library/developers/${id}`,
        AxiosService.requestConfig({ token: this.$token.getItem() })
      )
      .then((response: AxiosResponse) => new DeveloperDto(response.data))
  }
}

export { developers }
