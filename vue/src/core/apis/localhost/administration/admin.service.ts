import { AxiosInstance } from 'axios'

import { users } from './users/users.service'
import { games } from './games/games.service'
import { platforms } from './games/platforms.service'

class administration {
  public readonly users: users
  public readonly games: games
  public readonly platforms: platforms

  constructor(api: AxiosInstance) {
    this.users = new users(api)
    this.games = new games(api)
    this.platforms = new platforms(api)
  }
}

export { administration }
