<script lang="ts" setup generic="T">
import { useI18n } from 'vue-i18n'

import { checkIds } from '@lib/utilities/object.util'

import { proptype, useSearchPaginatedInput } from './composables/search-paginated-input.composable'

const props = defineProps<proptype<T>>()

const { t } = useI18n()
const emit = defineEmits<{ update: [value: T[] | undefined] }>()

const {
  value,
  SearchRef,
  inputRef,
  response,
  filter,
  activeIndex,
  loading,
  selectItem,
  giveFocus,
  onFocus,
  closeDropdown,
  onKeydownResolver
} = useSearchPaginatedInput(props, emit)
</script>

<template>
  <div class="d-flex flex-column gap-1 w-100 search-paginated">
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
