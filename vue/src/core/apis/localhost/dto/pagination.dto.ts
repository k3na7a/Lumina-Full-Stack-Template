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
  readonly data: T[]
  readonly meta: PaginationMeta

  constructor(data: T[], meta: PaginationMeta) {
    this.data = data
    this.meta = meta
  }
}

class PaginationOptions {
  order: Order = Order.ASC
  page: number = 1
  take: number = 10
  sort?: string
  search?: string
  expanded?: boolean
}

interface PaginationMetaParameters {
  readonly pageOptions: PaginationOptions
  readonly itemCount: number
}

export { PaginationOptions, PaginationDto, PaginationMeta, Order }
export type { PaginationMetaParameters, SortOptions }
