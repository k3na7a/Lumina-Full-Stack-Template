<script lang="ts" setup>
import { useCheckboxInput } from './composables/checkbox-input.composable'

const props = defineProps<{ name: string; label?: string }>()
const emit = defineEmits<{ update: [value: boolean] }>()

const { name, value, inputRef } = useCheckboxInput(props, emit)
</script>

<template>
  <div class="th-checkbox d-flex">
    <label :for="name" class="align-items-center">
      <input ref="inputRef" :id="name" :name class="opacity-0" type="checkbox" v-model="value" />
      <div class="d-flex align-items-center gap-2">
        <div class="d-flex justify-content-center align-items-center th-checkbox" :class="{ active: value }">
          <!-- <font-awesome-icon v-if="value" size="sm" class="text-light" :icon="['fas', 'check']" /> -->
          <span v-if="value" class="fw-normal text-primary">&#x2714;</span>
        </div>
        <p v-if="props.label" class="text-light-alt">{{ $t(props.label) }}</p>
      </div>
    </label>
  </div>
</template>
