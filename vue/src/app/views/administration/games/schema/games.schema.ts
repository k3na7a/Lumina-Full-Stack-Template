import { Order, PaginationOptions, SortOptions } from '@/library/apis/localhost/dto/pagination.dto'

type columns = Array<{ name: string; label: string }>
const tableColumns: columns = [
  { name: 'user', label: 'Game' },
  { name: 'release', label: 'forms.release-date' }
]

const sort: Array<SortOptions> = [
  { sort: 'game.name', order: Order.ASC, label: 'forms.name' },
  { sort: 'game.release_date', order: Order.ASC, label: 'forms.release-date' },
  { sort: 'game.createdAt', order: Order.DESC, label: 'forms.newest' },
  { sort: 'game.createdAt', order: Order.ASC, label: 'forms.oldest' }
]

const defaultOptions: PaginationOptions = {
  take: 25,
  order: Order.ASC,
  page: 1,
  sort: 'game.name',
  search: undefined
}

export { sort, defaultOptions, tableColumns }
