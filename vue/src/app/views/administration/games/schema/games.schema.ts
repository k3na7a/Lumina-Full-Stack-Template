import { Order, PaginationOptions, SortOptions } from '@/library/apis/localhost/dto/pagination.dto'

type columns = Array<{ name: string; label: string }>
const tableColumns: columns = [
  { name: 'user', label: 'Game' },
  { name: 'actions', label: 'forms.actions' }
]

const sort: Array<SortOptions> = [
  { sort: 'user.createdAt', order: Order.DESC, label: 'forms.newest' },
  { sort: 'user.createdAt', order: Order.ASC, label: 'forms.oldest' }
]

const defaultOptions: PaginationOptions = {
  take: 25,
  order: Order.DESC,
  page: 1,
  sort: 'user.createdAt',
  search: undefined
}

export { sort, defaultOptions, tableColumns }
