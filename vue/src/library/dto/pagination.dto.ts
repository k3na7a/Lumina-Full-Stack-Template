export enum Order {
  ASC = 'ASC',
  DESC = 'DESC'
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
  readonly order: Order = Order.ASC
  readonly page: number = 1
  readonly take: number = 10
}

interface PaginationMetaParameters {
  readonly pageOptions: PaginationOptions
  readonly itemCount: number
  readonly totalCount: number
}

export { PaginationOptions, PaginationDto, PaginationMeta }
export type { PaginationMetaParameters }
