import { AxiosRequestConfig } from 'axios'

interface IRequestConfig {
  content?: string
  token?: string | null
  params?: Object
}

class AxiosService {
  public static requestConfig = ({ token, params, content }: IRequestConfig): AxiosRequestConfig => {
    return {
      ...(params && { params }),
      headers: {
        ...(content && { ['Content-Type']: content }),
        ...(token && { ['Authorization']: `Bearer ${token}` })
      }
    }
  }
}

export { AxiosService }
export type { IRequestConfig }
