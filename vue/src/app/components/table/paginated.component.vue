<script setup lang="ts" generic="T">
import SearchInputComponent from '@/app/components/inputs/search.input.vue'
import SelectInputComponent from '@/app/components/inputs/select.input.vue'
import PaginationInputComponent from '@/app/components/pagination/pagination.component.vue'
import { PaginationOptions, SortOptions } from '@/library/dto/pagination.dto'
import { reactive, watch } from 'vue'

const props = defineProps<{
  columns: Array<{ label: string; name: string }>
  caption?: string
  rows: Array<T>
  pages: number | undefined
  options: PaginationOptions
  loading?: boolean
  sortOptions?: Array<SortOptions>
}>()

const options = reactive<PaginationOptions>(props.options)

const emit = defineEmits(['update:options'])
watch(options, (newVal: PaginationOptions) => {
  emit('update:options', newVal)
})

function onFilterSubmit(value: string | undefined): void {
  options.search = value
}

function onTakeUpdate(take: number | undefined): void {
  if (take) options.take = take
}

function onSortUpdate(sort: SortOptions | undefined): void {
  if (sort) {
    options.order = sort.order
    options.sort = sort.sort
  }
}

function onPageUpdate(page: number): void {
  options.page = page
}
</script>

<template>
  <div class="d-flex flex-column gap-3">
    <div class="d-flex justify-content-between" style="column-gap: 1rem">
      <div class="d-flex flex-column flex-grow-1 gap-2">
        <SearchInputComponent style="max-width: 30rem" @update="onFilterSubmit" />
        <div class="d-flex flex-column gap-1" style="max-width: 15rem" v-if="props.sortOptions">
          <p class="fw-semibold text-light-alt">{{ $t('actions.sort-by') }}</p>
          <SelectInputComponent
            name="sort"
            @update="onSortUpdate"
            :default="props.sortOptions.find((e) => e.order == props.options.order && e.sort == props.options.sort)"
            :options="props.sortOptions"
          >
            <template #option="{ option }">
              {{ $t(option?.label) }}
            </template>
          </SelectInputComponent>
        </div>
      </div>

      <div class="flex-shrink-1">
        <slot></slot>
      </div>
    </div>
    <div class="table-responsive" style="overflow-x: auto">
      <table class="m-0" :class="{ disabled: props.loading }">
        <thead>
          <tr>
            <th scope="col" v-for="column in props.columns" :key="`${column.name}`">
              <div class="cell">
                <span class="fw-bold">
                  {{ $t(column.label) }}
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <template v-if="rows.length">
          <tbody>
            <tr v-for="(row, idx) in props.rows" :key="`row:${idx}`">
              <td v-for="column in props.columns" :key="`${column.name}:${idx}`">
                <div class="cell">
                  <slot :name="column.name" :row="row"></slot>
                </div>
              </td>
            </tr>
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
      <div class="d-flex w-100">
        <SelectInputComponent
          name="take"
          style="width: 7.5rem"
          @update="onTakeUpdate"
          :default="options.take"
          :options="[25, 50, 100]"
        >
          <template #option="{ option }">
            {{ option }}
          </template>
        </SelectInputComponent>
      </div>

      <PaginationInputComponent
        @update="onPageUpdate"
        :page="options.page"
        :total="pages || options.page"
        :offset="2"
      />
    </div>
  </div>
</template>

<style lang="scss">
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

  td:last-child,
  th:last-child {
    .cell {
      justify-content: end;
    }
  }
}
</style>
