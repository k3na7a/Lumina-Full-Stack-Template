type timezone = 'America/New_York'

interface getForecastParams {
  latitude: number
  longitude: number
  timezone: timezone
}

class Forecast {}

export { Forecast }
export type { getForecastParams }
