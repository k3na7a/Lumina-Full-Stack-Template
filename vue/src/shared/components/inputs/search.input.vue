<script setup lang="ts">
import { useSearchInput } from './composables/search-input.composable'

const props = defineProps<{ disabled?: boolean; value?: string }>()
const emit = defineEmits<{ update: [value: string | undefined]; submit: [value: string | undefined] }>()

const { value, giveFocus, inputRef } = useSearchInput(props, emit)
</script>

<template>
  <div class="th-search-input input-group flex-nowrap bg-alt d-flex align-items-stretch">
    <span class="input-group-text text-light" @pointerdown="giveFocus">
      <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
    </span>
    <input
      ref="inputRef"
      v-model="value"
      type="text"
      class="w-100 mb-0 p-1"
      name="search"
      :class="{ disabled }"
      :placeholder="$t('actions.search.placeholder')"
      :disabled="props.disabled"
      autocomplete="off"
    />
    <button :disabled="!value || disabled" class="text-light px-2" @pointerdown.prevent @click="value = undefined">
      <div class="d-flex align-items-center">
        <font-awesome-icon :icon="['fas', 'xmark']" />
      </div>
    </button>
  </div>
</template>
