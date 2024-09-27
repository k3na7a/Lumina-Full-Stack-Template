import { AxiosError } from 'axios'

import { ToastStore, useToastStore } from '@/app/store/toast.store'

import { LocalhostAPI } from '@/library/apis/localhost/localhost.api'
import { PaginationDto, PaginationMeta, PaginationOptions } from '@/library/dto/pagination.dto'
import { UserDto } from '@/library/dto/user.dto'

class UserService {
  public static async getUsersPaginated(params: PaginationOptions): Promise<PaginationDto<UserDto>> {
    const { addToast }: ToastStore = useToastStore()
    return LocalhostAPI.administration.users.getUsersPaginated(params).catch((error: AxiosError) => {
      addToast({ title: error.response?.statusText || 'ERROR', body: error.message })
      return { data: [], meta: new PaginationMeta({ pageOptions: params, itemCount: 0 }) }
    })
  }
}

export { UserService }
