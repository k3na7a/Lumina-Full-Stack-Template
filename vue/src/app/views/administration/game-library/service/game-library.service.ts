import { GameService } from './game.service'
import { GenreService } from './genre.service'
import { PlatformService } from './platforms.service'
import { SeriesService } from './series.service'

class GameLibraryService {
  public static games = GameService
  public static platforms = PlatformService
  public static genres = GenreService
  public static series = SeriesService
}

export { GameLibraryService }
