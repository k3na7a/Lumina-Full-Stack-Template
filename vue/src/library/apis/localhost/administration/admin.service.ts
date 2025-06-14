import { AxiosInstance } from 'axios'

import { users } from './users/users.service'
import { ILocalStorageUtil } from '@/library/utilities/local-storage.util'
import { games } from './games/games.service'

class administration {
  public readonly users: users
  public readonly games: games

  constructor(api: AxiosInstance, token: ILocalStorageUtil) {
    this.users = new users(api, token)
    this.games = new games(api, token)
  }
}

export { administration }
