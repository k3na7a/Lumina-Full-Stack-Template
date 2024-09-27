<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import moment from 'moment'

import { PaginationDto, PaginationMeta, PaginationOptions } from '@/library/dto/pagination.dto'
import { UserDto } from '@/library/dto/user.dto'

import TablePaginatedComponent from '@/app/components/table/paginated.component.vue'
import BadgeComponent from '@/app/components/badge/badge.component.vue'

import { defaultOptions, tableColumns, sort, badges } from '../schema/user-list.config'
import { UserService } from '../services/user.service'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { getUsersPaginated } = UserService

const loading = ref<boolean>(true)
const options = reactive<PaginationOptions>(defaultOptions)
const response = reactive<{ data: Array<UserDto>; meta: PaginationMeta | undefined }>({
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
  <TablePaginatedComponent
    v-model:options="options"
    :loading
    :columns="tableColumns"
    :rows="response.data"
    :pages="response.meta?.pageCount"
    :sort-options="sort"
    :caption="
      t(
        'administration.users.caption',
        {
          showing: response.data.length
        },
        response.meta?.itemCount || 0
      )
    "
  >
    <template v-slot>
      <button class="btn btn-dark btn-icon" disabled type="button">
        <font-awesome-icon size="lg" :icon="['fas', 'ellipsis-vertical']" />
      </button>
    </template>

    <template v-slot:user="{ row }">
      <div class="d-flex align-items-center">
        <div class="me-2">
          <img class="avatar-icon rounded-circle" :src="row.profile.avatar" />
        </div>
        <div class="d-flex flex-column flex-grow-1">
          <p class="text-light fw-semibold">
            {{ row.getFullName() }}
          </p>
          <small>{{ row.email }}</small>
        </div>
      </div>
    </template>

    <template v-slot:created="{ row }">
      {{ moment(row.createdAt).format('lll') }}
    </template>

    <template v-slot:role="{ row }">
      <BadgeComponent :theme="badges[row.role].theme">
        {{ $t(badges[row.role].label).toUpperCase() }}
      </BadgeComponent>
    </template>

    <template v-slot:actions>
      <div class="row gx-1 flex-nowrap">
        <button class="btn btn-dark btn-icon-sm border-0 px-0 text-light" type="button">
          <div class="d-flex align-items-center justify-content-center">
            <font-awesome-icon :icon="['fas', 'ellipsis']" />
          </div>
        </button>
      </div>
    </template>
  </TablePaginatedComponent>
</template>
