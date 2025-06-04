import { AxiosRequestConfig, AxiosResponse } from 'axios'

interface IRequestConfig {
  content?: string
  token?: string | null
  params?: Record<string, any>
  data?: Record<string, any>
}

class AxiosService {
  public static parseResponse = <T>(DtoClass: new (data: any) => T) => {
    return (response: AxiosResponse): T => new DtoClass(response.data)
  }

  public static requestConfig = ({ token, params, content, data }: IRequestConfig): AxiosRequestConfig => {
    const headers: Record<string, string> = {}

    if (token) headers['Authorization'] = `Bearer ${token}`
    if (content) headers['Content-Type'] = content

    return {
      ...(params && {
        params,
        paramsSerializer: {
          indexes: null
        }
      }),
      ...(Object.keys(headers).length && { headers }),
      ...(data && { data })
    }
  }
}

export { AxiosService }
export type { IRequestConfig }
