import { BaseDto } from './base.dto'

interface iPlatform {
  readonly id: string
  readonly createdAt: Date
  readonly updatedAt: Date

  readonly name: string
  readonly release_date: Date
  readonly slug: string

  readonly gameCount?: number
}

interface icreateplatform {
  readonly name: string
  readonly release_date: Date
  readonly slug: string
}

class CreatePlatformDto {
  readonly name: string
  readonly release_date: Date
  readonly slug: string

  constructor(platform: icreateplatform) {
    this.name = platform.name
    this.release_date = platform.release_date
    this.slug = platform.slug
  }
}

class PlatformDto extends BaseDto {
  public readonly name: string
  public readonly release_date: Date
  public readonly slug: string
  public readonly gameCount?: number
  public readonly raw: Record<string, unknown>

  constructor(platform: iPlatform) {
    super(platform)

    this.name = platform.name
    this.release_date = new Date(platform.release_date)
    this.slug = platform.slug
    this.gameCount = platform.gameCount
    this.raw = platform as unknown as Record<string, unknown>
  }
}

export type { iPlatform, icreateplatform }
export { PlatformDto, CreatePlatformDto }
