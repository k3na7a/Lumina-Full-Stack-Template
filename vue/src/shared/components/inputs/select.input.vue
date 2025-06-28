<script setup lang="ts" generic="T">
import { onBeforeUnmount, onMounted, ref, toRef, watch } from 'vue'
import * as bootstrap from 'bootstrap'
import { useField } from 'vee-validate'

import { deepEqual } from '@/core/utils/object.util'

const props = defineProps<{
  name: string
  value?: T
  options: Array<T>
  disabled?: boolean
}>()

const emit = defineEmits<{ update: [value: T | undefined] }>()

const name = toRef(props, 'name')

const { value, errorMessage, meta } = useField<T | undefined>(name.value, undefined, { initialValue: props.value })

const isOpen = ref(false)
const isSyncing = ref<boolean>(false)
const dropdownRef = ref<InstanceType<typeof HTMLElement>>()

const activeIndex = ref<number>(0)
const optionRefs = ref<HTMLElement[]>([])

onMounted(() => {
  const dropdownEl = dropdownRef.value
  if (!dropdownEl) return

  const onShow = () => (isOpen.value = true)
  const onHide = () => (isOpen.value = false)

  dropdownEl.addEventListener('show.bs.dropdown', onShow)
  dropdownEl.addEventListener('hide.bs.dropdown', onHide)

  onBeforeUnmount(() => {
    dropdownEl.removeEventListener('show.bs.dropdown', onShow)
    dropdownEl.removeEventListener('hide.bs.dropdown', onHide)
  })
})

function onKeydownResolver(event: KeyboardEvent): void {
  if (!isOpen.value) return

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
    case 'Escape':
      closeDropdown()
      break
    default:
      break
  }
}

function navigate(direction: number): void {
  if (!props.options.length) return

  const next = activeIndex.value + direction

  if (next < 0) activeIndex.value = props.options.length - 1
  else if (next >= props.options.length) activeIndex.value = 0
  else activeIndex.value = next
}

function handleEnter(): void {
  if (activeIndex.value >= 0 && activeIndex.value < props.options.length)
    selectItem(props.options[activeIndex.value] as T)
}

function selectItem(item: T): void {
  value.value = item
}

const stopClick = (e: MouseEvent): void => e.stopPropagation()

function setOptionRef(el: HTMLElement | null): void {
  if (!el) return
  const index = parseInt(el.dataset.index!)
  optionRefs.value[index] = el
}

function closeDropdown(): void {
  const dropdown = bootstrap.Dropdown.getOrCreateInstance(dropdownRef.value || '')
  dropdown.hide()
}

function openDropdown(): void {
  if (isOpen.value) return

  const dropdown = bootstrap.Dropdown.getOrCreateInstance(dropdownRef.value || '')
  dropdown.show()
  isOpen.value = true
}

function onFocusOut(event: FocusEvent): void {
  const relatedTarget = event.relatedTarget as HTMLElement | null

  if (!dropdownRef.value?.contains(relatedTarget)) {
    closeDropdown()
  }
}

watch(
  () => props.value,
  (val: T | undefined) => {
    if (!deepEqual(val, value.value)) {
      isSyncing.value = true
      value.value = val
    }
  }
)

watch(value, (newVal: T | undefined) => {
  if (isSyncing.value) {
    isSyncing.value = false
    return
  }

  emit('update', newVal)
  closeDropdown()
})
</script>

<template>
  <div
    class="dropdown select border-0"
    :class="{ 'has-error': !!errorMessage && meta.touched, disabled: props.disabled }"
    ref="dropdownRef"
    v-click-outside="closeDropdown"
  >
    <button
      type="button"
      :disabled="props.disabled"
      class="select-btn bg-alt text-light w-100 d-flex align-items-stretch"
      @keydown="onKeydownResolver"
      @focusout="onFocusOut"
      @focus="openDropdown"
      @blur="closeDropdown"
      @click="openDropdown"
    >
      <div class="d-flex flex-grow-1 text-start px-2 align-items-center overflow-hidden">
        <span v-if="value" class="text-truncate"><slot name="option" :option="value"></slot></span>
        <span v-else class="text-grey text-truncate">select an option...</span>
      </div>
      <div class="d-flex align-items-center px-2">
        <font-awesome-icon :icon="['fas', 'angle-down']" />
      </div>
    </button>
    <ul
      @click="stopClick"
      role="listbox"
      class="dropdown-menu mt-0 w-100 text-light p-0"
      style="min-width: 100%"
      :aria-activedescendant="`option-${activeIndex}`"
    >
      <li
        v-for="(option, index) of props.options"
        :key="`option-${index}`"
        role="option"
        :data-index="index"
        :aria-selected="index === activeIndex"
      >
        <button
          tabindex="-1"
          ref="setOptionRef"
          class="dropdown-item d-flex justify-content-between align-items-center px-2"
          :class="{ active: deepEqual(value, option), highlight: index === activeIndex }"
          :disabled="deepEqual(value, option)"
          @mousedown.prevent="selectItem(option)"
          type="button"
        >
          <span class="text-truncate pe-2">
            <slot name="option" :option="option"></slot>
          </span>
        </button>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
@import '@/shared/sass/variables/index';

.highlight {
  background-color: $bg-hover;
}

.select {
  .select-btn {
    outline: none;
    border: 0.1rem $muted solid;
    height: 3rem;

    transition: all 0.15s ease-in-out;

    &:disabled {
      opacity: $disabled-opacity;
      color: $muted !important;
    }
  }

  .dropdown-menu {
    border: 0.1rem $muted solid;

    button {
      margin-bottom: 0px !important;
      outline: none;
    }
  }

  &:hover {
    .select-btn {
      box-shadow: 0 0 0 0.1rem $muted;
    }
  }

  &.has-error {
    .select-btn {
      border-color: $danger !important;
    }

    &:hover {
      .select-btn {
        box-shadow: 0 0 0 0.1rem $danger;
      }
    }
  }

  &:focus-within {
    .select-btn {
      border-color: $primary !important;
      box-shadow: 0 0 0 0.1rem $primary !important;
    }
  }

  &.disabled {
    pointer-events: none;
  }
}
</style>
