import { DeveloperDto } from '@/library/data/dto/games/developer.dto'
import { GameDto } from '@/library/data/dto/games/game.dto'
import { GametypeDto } from '@/library/data/dto/games/gametype.dto'
import { GenreDto } from '@/library/data/dto/games/genre.dto'
import { PlatformDto } from '@/library/data/dto/games/platform.dto'
import { PublisherDto } from '@/library/data/dto/games/publisher.dto'
import { SeriesDto } from '@/library/data/dto/games/series.dto'
import * as Yup from 'yup'

const platform = Yup.object().shape({
  name: Yup.string().required(),
  release_date: Yup.date().required(),
  abbreviation: Yup.string().required(),
  slug: Yup.string().required()
})

const genre = Yup.object().shape({
  name: Yup.string().required(),
  slug: Yup.string().required()
})

const series = Yup.object().shape({
  name: Yup.string().required(),
  slug: Yup.string().required()
})

const game = Yup.object().shape({
  name: Yup.string().required(),
  cover: Yup.mixed<File>().optional(),
  platforms: Yup.array<PlatformDto>().optional(),
  genres: Yup.array<GenreDto>().optional(),
  release_date: Yup.date().required(),
  series: Yup.array<SeriesDto>().optional(),
  children: Yup.array<GameDto>().optional(),
  developers: Yup.array<DeveloperDto>().optional(),
  publishers: Yup.array<PublisherDto>().optional(),
  gametype: Yup.mixed<GametypeDto>().required(),
  slug: Yup.string().required()
})

export { platform, game, genre, series }
