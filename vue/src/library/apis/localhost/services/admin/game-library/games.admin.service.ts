import { AxiosInstance } from 'axios'

import { ILocalStorageUtil } from '@/library/utilities/local-storage.util'
import { platforms } from './platforms.service'
import { games } from './games.service'
import { genres } from './genres.service'
import { series } from './series.service'

class game_library {
  public readonly platforms
  public readonly games
  public readonly genres
  public readonly series

  constructor(api: AxiosInstance, token: ILocalStorageUtil) {
    this.games = new games(api, token)
    this.platforms = new platforms(api, token)
    this.genres = new genres(api, token)
    this.series = new series(api, token)
  }
}

export { game_library }
