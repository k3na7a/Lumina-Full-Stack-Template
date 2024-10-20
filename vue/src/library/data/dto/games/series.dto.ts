import { BaseDto } from '../base.dto'

type iseries = {
  name: string
  slug: string
}

class CreateSeriesDto {
  public readonly name: string
  public readonly slug: string

  constructor(params: iseries) {
    this.name = params.name
    this.slug = params.slug
  }
}

class SeriesDto extends BaseDto {
  public readonly name: string
  public readonly slug: string

  constructor(params: SeriesDto) {
    super(params)
    this.name = params.name
    this.slug = params.slug
  }
}

export { SeriesDto, CreateSeriesDto }
export type { iseries }
