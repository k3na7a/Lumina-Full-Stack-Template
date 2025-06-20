import { AxiosInstance } from 'axios'

import { users } from './users/users.service'
import { ILocalStorageUtil } from '@/core/utilities/local-storage.util'
import { games } from './games/games.service'
import { platforms } from './games/platforms.service'

class administration {
  public readonly users: users
  public readonly games: games
  public readonly platforms: platforms

  constructor(api: AxiosInstance, token: ILocalStorageUtil) {
    this.users = new users(api, token)
    this.games = new games(api, token)
    this.platforms = new platforms(api, token)
  }
}

export { administration }
