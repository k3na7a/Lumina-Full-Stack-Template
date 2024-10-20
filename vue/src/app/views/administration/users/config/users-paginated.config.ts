import { Order, PaginationOptions, SortOptions } from '@/library/data/dto/pagination.dto'
import { Role } from '@/library/data/dto/user/user.dto'

const defaultOptions: PaginationOptions = {
  take: 25,
  order: Order.DESC,
  page: 1,
  sort: 'user.createdAt',
  search: undefined
}

const badges: { [key: string]: { theme: 'primary' | 'secondary'; label: string } } = {
  [Role.ADMIN]: { theme: 'primary', label: 'forms.admin' },
  [Role.USER]: { theme: 'secondary', label: 'forms.user' }
}

const sort: Array<SortOptions> = [
  { sort: 'user.createdAt', order: Order.DESC, label: 'forms.newest' },
  { sort: 'user.createdAt', order: Order.ASC, label: 'forms.oldest' }
]

const tableColumns: Array<{ name: string; label: string }> = [
  { name: 'user', label: 'forms.user' },
  { name: 'role', label: 'forms.role' },
  { name: 'created', label: 'forms.date-registered' },
  { name: 'actions', label: 'forms.actions' }
]

export { defaultOptions, badges, sort, tableColumns }
