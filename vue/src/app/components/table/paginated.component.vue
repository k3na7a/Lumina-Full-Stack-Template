<script setup lang="ts" generic="T">
import SearchInputComponent from '@/app/components/inputs/search.input.vue'
import SelectInputComponent from '@/app/components/inputs/select.input.vue'
import PaginationInputComponent from '@/app/components/pagination/pagination.component.vue'
import { PaginationOptions, SortOptions } from '@/library/apis/localhost/dto/pagination.dto'
import { LocationQueryRaw, RouteLocationNormalizedLoaded, Router, useRoute, useRouter } from 'vue-router'

const $router: Router = useRouter()
const $route: RouteLocationNormalizedLoaded = useRoute()

const props = defineProps<{
  columns: Array<{ label: string; name: string }>
  rows: Array<T>
  pages: number | undefined
  options: PaginationOptions
  loading?: boolean
  sortOptions?: Array<SortOptions>
  caption?: string
}>()

function updateQuery(params: LocationQueryRaw): void {
  const next = { ...$route.query, ...params }

  if (JSON.stringify($route.query) !== JSON.stringify(next)) {
    $router.replace({ query: next })
  }
}

function resetPageAndUpdateQuery(params: LocationQueryRaw) {
  updateQuery({ ...params, page: undefined })
}
</script>

<template>
  <div class="d-flex flex-column gap-3">
    <div class="d-flex justify-content-between" style="column-gap: 1rem">
      <div class="d-flex flex-column flex-grow-1 gap-2">
        <SearchInputComponent
          :value="props.options.search"
          style="max-width: 30rem"
          @update="(value: string | undefined) => resetPageAndUpdateQuery({ search: value })"
        />
      </div>

      <div class="flex-shrink-1">
        <slot></slot>
      </div>
    </div>

    <div class="d-flex flex-column flex-md-row gap-3" v-if="props.sortOptions">
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
          :value="props.sortOptions.find((e) => e.order == props.options.order && e.sort == props.options.sort)"
          :options="props.sortOptions"
        >
          <template #option="{ option }">
            {{ $t(option?.label) }}
          </template>
        </SelectInputComponent>
      </div>
      <slot name="filters"></slot>
    </div>

    <div class="table-responsive text-nowrap container-overflow" style="overflow-x: auto">
      <table class="m-0" :class="{ disabled: props.loading }">
        <thead>
          <tr>
            <th scope="col" v-for="column in props.columns" :key="`${column.name}`">
              <div class="cell">
                <p class="fw-semibold">
                  {{ $t(column.label) }}
                </p>
              </div>
            </th>
          </tr>
        </thead>
        <template v-if="rows.length">
          <tbody>
            <template v-for="(row, idx) in props.rows" :key="`row:${idx}`">
              <tr>
                <td v-for="column in props.columns" :key="`${column.name}:${idx}`">
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
        :value="props.options.take"
        :options="[25, 50, 100]"
      >
        <template #option="{ option }">
          {{ option }}
        </template>
      </SelectInputComponent>

      <PaginationInputComponent
        @update="(page: number) => updateQuery({ page })"
        :page="props.options.page"
        :total="pages || options.page"
        :offset="2"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/library/sass/variables/index';

table {
  width: 100%;
  border-collapse: collapse;

  border-bottom: 0.1rem $primary solid;
  border-top: 0.1rem $secondary solid;

  &.disabled {
    tbody {
      pointer-events: none;
      opacity: $disabled-opacity;
    }
  }

  thead {
    background-color: rgba(0, 0, 0, 0.12);
    border-bottom: 0.1rem $primary solid;
  }

  tbody {
    color: $lightAlt;
    transition: opacity 0.15s ease-in-out;

    tr {
      border-bottom: 0.1rem $secondary solid;

      &:nth-of-type(even) {
        background-color: rgba(255, 255, 255, 0.04);
      }
    }
  }

  .cell {
    min-height: 5rem;
    padding: 1rem;
    display: flex;
    align-items: center;

    .badge {
      font-size: $font-size-8 !important;
    }
  }

  td {
    min-width: fit-content !important;
  }

  td:not(:first-child),
  th:not(:first-child) {
    .cell {
      justify-content: end;
    }
  }
}
</style>
