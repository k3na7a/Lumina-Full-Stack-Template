import { AxiosInstance } from 'axios'

import { users } from './services/users.service'
import { ILocalStorageUtil } from '@/library/utils/local-storage.util'

class administration {
  public readonly users: users

  constructor(api: AxiosInstance, token: ILocalStorageUtil) {
    this.users = new users(api, token)
  }
}

export { administration }
