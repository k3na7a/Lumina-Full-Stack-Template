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
  readonly name!: string
  readonly cover?: File
  readonly release_date!: Date
  readonly description?: string
  readonly slug!: string
  readonly platforms!: string[]

  constructor(new_game: icreategame) {
    this.name = new_game.name
    this.cover = new_game.cover || undefined
    this.release_date = new_game.release_date
    this.description = new_game.description
    this.slug = new_game.slug

    this.platforms = new_game.platforms?.map((v: iPlatform) => v.id) || []
  }
}

class GameDto {
  readonly id: string
  readonly createdAt: Date
  readonly updatedAt: Date

  readonly name: string
  readonly slug: string

  readonly description?: string

  readonly cover: string
  readonly release_date: Date

  readonly platforms: PlatformDto[]

  constructor(game: iGame) {
    this.id = game.id
    this.createdAt = new Date(game.createdAt)
    this.updatedAt = new Date(game.updatedAt)

    this.name = game.name
    this.slug = game.slug

    this.description = game.description || undefined
    this.release_date = new Date(game.release_date)
    this.cover = game.cover ? game.cover.uri : '/media/games/no-cover.png'

    this.platforms = game.platforms ? game.platforms.map((value: iPlatform) => new PlatformDto(value)) : []
  }
}

export type { iGame, icreategame }
export { GameDto, CreateGameDto }
