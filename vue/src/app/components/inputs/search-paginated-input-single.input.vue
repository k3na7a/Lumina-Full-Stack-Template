<script lang="ts" setup generic="T">
import { useDebounceFn } from '@vueuse/core'
import { second } from '@/library/data/constants/time.constants'

import { onMounted, reactive, ref, toRef, UnwrapRef, watch } from 'vue'
import * as bootstrap from 'bootstrap'
import { Order, PaginationDto, PaginationOptions } from '@/library/data/dto/pagination.dto'
import { useField } from 'vee-validate'
import { deepEqual } from '@/library/helpers/object.util'

const props = defineProps<{
  name: string
  value?: T
  callback: (params: PaginationOptions) => Promise<PaginationDto<T>>
}>()

const name = toRef(props, 'name')
const SearchRef = ref<InstanceType<typeof HTMLElement>>()

const defaultOptions = {
  take: 25,
  order: Order.ASC,
  page: 1,
  search: undefined
}

const loading = ref<boolean>(true)
const filter = ref<string>()

const response = reactive<{ data: Array<T> }>({
  data: []
})

const { value } = useField<T | undefined>(name.value, undefined, {
  initialValue: props.value
})

const debouncedFn = useDebounceFn(async (val: string | undefined) => {
  loading.value = true
  await props
    .callback({
      ...defaultOptions,
      search: val
    })
    .then((res: PaginationDto<T>) => {
      response.data = res.data as UnwrapRef<T[]>
    })
    .finally(() => {
      loading.value = false
    })
}, 0.5 * second)

async function getData(): Promise<void> {
  loading.value = true
  await props
    .callback({
      ...defaultOptions,
      search: filter.value
    })
    .then((res: PaginationDto<T>) => {
      response.data = res.data as UnwrapRef<T[]>
    })
    .finally(() => {
      loading.value = false
    })
}

function closeDropdown(): void {
  const dropdown = bootstrap.Dropdown.getOrCreateInstance(SearchRef.value || '')
  dropdown.hide()
}

function openDropdown(): void {
  const dropdown = bootstrap.Dropdown.getOrCreateInstance(SearchRef.value || '')
  dropdown.show()
}

const inputRef = ref<InstanceType<typeof HTMLElement>>()
function giveFocus(event: PointerEvent): void {
  event.preventDefault()
  const input = inputRef.value as HTMLInputElement
  input.focus()
}

function onFocus(): void {
  openDropdown()
}

await getData()

watch(filter, debouncedFn)

const emit = defineEmits<{ update: [value: T | undefined] }>()
watch(value, (newVal: T | undefined) => {
  emit('update', newVal)
})

onMounted(() => {
  emit('update', value.value)
})
</script>

<template>
  <div class="d-flex flex-column gap-1 w-100">
    <div class="dropdown search" ref="SearchRef" v-click-outside="closeDropdown">
      <div class="search-input input-group flex-nowrap bg-alt d-flex align-items-stretch">
        <div v-if="value" class="display flex-shrink-1 align-items-center p-1 px-2 pe-0">
          <p
            class="text-light-alt text-nowrap text-truncate hover-cursor-pointer hover-underline"
            @click="value = undefined"
          >
            <slot name="option" :option="value"></slot>
          </p>
        </div>
        <input
          ref="inputRef"
          v-model="filter"
          type="text"
          class="w-100 mb-0 p-1 px-2"
          :placeholder="$t('actions.search.placeholder')"
          autocomplete="off"
          @focusin="onFocus"
        />
        <div class="d-flex flex-shrink-1 align-items-center px-2 hover-cursor-pointer" @pointerdown="giveFocus">
          <font-awesome-icon size="sm" :icon="['fas', 'list-check']" />
        </div>
      </div>
      <div
        class="dropdown-menu mt-0 w-100 text-light p-0"
        style="min-width: 100%"
        @pointerdown="(e) => e.preventDefault()"
      >
        <template v-if="loading">
          <button class="dropdown-item d-flex justify-content-between align-items-center px-2" disabled type="button">
            <span class="text-truncate pe-2">{{ $t('actions.searching') }}</span>
          </button>
        </template>
        <template v-else-if="!response.data.length">
          <button class="dropdown-item d-flex justify-content-between align-items-center px-2" disabled type="button">
            <span class="text-truncate pe-2"> No Results Found </span>
          </button>
        </template>
        <template v-else>
          <template v-for="item of response.data">
            <button
              class="dropdown-item d-flex justify-content-between align-items-center px-2"
              :class="{ active: deepEqual(value, item) }"
              :disabled="deepEqual(value, item)"
              @click="() => { value = item as T }"
              type="button"
            >
              <span class="text-truncate pe-2"><slot name="option" :option="item"></slot></span>
            </button>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/library/sass/variables/index';

.search {
  .dropdown-menu {
    border: 0.1rem solid $muted;
  }
}

.search-input.input-group {
  background-color: $backgroundAlt;
  border: 0.1rem $muted solid;
  height: 3rem;
  transition: all 0.15s ease-in-out;

  &:has(.disabled) {
    pointer-events: none;
    opacity: $disabled-opacity;
  }

  button {
    outline: none;

    &:focus {
      color: $primary !important;
    }
  }

  :disabled {
    color: $muted !important;
    opacity: 0.7;
  }

  &:hover {
    box-shadow: 0 0 0 0.1rem $muted;
  }

  &:focus-within {
    border-color: $primary !important;
    box-shadow: 0 0 0 0.1rem $primary !important;
  }

  & > * {
    border: none;
    background-color: transparent;
  }

  input {
    outline: none;
    min-width: none !important;
  }
}
</style>
