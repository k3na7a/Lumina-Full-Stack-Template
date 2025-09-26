import { BaseDto } from './base.dto'
import { iImage } from './media.dto'
import { iPlatform, PlatformDto } from './platform.dto'

interface iGame {
  readonly id: string
  readonly createdAt: Date
  readonly updatedAt: Date
  readonly name: string
  readonly release_date: Date
  readonly description: string | null
  readonly slug: string
  readonly cover: iImage | null
  readonly platforms: iPlatform[]
}

interface icreategame {
  readonly name: string
  readonly cover?: File | null
  readonly description?: string
  readonly release_date: Date
  readonly slug: string
  readonly platforms?: iPlatform[]
}

class CreateGameDto {
  public readonly name!: string
  public readonly cover?: File
  public readonly release_date!: Date
  public readonly description?: string
  public readonly slug!: string
  public readonly platforms!: string[]

  constructor(new_game: icreategame) {
    this.name = new_game.name
    this.cover = new_game.cover || undefined
    this.release_date = new_game.release_date
    this.description = new_game.description
    this.slug = new_game.slug

    this.platforms = new_game.platforms?.map((v: iPlatform) => v.id) || []
  }
}

class GameDto extends BaseDto {
  public readonly name: string
  public readonly slug: string

  public readonly description?: string

  public readonly cover: string
  public readonly release_date: Date

  public readonly platforms: PlatformDto[]
  public readonly raw: Record<string, unknown>

  constructor(game: iGame) {
    super(game)

    this.name = game.name
    this.slug = game.slug

    this.description = game.description || undefined
    this.release_date = new Date(game.release_date)
    this.cover = game.cover ? game.cover.uri : '/media/games/no-cover.png'

    this.platforms = game.platforms ? game.platforms.map((value: iPlatform) => new PlatformDto(value)) : []

    this.raw = game as unknown as Record<string, unknown>
  }
}

export type { iGame, icreategame }
export { GameDto, CreateGameDto }
