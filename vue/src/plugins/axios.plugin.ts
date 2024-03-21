import { AxiosRequestConfig } from 'axios'

type IContentType = 'application/json'
interface IRequestConfig {
  content?: IContentType
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
