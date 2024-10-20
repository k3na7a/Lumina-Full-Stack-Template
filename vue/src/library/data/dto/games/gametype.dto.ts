import { BaseDto } from '../base.dto'

type igametype = {
  name: string
  slug: string
}

class CreateGametypeDto {
  public readonly name: string
  public readonly slug: string

  constructor(params: igametype) {
    this.name = params.name
    this.slug = params.slug
  }
}

class GametypeDto extends BaseDto {
  public readonly name: string
  public readonly slug: string

  constructor(params: GametypeDto) {
    super(params)
    this.name = params.name
    this.slug = params.slug
  }
}

export { GametypeDto, CreateGametypeDto }
export type { igametype }
