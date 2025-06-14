interface iPlatform {
  readonly id: string
  readonly createdAt: Date
  readonly updatedAt: Date
  readonly name: string
  readonly release_date: Date
  readonly slug: string
}

class PlatformDto {
  readonly id: string
  readonly createdAt: Date
  readonly updatedAt: Date

  readonly name: string
  readonly release_date: Date
  readonly slug: string

  constructor(platform: iPlatform) {
    this.id = platform.id
    this.createdAt = platform.createdAt
    this.updatedAt = platform.updatedAt

    this.name = platform.name
    this.release_date = platform.release_date
    this.slug = platform.slug
  }
}

export type { iPlatform }
export { PlatformDto }
