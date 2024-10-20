import { BaseDto } from '../base.dto'

type ipublisher = {
  name: string
  slug: string
}

class CreatePublisherDto {
  public readonly name: string
  public readonly slug: string

  constructor(params: ipublisher) {
    this.name = params.name
    this.slug = params.slug
  }
}

class PublisherDto extends BaseDto {
  public readonly name: string
  public readonly slug: string

  constructor(params: PublisherDto) {
    super(params)
    this.name = params.name
    this.slug = params.slug
  }
}

export { PublisherDto, CreatePublisherDto }
export type { ipublisher }
