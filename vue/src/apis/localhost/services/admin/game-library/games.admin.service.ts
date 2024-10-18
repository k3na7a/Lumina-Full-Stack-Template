import { AxiosInstance } from 'axios'

import { ILocalStorageUtil } from '@/utilities/local-storage.util'
import { platforms } from './platforms.service'
import { games } from './games.service'
import { genres } from './genres.service'

class game_library {
  public readonly platforms
  public readonly games
  public readonly genres

  constructor(api: AxiosInstance, token: ILocalStorageUtil) {
    this.games = new games(api, token)
    this.platforms = new platforms(api, token)
    this.genres = new genres(api, token)
  }
}

export { game_library }
