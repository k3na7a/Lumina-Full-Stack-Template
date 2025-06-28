import { Order, PaginationOptions, SortOptions } from '@/library/dto/pagination.dto'
import { Role } from '@/library/dto/user.dto'
import { Badges } from '@/library/types/badges.type'
import { columns } from '@/library/types/table-column.type'

const badges: Badges = {
  [Role.ADMIN]: { theme: 'primary', label: 'forms.admin' },
  [Role.USER]: { theme: 'info', label: 'forms.user' }
}

const tableColumns: columns = [
  { name: 'user', label: 'forms.user' },
  { name: 'email', label: 'forms.email' },
  { name: 'role', label: 'forms.role' },
  { name: 'created', label: 'forms.date-registered' },
  { name: 'actions' }
]

const defaultOptions: PaginationOptions = {
  take: 25,
  order: Order.DESC,
  page: 1,
  sort: 'user.createdAt',
  search: undefined
}

const sort: Array<SortOptions> = [
  { sort: 'user.createdAt', order: Order.DESC, label: 'forms.newest' },
  { sort: 'user.createdAt', order: Order.ASC, label: 'forms.oldest' }
]

export { sort, defaultOptions, tableColumns, badges }
