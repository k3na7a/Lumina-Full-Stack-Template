import { PaginationOptions, Order, SortOptions } from '@/core/apis/dto/pagination.dto'

type columns = Array<{ name: string; label?: string }>

const defaultOptions: PaginationOptions = {
  take: 25,
  order: Order.ASC,
  page: 1,
  sort: 'game.name',
  search: undefined
}

const platformOptions: PaginationOptions = {
  take: 25,
  order: Order.ASC,
  page: 1,
  sort: 'platform.name',
  search: undefined
}

const tableColumns: columns = [
  { name: 'user', label: 'administration.games-and-software.games.item' },
  { name: 'platforms', label: 'administration.games-and-software.platforms.label' },
  { name: 'release', label: 'forms.release-date' },
  { name: 'actions' }
]

const sort: Array<SortOptions> = [
  { sort: 'game.name', order: Order.ASC, label: 'forms.name' },
  { sort: 'game.release_date', order: Order.ASC, label: 'forms.release-date' },
  { sort: 'game.createdAt', order: Order.DESC, label: 'forms.newest' },
  { sort: 'game.createdAt', order: Order.ASC, label: 'forms.oldest' }
]

export { sort, defaultOptions, tableColumns, platformOptions }
