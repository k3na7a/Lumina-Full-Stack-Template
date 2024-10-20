import { BaseDto } from '../base.dto'

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

class GenreDto extends BaseDto {
  public readonly name: string
  public readonly slug: string

  constructor(params: GenreDto) {
    super(params)
    this.name = params.name
    this.slug = params.slug
  }
}

export { GenreDto, CreateGenreDto }
export type { igenre }
