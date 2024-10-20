import { Order, PaginationOptions, SortOptions } from '@/library/apis/localhost/dto/pagination.dto'

const sort: Array<SortOptions> = [
  { sort: 'series.createdAt', order: Order.ASC, label: 'forms.oldest' },
  { sort: 'series.createdAt', order: Order.DESC, label: 'forms.newest' }
]

const defaultOptions: PaginationOptions = {
  take: 25,
  order: Order.ASC,
  page: 1,
  sort: 'series.createdAt',
  search: undefined
}

const header = [
  { name: 'name', label: 'forms.name' },
  { name: 'created', label: 'forms.created' },
  { name: 'actions', label: 'forms.actions' }
]

export { defaultOptions, sort, header }
