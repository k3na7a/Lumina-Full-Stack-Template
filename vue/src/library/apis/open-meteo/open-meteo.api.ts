// import { getForecastParams } from '@/library/data/dto/forecast.dto'
import { AxiosService } from '@/library/utils/axios.util'
import axios, { AxiosInstance, AxiosResponse } from 'axios'

const instance: AxiosInstance = axios.create({
  baseURL: 'https://api.open-meteo.com/',
  timeout: 10 * 1000,
  headers: { ['Content-Type']: 'application/json' }
})

class OpenMeteoAPI {
  public static getForecast = async (): Promise<object> => {
    return instance
      .get(
        'v1/forecast',
        AxiosService.requestConfig({
          params: {
            latitude: 45.4201,
            longitude: 75.7003,
            timezone: 'America/New_York',
            current: ['temperature_2m', 'apparent_temperature']
          }
        })
      )
      .then((response: AxiosResponse) => response.data)
  }
}

export { OpenMeteoAPI }
