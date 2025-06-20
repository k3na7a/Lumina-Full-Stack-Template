<script lang="ts" setup generic="T">
import { useDebounceFn } from '@vueuse/core'
import { second } from '@/shared/constants/time.constants'

import { reactive, ref, toRef, UnwrapRef, watch } from 'vue'
import * as bootstrap from 'bootstrap'
import { useField } from 'vee-validate'
import { checkIds, deepEqual } from '@/core/utilities/object.util'
import { useI18n } from 'vue-i18n'
import { PaginationOptions, PaginationDto, Order } from '@/core/apis/dto/pagination.dto'

const props = defineProps<{
  name: string
  auto?: boolean
  value?: Array<T>
  options: PaginationOptions
  callback: (params: PaginationOptions) => Promise<PaginationDto<T>>
}>()

const defaultOptions: PaginationOptions = {
  take: 25,
  order: Order.ASC,
  page: 1,
  search: undefined,
  sort: 'platform.name'
}

const { t } = useI18n()
const emit = defineEmits<{ update: [value: T[] | undefined] }>()

const name = toRef(props, 'name')
const response = reactive<{ data: Array<T> }>({ data: [] })
const { value } = useField<T[]>(name.value, undefined, { initialValue: props.value || [] })

const SearchRef = ref<InstanceType<typeof HTMLElement>>()
const activeIndex = ref<number>(-1)
const optionRefs = ref<HTMLElement[]>([])
const inputRef = ref<InstanceType<typeof HTMLElement>>()
const isSyncing = ref<boolean>(false)
const loading = ref<boolean>(true)
const filter = ref<string>()

const debouncedFn = useDebounceFn(async (val: string | undefined) => {
  loading.value = true
  await props
    .callback({
      ...defaultOptions,
      sort: props.options.sort,
      search: val
    })
    .then((res: PaginationDto<T>) => {
      response.data = res.data as UnwrapRef<T[]>
    })
    .finally(() => {
      loading.value = false
    })
}, 0.5 * second)

function resetNavigation(): void {
  activeIndex.value = 0
  optionRefs.value = []
}

function closeDropdown(): void {
  const dropdown: bootstrap.Dropdown = bootstrap.Dropdown.getOrCreateInstance(SearchRef.value || '')

  dropdown.hide()
}

function openDropdown(): void {
  const dropdown: bootstrap.Dropdown = bootstrap.Dropdown.getOrCreateInstance(SearchRef.value!)

  const isOpen: boolean | undefined = SearchRef.value?.querySelector('.dropdown-menu')?.classList.contains('show')
  if (isOpen) return

  dropdown.show()
  resetNavigation()
}

function onKeydownResolver(event: KeyboardEvent): void {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      navigate(1)
      break
    case 'ArrowUp':
      event.preventDefault()
      navigate(-1)
      break
    case 'Enter':
      event.preventDefault()
      handleEnter()
      break
    case 'Delete':
      clear()
      break
    case 'Backspace':
      onBackspace()
      break
    case 'Escape':
      closeDropdown()
      break
    default:
      break
  }
}

function giveFocus(event: PointerEvent): void {
  event.preventDefault()
  const input = inputRef.value as HTMLInputElement
  input.focus()
}

function onBackspace(): void {
  if (!filter.value && value.value?.length) value.value.pop()
}

function onFocus(): void {
  openDropdown()
}

function clear(): void {
  value.value?.splice(0)
}

function navigate(direction: number): void {
  if (!response.data.length) return

  const next = activeIndex.value + direction

  if (next < 0) activeIndex.value = response.data.length - 1
  else if (next >= response.data.length) activeIndex.value = 0
  else activeIndex.value = next
}

function handleEnter(): void {
  if (activeIndex.value >= 0 && activeIndex.value < response.data.length)
    selectItem(response.data[activeIndex.value] as T)
}

function selectItem(item: T): void {
  if (!value.value?.some((e) => checkIds(e, item))) value.value?.push(item)
}

function setOptionRef(el: HTMLElement | null): void {
  if (!el) return
  const index = parseInt(el.dataset.index!)
  optionRefs.value[index] = el
}

watch(
  () => props.value,
  (val: T[] | undefined) => {
    if (!deepEqual(val, value.value)) {
      isSyncing.value = true
      value.value = val || []
    }
  }
)

watch(value, (newVal: T[] | undefined) => {
  if (isSyncing.value) {
    isSyncing.value = false
    return
  }

  emit('update', newVal)
  closeDropdown()
})

watch(filter, debouncedFn, { immediate: true })
watch(
  () => response.data,
  () => resetNavigation()
)
</script>

<template>
  <div class="d-flex flex-column gap-1 w-100">
    <div class="dropdown search" ref="SearchRef">
      <div class="search-input input-group flex-nowrap bg-alt d-flex align-items-stretch hover-cursor-pointer">
        <div
          v-if="value?.length"
          class="display flex-shrink-1 align-items-center p-1 px-2 pe-0"
          @pointerdown="giveFocus"
        >
          <p class="text-light-alt text-nowrap fst-italic text-truncate">
            {{ t('forms.items-selected', value.length) }}
          </p>
        </div>
        <input
          :name="props.name"
          ref="inputRef"
          v-model="filter"
          type="text"
          class="w-100 mb-0 p-1 px-2"
          :placeholder="$t('actions.search.placeholder')"
          autocomplete="off"
          @focus="onFocus"
          @focusout="closeDropdown"
          @keydown="onKeydownResolver"
          @blur="closeDropdown"
          tabindex="0"
        />
        <div class="d-flex flex-shrink-1 align-items-center px-2 hover-cursor-pointer" @pointerdown="giveFocus">
          <font-awesome-icon size="sm" :icon="['fas', 'list-check']" />
        </div>
      </div>
      <div
        class="dropdown-menu mt-0 w-100 text-light p-0"
        style="min-width: 100%"
        @pointerdown="(e) => e.preventDefault()"
        role="listbox"
        :aria-activedescendant="`option-${activeIndex}`"
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
          <template v-for="(item, index) of response.data">
            <button
              role="option"
              :data-index="index"
              :aria-selected="index === activeIndex"
              tabindex="-1"
              ref="setOptionRef"
              :disabled="value?.some((e) => checkIds(e, item))"
              class="dropdown-item d-flex justify-content-between align-items-center px-2"
              :class="{ active: value?.some((e) => checkIds(e, item)), highlight: index === activeIndex }"
              type="button"
              @click="selectItem(item as T)"
            >
              <span class="text-truncate pe-2">
                <slot name="option" :option="item"></slot>
              </span>
            </button>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/shared/sass/variables/index';

.highlight {
  background-color: $bg-hover;
}

.search {
  .dropdown-menu {
    border: 0.1rem solid $muted;
    max-height: 20rem;
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
