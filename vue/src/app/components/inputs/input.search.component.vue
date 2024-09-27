<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { second } from '@/library/constants/time.constants'

const props = defineProps<{ disabled?: boolean; value?: string }>()
const value = ref<string | undefined>(props.value)

const debouncedFn = useDebounceFn((val: string | undefined) => {
  emit('update', val || undefined)
}, 0.5 * second)

const emit = defineEmits<{ update: [value: string | undefined]; submit: [value: string | undefined] }>()
watch(value, (val: string | undefined) => {
  debouncedFn(val)
})

onMounted(() => {
  emit('update', value.value)
})
</script>

<template>
  <div class="search-input input-group flex-nowrap bg-alt d-flex align-items-stretch">
    <span class="input-group-text text-light">
      <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
    </span>
    <input
      v-model="value"
      type="text"
      class="w-100 mb-0 p-1"
      name="search"
      :class="{ disabled }"
      :placeholder="$t('actions.search.placeholder')"
      :disabled="props.disabled"
      autocomplete="off"
    />
    <button
      :disabled="!value || disabled"
      class="text-light px-2"
      v-on:pointerdown.prevent
      v-on:click="value = undefined"
    >
      <div class="d-flex align-items-center">
        <font-awesome-icon :icon="['fas', 'xmark']" />
      </div>
    </button>
  </div>
</template>
