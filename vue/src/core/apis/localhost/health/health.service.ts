import { AxiosInstance } from 'axios'

import { HealthResponseDto, IHealthResponse } from '@lib/dto/health.dto'

class health {
  private readonly $api: AxiosInstance

  constructor(api: AxiosInstance) {
    this.$api = api
  }

  public readonly healthCheck = async (): Promise<HealthResponseDto> => {
    const response = await this.$api.get<IHealthResponse>('health-check')
    return new HealthResponseDto(response.data)
  }
}

export { health }
