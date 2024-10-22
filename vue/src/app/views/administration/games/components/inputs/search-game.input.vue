<script lang="ts" setup>
import { useDebounceFn } from '@vueuse/core'
import { second } from '@/library/data/constants/time.constants'

import { reactive, ref, toRef, watch } from 'vue'
import * as bootstrap from 'bootstrap'
import { GameLibraryService } from '../../service/game-library.service'
import { Order, PaginationDto } from '@/library/data/dto/pagination.dto'
import { GameDto } from '@/library/data/dto/games/game.dto'
import { useField } from 'vee-validate'
import { deepEqual } from '@/library/utilities/helpers/object.util'

const props = defineProps<{ name: string; value?: Array<GameDto> }>()
const name = toRef(props, 'name')

const gameSearchRef = ref<InstanceType<typeof HTMLElement>>()

const { getPaginated } = GameLibraryService.games

const defaultOptions = {
  take: 10,
  order: Order.ASC,
  page: 1,
  sort: 'game.createdAt',
  search: undefined
}

const loading = ref<boolean>(true)
const filter = ref<string>()

const response = reactive<{ data: Array<GameDto> }>({
  data: []
})

const { value, errorMessage, meta } = useField<GameDto[] | undefined>(name.value, undefined, {
  initialValue: props.value
})

const debouncedFn = useDebounceFn(async (val: string | undefined) => {
  loading.value = true
  await getPaginated({
    ...defaultOptions,
    search: val
  })
    .then((res: PaginationDto<GameDto>) => {
      response.data = res.data
    })
    .finally(() => {
      loading.value = false
    })
}, 0.5 * second)

function closeDropdown(): void {
  const dropdown = bootstrap.Dropdown.getOrCreateInstance(gameSearchRef.value || '')

  response.data = []
  dropdown.hide()
}

function openDropdown(): void {
  const dropdown = bootstrap.Dropdown.getOrCreateInstance(gameSearchRef.value || '')

  loading.value = true
  dropdown.show()

  debouncedFn(filter.value)
}

const inputRef = ref<InstanceType<typeof HTMLElement>>()
function giveFocus(event: PointerEvent): void {
  event.preventDefault()
  const input = inputRef.value as HTMLInputElement
  input.focus()
}

function removeValue(event: MouseEvent): void {
  event.preventDefault()
  closeDropdown()

  const target = event.target as HTMLElement
  target.focus()

  if (value.value) value.value = value.value.filter((_, idx) => idx != parseInt(target.id))
}

function onFocus(): void {
  loading.value = true
  openDropdown()
  debouncedFn(filter.value)
}

function onClear(): void {
  filter.value = undefined
  openDropdown()
}

watch(filter, debouncedFn)
</script>

<template>
  <div class="d-flex flex-column gap-1">
    <div class="dropdown gameSearch" ref="gameSearchRef" v-click-outside="closeDropdown">
      <div class="search-input input-group flex-nowrap bg-alt d-flex align-items-stretch">
        <span class="input-group-text text-light" @pointerdown="giveFocus">
          <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
        </span>
        <input
          ref="inputRef"
          v-model="filter"
          type="text"
          class="w-100 mb-0 p-1"
          :placeholder="$t('actions.search.placeholder')"
          autocomplete="off"
          @focusin="onFocus"
        />
        <button class="text-light px-2" @pointerdown.prevent @click="onClear" :disabled="!filter">
          <div class="d-flex align-items-center">
            <font-awesome-icon :icon="['fas', 'xmark']" />
          </div>
        </button>
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
          <template v-for="game of response.data">
            <button
              class="dropdown-item d-flex justify-content-between align-items-center px-2"
              :class="{ active: value?.some((e) => deepEqual(e, game)) }"
              :disabled="value?.some((e) => deepEqual(e, game))"
              @click="value?.push(game)"
              type="button"
            >
              <span class="text-truncate pe-2">{{ game.name }}</span>
            </button>
          </template>
        </template>
      </div>
    </div>
    <div class="d-flex flex-wrap gap-1" v-if="value?.length">
      <div
        v-for="(selection, idx) of value"
        class="px-1 d-flex align-items-stretch gap-1"
        :key="`${idx}:${JSON.stringify(selection)}`"
      >
        <button :id="`${idx}`" @click="removeValue" class="option-button btn btn-link fw-normal">
          {{ selection.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '@/library/sass/variables/index';

.gameSearch {
  .dropdown-menu {
    border: 0.1rem solid $muted;
  }
}
</style>
