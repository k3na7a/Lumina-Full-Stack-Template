import { BaseDto } from '../base.dto'

type ideveloper = {
  name: string
  slug: string
}

class CreateDeveloperDto {
  public readonly name: string
  public readonly slug: string

  constructor(params: ideveloper) {
    this.name = params.name
    this.slug = params.slug
  }
}

class DeveloperDto extends BaseDto {
  public readonly name: string
  public readonly slug: string

  constructor(params: DeveloperDto) {
    super(params)
    this.name = params.name
    this.slug = params.slug
  }
}

export { DeveloperDto, CreateDeveloperDto }
export type { ideveloper }
