import { Order, PaginationOptions } from '@/library/dto/pagination.dto'

const defaultOptions: PaginationOptions = {
  take: 25,
  order: Order.DESC,
  page: 1,
  sort: 'user.createdAt',
  search: undefined
}

export { defaultOptions }
