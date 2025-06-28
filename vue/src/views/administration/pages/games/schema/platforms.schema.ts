import * as Yup from 'yup'

import { SortOptions, Order, PaginationOptions } from '@/core/apis/dto/pagination.dto'

const validationSchema = Yup.object().shape({
  name: Yup.string().required(),
  release_date: Yup.date().required(),
  slug: Yup.string().required()
})

type columns = Array<{ name: string; label?: string }>
const tableColumns: columns = [
  { name: 'platform', label: 'Platform' },
  { name: 'count', label: '# of Games' },
  { name: 'release', label: 'forms.release-date' },
  { name: 'actions' }
]

const sort: Array<SortOptions> = [
  { sort: 'platform.name', order: Order.ASC, label: 'forms.name' },
  { sort: 'platform.release_date', order: Order.ASC, label: 'forms.release-date' },
  { sort: 'platform.createdAt', order: Order.DESC, label: 'forms.newest' },
  { sort: 'platform.createdAt', order: Order.ASC, label: 'forms.oldest' }
]

const defaultOptions: PaginationOptions = {
  take: 25,
  order: Order.ASC,
  page: 1,
  sort: 'platform.name',
  search: undefined
}

export { sort, defaultOptions, tableColumns, validationSchema }
