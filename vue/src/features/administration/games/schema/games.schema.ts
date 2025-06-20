import * as Yup from 'yup'

import { PaginationOptions, Order, SortOptions } from '@/core/apis/dto/pagination.dto'
import { PlatformDto } from '@/core/apis/dto/platform.dto'

const validationSchema = Yup.object().shape({
  name: Yup.string().required(),
  cover: Yup.mixed<File>().optional(),
  description: Yup.string().optional(),
  release_date: Yup.date().required(),
  slug: Yup.string().required(),
  platforms: Yup.array<PlatformDto>().optional()
})

const defaultPlatformOptions: PaginationOptions = {
  take: 25,
  order: Order.ASC,
  page: 1,
  sort: 'platform.name',
  search: undefined
}

type columns = Array<{ name: string; label?: string }>
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

const defaultOptions: PaginationOptions = {
  take: 25,
  order: Order.ASC,
  page: 1,
  sort: 'game.name',
  search: undefined
}

export { sort, defaultOptions, tableColumns, validationSchema, defaultPlatformOptions }
