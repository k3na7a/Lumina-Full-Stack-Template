import { Order, PaginationOptions, SortOptions } from '@/apis/localhost/dto/pagination.dto'

const sort: Array<SortOptions> = [
  { sort: 'platform.createdAt', order: Order.ASC, label: 'forms.oldest' },
  { sort: 'platform.createdAt', order: Order.DESC, label: 'forms.newest' },
  { sort: 'platform.release_date', order: Order.ASC, label: 'forms.release-date' }
]

const defaultOptions: PaginationOptions = {
  take: 25,
  order: Order.ASC,
  page: 1,
  sort: 'platform.release_date',
  search: undefined
}

const header = [
  { name: 'name', label: 'forms.name' },
  { name: 'abbreviation', label: 'forms.abbreviation' },
  { name: 'released', label: 'forms.release-date' },
  { name: 'created', label: 'forms.created' },
  { name: 'actions', label: 'forms.actions' }
]

export { defaultOptions, sort, header }
