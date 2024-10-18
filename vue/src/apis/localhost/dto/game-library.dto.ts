class BaseDto {
  public readonly id: string
  public readonly createdAt: Date
  public readonly updatedAt: Date

  constructor({ id, createdAt, updatedAt }: BaseDto) {
    this.id = id
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}

type igame = {
  name: string
  cover?: File | null
  platforms?: Array<PlatformDto>
  genres?: Array<GenreDto>
  release_date: Date
  slug: string
}

type igenre = {
  name: string
  slug: string
}

class CreateGenreDto {
  public readonly name: string
  public readonly slug: string

  constructor(params: igenre) {
    this.name = params.name
    this.slug = params.slug
  }
}

class CreateGameDto {
  public readonly name: string
  public readonly release_date: Date
  public readonly slug: string
  public readonly platform_ids?: Array<string>
  public readonly genre_ids?: Array<string>
  public readonly cover?: File

  constructor(params: igame) {
    this.name = params.name
    this.release_date = params.release_date
    this.slug = params.slug
    this.cover = params.cover || undefined
    this.platform_ids = params.platforms?.map((platform: PlatformDto) => platform.id)
    this.genre_ids = params.genres?.map((platform: GenreDto) => platform.id)
  }
}

type Cover = {
  readonly filename: string
  readonly uri: string
}

type game = {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  release_date: Date
  slug: string
  platforms: Array<PlatformDto>
  genres: Array<GenreDto>
  cover: Cover | null
}

class GameDto extends BaseDto {
  public readonly name: string
  public readonly release_date: Date
  public readonly slug: string
  public readonly platforms: Array<PlatformDto>
  public readonly genres: Array<GenreDto>
  public readonly cover?: string

  constructor(params: game) {
    super(params)

    this.name = params.name
    this.release_date = new Date(params.release_date)
    this.slug = params.slug
    this.platforms = params.platforms
      .map((platform) => new PlatformDto(platform))
      .sort(function (a: PlatformDto, b: PlatformDto) {
        return new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
      })
    this.genres = params.genres
      .map((genre) => new GenreDto(genre))
      .sort(function (a: GenreDto, b: GenreDto) {
        return a.name.localeCompare(b.name)
      })
    this.cover = params.cover?.uri
  }
}

class GenreDto extends BaseDto {
  public readonly name: string
  public readonly slug: string

  constructor(params: GenreDto) {
    super(params)
    this.name = params.name
    this.slug = params.slug
  }
}

class PlatformDto extends BaseDto {
  public readonly name: string
  public readonly release_date: Date
  public readonly abbreviation: string
  public readonly slug: string

  constructor(params: PlatformDto) {
    super(params)
    this.name = params.name
    this.release_date = new Date(params.release_date)
    this.abbreviation = params.abbreviation
    this.slug = params.slug
  }
}

type iplatform = {
  name: string
  release_date: Date
  abbreviation: string
  slug: string
}

class CreatePlatformDto {
  public readonly name: string
  public readonly release_date: Date
  public readonly abbreviation: string
  public readonly slug: string

  constructor(params: iplatform) {
    this.name = params.name
    this.release_date = params.release_date
    this.abbreviation = params.abbreviation
    this.slug = params.slug
  }
}

export { PlatformDto, CreatePlatformDto, GameDto, CreateGameDto, GenreDto, CreateGenreDto }
export type { iplatform, igame, igenre, game }
