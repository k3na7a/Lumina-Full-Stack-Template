import { Order, PaginationOptions, SortOptions } from '@/library/apis/localhost/dto/pagination.dto'

const sort: Array<SortOptions> = [
  { sort: 'game.createdAt', order: Order.ASC, label: 'forms.oldest' },
  { sort: 'game.createdAt', order: Order.DESC, label: 'forms.newest' },
  { sort: 'game.release_date', order: Order.ASC, label: 'forms.release-date' }
]

const defaultOptions: PaginationOptions = {
  take: 25,
  order: Order.ASC,
  page: 1,
  sort: 'game.release_date',
  search: undefined
}

const header = [
  { name: 'name', label: 'Game' },
  { name: 'platforms', label: 'Platforms' },
  { name: 'genres', label: 'Genres' },
  { name: 'created', label: 'forms.created' },
  { name: 'actions', label: 'forms.actions' }
]

export { defaultOptions, sort, header }
