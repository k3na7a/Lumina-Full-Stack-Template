import { AxiosInstance } from 'axios'

import { users } from './users/users.admin.service'
import { ILocalStorageUtil } from '@/utilities/local-storage.util'
import { game_library } from './game-library/games.admin.service'

class administration {
  public readonly users: users
  public readonly game_library: game_library

  constructor(api: AxiosInstance, token: ILocalStorageUtil) {
    this.users = new users(api, token)
    this.game_library = new game_library(api, token)
  }
}

export { administration }
