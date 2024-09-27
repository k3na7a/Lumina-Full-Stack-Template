<script setup lang="ts" generic="T">
import SearchInputComponent from '@/app/components/inputs/input.search.component.vue'
import SelectInputComponent from '@/app/components/inputs/input.select.component.vue'
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
  <div class="d-flex justify-content-between mb-3" style="column-gap: 1rem">
    <div class="d-flex flex-column flex-grow-1 gap-2">
      <SearchInputComponent style="max-width: 30rem" @update="onFilterSubmit" />
      <div class="d-flex flex-column" style="width: 15rem" v-if="props.sortOptions">
        <p class="mb-1 fw-semibold text-light-alt">{{ $t('actions.sort-by') }}</p>
        <SelectInputComponent
          name="sort"
          @update="onSortUpdate"
          :default="props.sortOptions.find((e) => e.order == props.options.order && e.sort == props.options.sort)"
          :options="props.sortOptions"
        >
          <template v-slot:option="{ option }">
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
          <th scope="col" v-for="(column, idx) in props.columns" :key="`${column}-${idx}`">
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
          <tr v-for="(row, idx) in props.rows" :key="`${row}-${idx}`">
            <td v-for="column in props.columns" :key="`${column}-${idx}`">
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
    class="d-flex flex-column-reverse flex-sm-row mt-3 justify-content-between align-items-center"
    style="column-gap: 1rem; row-gap: 2rem"
  >
    <div class="d-flex w-100">
      <SelectInputComponent
        name="take"
        style="width: 8rem"
        @update="onTakeUpdate"
        :default="options.take"
        :options="[25, 50, 100]"
      >
        <template v-slot:option="{ option }">
          {{ option }}
        </template>
      </SelectInputComponent>
    </div>

    <PaginationInputComponent @update="onPageUpdate" :page="options.page" :total="pages || options.page" :offset="2" />
  </div>
</template>
