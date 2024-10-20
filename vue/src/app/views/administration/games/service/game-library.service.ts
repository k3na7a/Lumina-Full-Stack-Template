import { DeveloperService } from './developers.service'
import { GameService } from './game.service'
import { GametypeService } from './gametype.service'
import { GenreService } from './genre.service'
import { PlatformService } from './platforms.service'
import { PublisherService } from './publisher.service'
import { SeriesService } from './series.service'

class GameLibraryService {
  public static games = GameService
  public static platforms = PlatformService
  public static genres = GenreService
  public static series = SeriesService
  public static developers = DeveloperService
  public static publishers = PublisherService
  public static gametypes = GametypeService
}

export { GameLibraryService }
