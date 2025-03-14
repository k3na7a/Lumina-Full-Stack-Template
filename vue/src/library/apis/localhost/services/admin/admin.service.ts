import { AxiosInstance } from 'axios'

import { users } from './users/users.admin.service'
import { ILocalStorageUtil } from '@/library/utilities/helpers/local-storage.util'

class administration {
  public readonly users: users

  constructor(api: AxiosInstance, token: ILocalStorageUtil) {
    this.users = new users(api, token)
  }
}

export { administration }
