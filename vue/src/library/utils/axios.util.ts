import { AxiosRequestConfig } from 'axios'

interface IRequestConfig {
  content?: string
  token?: string | null
  params?: Object
  data?: Object
}

class AxiosService {
  public static requestConfig = ({ token, params, content, data }: IRequestConfig): AxiosRequestConfig => {
    return {
      ...(params && {
        params,
        paramsSerializer: {
          indexes: null
        }
      }),
      headers: {
        ...(content && { ['Content-Type']: content }),
        ...(token && { ['Authorization']: `Bearer ${token}` })
      },
      ...(data && { data })
    }
  }
}

export { AxiosService }
export type { IRequestConfig }
