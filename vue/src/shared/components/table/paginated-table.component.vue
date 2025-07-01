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
    <div class="d-flex justify-content-between" style="column-gap: 1rem">
      <div class="d-flex flex-column flex-grow-1 gap-2">
        <SearchInputComponent
          :value="options.search"
          style="max-width: 30rem"
          @update="(value: string | undefined) => resetPageAndUpdateQuery({ search: value })"
        />
      </div>

      <div class="flex-shrink-1">
        <slot></slot>
      </div>
    </div>

    <div class="d-flex flex-column flex-md-row gap-3" v-if="sortOptions">
      <div class="d-flex flex-column gap-1" :style="{ minWidth: '20rem' }">
        <p class="fw-semibold text-light-alt">{{ $t('actions.sort-by') }}</p>
        <SelectInputComponent
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
      <slot name="filters"></slot>
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
        <caption v-if="caption" class="text-end text-light-alt fw-semibold px-2">
          <small>{{ caption }}</small>
        </caption>
      </table>
    </div>
    <div
      class="d-flex flex-column-reverse flex-sm-row justify-content-between align-items-center"
      style="column-gap: 1rem; row-gap: 2rem"
    >
      <SelectInputComponent
        name="take"
        style="width: 7.5rem"
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

      <PaginationInputComponent
        @update="(page: number) => updateQuery({ page })"
        :page="options.page"
        :total="pages || options.page"
        :offset="2"
      />
    </div>
  </div>
</template>
