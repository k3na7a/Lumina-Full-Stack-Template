<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import moment from 'moment'

import { Order, PaginationDto, PaginationMeta, PaginationOptions, SortOptions } from '@/library/data/dto/pagination.dto'
import { Role, UserDto } from '@/library/data/dto/user/user.dto.ts'

import ContentLayout from '../../../../layouts/administration-layout/content.layout.vue'
import TablePaginatedComponent from '@/app/components/table/paginated.component.vue'

import { UserService } from '../services/user.service.ts'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { getUsersPaginated, updateUser, deleteUser } = UserService

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

const loading = ref<boolean>(true)
const options = reactive<PaginationOptions>(defaultOptions)
const response = reactive<{ data: Array<UserDto>; meta: PaginationMeta }>({
  data: [],
  meta: new PaginationMeta({ pageOptions: defaultOptions, itemCount: 0 })
})

async function getPaginatedData(payload: PaginationOptions): Promise<void> {
  loading.value = true

  await getUsersPaginated(payload)
    .then((res: PaginationDto<UserDto>) => {
      response.data = res.data
      response.meta = res.meta
    })
    .finally(() => (loading.value = false))
}

await getPaginatedData(defaultOptions)
watch(options, async (newVal: PaginationOptions): Promise<void> => {
  await getPaginatedData(newVal)
})
</script>

<template>
  <ContentLayout title="administration.users.title" subtitle="administration.users.subtitle">
    <template #table>
      <TablePaginatedComponent
        v-model:options="options"
        :loading
        :columns="tableColumns"
        :rows="response.data"
        :pages="response.meta?.pageCount"
        :sort-options="sort"
        :caption="t('administration.users.caption', { showing: response.data.length }, response.meta.itemCount)"
      >
        <template v-slot>
          <button class="btn btn-dark btn-icon" disabled type="button">
            <font-awesome-icon size="lg" :icon="['fas', 'ellipsis-vertical']" />
          </button>
        </template>
        <template #user="{ row }">
          <div class="d-flex align-items-center gap-2">
            <img class="avatar-icon rounded-circle" :src="row.profile.avatar" />

            <div class="d-flex flex-column flex-grow-1">
              <p class="text-light fw-semibold">
                {{ row.getFullName() }}
              </p>
              <small class="text-muted">{{ row.email }}</small>
            </div>
          </div>
        </template>

        <template #created="{ row }">
          <small class="fw-semibold text-muted">{{ moment(row.createdAt).format('LL') }}</small>
        </template>

        <template #role="{ row }">
          <div class="d-flex align-items-center">
            <small class="fw-semibold text-truncate text-primary">
              {{ $t(badges[row.role].label).toUpperCase() }}
            </small>
          </div>
        </template>

        <template #actions="{ row }">
          <div class="d-flex gap-1 flex-nowrap">
            <button
              v-tooltip="{ text: $t('actions.update'), position: 'bottom', trigger: 'hover' }"
              class="btn btn-dark btn-icon-sm px-0"
              type="button"
              @click="(_: MouseEvent) => updateUser(row, (_: UserDto) => { getPaginatedData(options) })"
            >
              <div class="d-flex flex-column align-items-center text-warning">
                <font-awesome-icon size="sm" :icon="['fas', 'pencil']" />
              </div>
            </button>
            <button
              v-tooltip="{ text: $t('actions.delete'), position: 'bottom', trigger: 'hover' }"
              class="btn btn-dark btn-icon-sm px-0"
              type="button"
              @click="(_: MouseEvent) => deleteUser(row, (_: UserDto) => { getPaginatedData(options) })"
            >
              <div class="d-flex flex-column align-items-center text-danger">
                <font-awesome-icon size="sm" :icon="['fas', 'trash-can']" />
              </div>
            </button>
          </div>
        </template>
      </TablePaginatedComponent>
    </template>
  </ContentLayout>
</template>
