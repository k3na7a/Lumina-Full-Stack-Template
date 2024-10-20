import { CreatePlatformDto, PlatformDto } from '@/library/apis/localhost/dto/game-library.dto'
import { PaginationOptions, PaginationDto } from '@/library/apis/localhost/dto/pagination.dto'
import { AxiosService } from '@/library/utilities/axios.util'
import { ILocalStorageUtil } from '@/library/utilities/local-storage.util'
import { AxiosInstance, AxiosResponse } from 'axios'

class platforms {
  private readonly $api: AxiosInstance
  private readonly $token: ILocalStorageUtil

  constructor(api: AxiosInstance, token: ILocalStorageUtil) {
    this.$api = api
    this.$token = token
  }

  public readonly create = async (dto: CreatePlatformDto): Promise<PlatformDto> => {
    return this.$api
      .put<PlatformDto>(
        'admin/game-library/platforms',
        dto,
        AxiosService.requestConfig({ token: this.$token.getItem() })
      )
      .then((response: AxiosResponse) => new PlatformDto(response.data))
  }

  public readonly getAll = async (): Promise<Array<PlatformDto>> => {
    return this.$api
      .get<Array<PlatformDto>>(
        'admin/game-library/platforms',
        AxiosService.requestConfig({ token: this.$token.getItem() })
      )
      .then((response: AxiosResponse) => response.data.map((platform: PlatformDto) => new PlatformDto(platform)))
  }

  public readonly getPaginated = async (params: PaginationOptions): Promise<PaginationDto<PlatformDto>> => {
    return this.$api
      .get<PaginationDto<PlatformDto>>(
        'admin/game-library/platforms/paginated',
        AxiosService.requestConfig({ token: this.$token.getItem(), params })
      )
      .then(
        (response: AxiosResponse) =>
          new PaginationDto<PlatformDto>(
            response.data['data'].map((platform: PlatformDto) => new PlatformDto(platform)),
            response.data['meta']
          )
      )
  }

  public readonly update = async (id: string, payload: CreatePlatformDto): Promise<PlatformDto> => {
    return this.$api
      .patch<PlatformDto>(
        `admin/game-library/platforms/${id}`,
        payload,
        AxiosService.requestConfig({ token: this.$token.getItem() })
      )
      .then((response: AxiosResponse) => new PlatformDto(response.data))
  }

  public readonly remove = async (id: string): Promise<PlatformDto> => {
    return this.$api
      .delete<PlatformDto>(
        `admin/game-library/platforms/${id}`,
        AxiosService.requestConfig({ token: this.$token.getItem() })
      )
      .then((response: AxiosResponse) => new PlatformDto(response.data))
  }
}

export { platforms }
