import { AxiosInstance } from 'axios'

import { users } from './services/users.admin.service'
import { ILocalStorageUtil } from '@/library/helpers/local-storage.util'

class administration {
  public readonly users: users

  constructor(api: AxiosInstance, token: ILocalStorageUtil) {
    this.users = new users(api, token)
  }
}

export { administration }
