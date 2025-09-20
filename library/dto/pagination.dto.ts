enum Order {
  ASC = 'ASC',
  DESC = 'DESC'
}

type SortOptions = {
  sort: string
  order: Order
  label: string
}

class PaginationMeta {
  readonly page: number
  readonly take: number
  readonly itemCount: number
  readonly pageCount: number
  readonly hasPreviousPage: boolean
  readonly hasNextPage: boolean

  constructor({ pageOptions, itemCount }: PaginationMetaParameters) {
    this.page = pageOptions.page
    this.take = pageOptions.take
    this.itemCount = itemCount
    this.pageCount = Math.ceil(this.itemCount / this.take)
    this.hasPreviousPage = this.page > 1
    this.hasNextPage = this.page < this.pageCount
  }
}

class PaginationDto<T> {
  public readonly data: T[]
  public readonly meta: PaginationMeta

  constructor(data: T[], meta: PaginationMeta) {
    this.data = data
    this.meta = meta
  }
}

class PaginationOptions {
  public readonly order: Order = Order.ASC
  public readonly page: number = 1
  public readonly take: number = 10
  public readonly sort?: string
  public readonly search?: string
  public readonly expanded?: boolean
}

interface PaginationMetaParameters {
  readonly pageOptions: PaginationOptions
  readonly itemCount: number
}

export { PaginationOptions, PaginationDto, PaginationMeta, Order }
export type { PaginationMetaParameters, SortOptions }
