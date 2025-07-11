<script setup lang="ts" generic="T">
import { SortOptions } from '@/library/dto/pagination.dto'

import SearchInputComponent from '@/shared/components/inputs/search.input.vue'
import SelectInputComponent from '@/shared/components/inputs/select.input.vue'
import PaginationInputComponent from '@/shared/components/pagination/pagination.component.vue'

import { proptype, usePaginatedTable } from './composables/paginated-table.composable'

const { columns, rows, pages, options, loading, sortOptions, caption } = defineProps<proptype<T>>()
const { resetPageAndUpdateQuery, updateQuery } = usePaginatedTable()
</script>

<template>
  <div class="th-table-paginated d-flex flex-column gap-3">
    <div class="d-flex flex-row gap-3 align-items-center">
      <SelectInputComponent
        v-if="sortOptions"
        :style="{ minWidth: '20rem' }"
        :icon="['fas', 'arrow-down-a-z']"
        name="sort"
        @update="
            (sort: SortOptions | undefined) => {
              if (!sort) return
              resetPageAndUpdateQuery({ sort: sort.sort, order: sort.order })
            }
          "
        :value="sortOptions.find((e) => e.order == options.order && e.sort == options.sort)"
        :options="sortOptions"
      >
        <template #option="{ option }">
          {{ $t(option?.label) }}
        </template>
      </SelectInputComponent>
    </div>

    <div class="d-flex flex-column flex-md-row justify-content-between gap-3" style="column-gap: 1rem">
      <div class="d-flex flex-grow-1 search-bar">
        <SearchInputComponent
          :value="options.search"
          @update="(value: string | undefined) => resetPageAndUpdateQuery({ search: value })"
        />
      </div>

      <div class="d-flex gap-2 align-items-center justify-content-end">
        <small>{{ caption }}</small>
        <slot></slot>
      </div>
    </div>

    <div class="table-responsive text-nowrap container-overflow" style="overflow-x: auto">
      <table class="m-0" :class="{ disabled: loading }">
        <thead>
          <tr>
            <th scope="col" v-for="column in columns" :key="`${column.name}`">
              <div class="cell">
                <p class="fw-semibold" v-if="column.label">
                  {{ $t(column.label) }}
                </p>
              </div>
            </th>
          </tr>
        </thead>
        <template v-if="rows.length">
          <tbody>
            <template v-for="(row, idx) in rows" :key="`row:${idx}`">
              <tr>
                <td v-for="column in columns" :key="`${column.name}:${idx}`">
                  <div class="cell">
                    <slot :name="column.name" :row="row"></slot>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </template>
        <template v-else>
          <tbody>
            <tr>
              <td :colspan="columns.length">
                <div class="cell justify-content-start">
                  <p class="text-light fw-semibold">{{ $t('forms.no-results') }}</p>
                </div>
              </td>
            </tr>
          </tbody>
        </template>
      </table>
    </div>
    <div
      class="d-flex flex-column-reverse flex-sm-row justify-content-between align-items-end align-items-sm-center"
      style="column-gap: 1rem; row-gap: 2rem"
    >
      <i18n-t
        keypath="forms.pagination-rows"
        tag="small"
        class="fw-normal text-light-alt d-flex gap-2 align-items-center text-nowrap"
        scope="global"
      >
        <SelectInputComponent
          name="take"
          style="width: 7rem"
          @update="
          (take: number | undefined) => {
            if (!take) return
            resetPageAndUpdateQuery({ take })
          }
        "
          :value="options.take"
          :options="[25, 50, 100]"
        >
          <template #option="{ option }">
            {{ option }}
          </template>
        </SelectInputComponent>
      </i18n-t>

      <PaginationInputComponent
        @update="(page: number) => updateQuery({ page })"
        :page="options.page"
        :total="pages || options.page"
        :offset="2"
      />
    </div>
  </div>
</template>
