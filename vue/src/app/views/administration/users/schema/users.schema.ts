import { Order, SortOptions, PaginationOptions } from '@/library/apis/localhost/dto/pagination.dto'
import { Role } from '@/library/apis/localhost/dto/user.dto'

type Badges = { [key: string]: { theme: 'primary' | 'secondary' | 'warning' | 'danger' | 'info'; label: string } }
const badges: Badges = {
  [Role.ADMIN]: { theme: 'primary', label: 'forms.admin' },
  [Role.USER]: { theme: 'info', label: 'forms.user' }
}

type columns = Array<{ name: string; label: string }>
const tableColumns: columns = [
  { name: 'user', label: 'forms.user' },
  { name: 'role', label: 'forms.role' },
  { name: 'created', label: 'forms.date-registered' }
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
