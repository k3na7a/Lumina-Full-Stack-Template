import { BaseDto } from '../base.dto'

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

export { CreatePlatformDto, PlatformDto }
export type { iplatform }
