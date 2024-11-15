import { AxiosInstance } from 'axios'

import { ILocalStorageUtil } from '@/library/utilities/helpers/local-storage.util'
import { platforms } from './platforms.service'
import { games } from './games.service'
import { genres } from './genres.service'
import { series } from './series.service'
import { developers } from './developers.service'
import { publishers } from './publishers.service'
import { gametypes } from './gametypes.service'

class game_library {
  public readonly platforms: platforms
  public readonly games: games
  public readonly genres: genres
  public readonly series: series
  public readonly developers: developers
  public readonly publishers: publishers
  public readonly gametypes: gametypes

  constructor(api: AxiosInstance, token: ILocalStorageUtil) {
    this.games = new games(api, token)
    this.platforms = new platforms(api, token)
    this.genres = new genres(api, token)
    this.series = new series(api, token)
    this.developers = new developers(api, token)
    this.publishers = new publishers(api, token)
    this.gametypes = new gametypes(api, token)
  }
}

export { game_library }
